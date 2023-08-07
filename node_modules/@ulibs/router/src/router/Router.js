import findMyWay from "find-my-way";
import http from "http";
import * as qs from "qs";
import sirv from "sirv";
import busboy from "busboy-wrapper";

import { WebSocketServer } from "ws";
import { cpSync, existsSync, fstat, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { isUrlChildOfLayout, normalizeUrl } from "./utils.js";

export function Router({ dev = false, reloadTimeout = 300 } = {}) {
  const app = findMyWay();
  let ws_port = 3040;

  let pages = {}
  let staticFiles = []

  function startWebSocketServer() {
    try {
      new WebSocketServer({
        port: ws_port,
      });
    } catch (err) {
      ws_port = ws_port + 1;
      startWebSocketServer();
    }
  }

  if (dev) {
    startWebSocketServer();

    app.get("/dev-client.js", (req, res) => {
      const script = `const s = new WebSocket("ws://localhost:${ws_port}");

s.onclose = function(event) {
    setTimeout(() => {
      location.reload()
    }, ${reloadTimeout})
}`;
      res.end(script);
    });
  }

  const layouts = [];


  function startServer(port = 3000) {
    console.log("server started at http://localhost:" + port);
    return http
      .createServer((req, res) => {
        req.url = normalizeUrl(req.url)

        app.lookup(req, res);
      })
      .listen(port);
  }

  function handleRequest(req, res) {
    req.url = normalizeUrl(req.url)
        
    return app.lookup(req, res);
  }

  async function parseBody(req) {
    try {
      const { files, fields } = await busboy(req);

      return {
        files,
        body: fields,
      };
    } catch (err) {
      // body type is json
      return new Promise((resolve) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => resolve({ body: JSON.parse(body), files: {} }));
      });
    }
  }


  function getLoadRequest(req, params) {

    const queryString = req.url.split("?")[1];
    return {
      get url() {
        return req.url;
      },
      get headers() {
        return req.headers ?? {};
      },
      get params() {
        return params;
      },
      get query() {
        return qs.parse(queryString ?? '');
      },
      locals: {},
    };
  }

  function getLoads(url, page) {
    return [
      ...layouts
        .filter((layout) => isUrlChildOfLayout(url, layout.route))
        .map((layout) => layout.load),
      page.load,
    ].filter(Boolean);
  }

  const helpers = {
    redirect({ path, status = 301, headers = {} } = {}) {
      throw new Error(
        JSON.stringify({
          status,
          headers: {
            ...headers,
            location: path,
          },
        })
      );
    },
    ok({ message = "success!", status = 200, body } = {}) {
      throw new Error(
        JSON.stringify({
          status,
          headers: {},
          body: body ?? {
            message,
          },
        })
      );
    },
    fail({ message = "Something went wrong!", body, status = 400 } = {}) {
      throw new Error(
        JSON.stringify({
          status,
          headers: {},
          body: body ?? {
            message,
          },
        })
      );
    },
  };

  async function runLoad(req, params, page) {
    const request = getLoadRequest(req, params, page);
    let result = {};
    let loads = getLoads(req.url, page);

    for (let index = 0; index < loads.length; index++) {
      result = { ...result, ...(await loads[index](request, helpers)) };
    }
    return result;
  }

  function getComponents(url, page) {
    return [
      ...layouts
        .filter((layout) => isUrlChildOfLayout(url, layout.route))
        .map((layout) => layout.component),
      page.page,
    ];
  }

  function renderPage(url, props, page) {
    let result;
    const components = getComponents(url, page);

    // let pageComponent = page(props);
    for (let i = components.length - 1; i >= 0; i--) {
      const comp =
        typeof components[i] === "string"
          ? () => components[i]
          : components[i];
      
      if (comp) {
        result = comp(props, result);
      }
    }

    if(!result) return ''

    const head = result.toHead?.() ?? "";
    const template = result.toString();
    const script = result.toScript?.() ?? "";

    const devScript = dev ? `<script src="/dev-client.js"></script>` : "";

    return `<html>
<head>
${head}
</head>
<body>
${template}
<script>
    ${script}
</script>
${devScript}
</body>
</html>`;
  }


  function addPage(
    route,
    { load = undefined, page = undefined, actions = {}}
  ) {
    route = normalizeUrl(route)
        
    pages[route] = {page, load, actions}
    app.get(route, async (req, res, params) => {
         
      let props = {};
      let result;

      try {
        props = await runLoad(req, params, pages[route]);

        if (page) {
          result = renderPage(req.url, props, {page});
        } else {
          result = JSON.stringify(props);
        }
        return res.end(result);
      } catch (err) {
        try {
          const result = JSON.parse(err.message);

          res
            .writeHead(result?.status ?? 400, result?.headers ?? {})
            .end(result?.body ? JSON.stringify(result.body) : "");
        } catch (err2) {
          throw err;
        }
        console.log("ERROR: ", err.message);
      }
    });

    app.post(route, async (req, res, params, store, query) => {
      function getActionName() {
        for (let key in query) {
          if (query[key] === "") {
            return key;
          }
        }

        return null;
      }

      function getActions() {
        return [
          ...layouts
            .filter((layout) => isUrlChildOfLayout(req.url, layout.route))
            .map((layout) => layout.actions),
          actions,
        ].filter(Boolean);
      }

      function getCurrentAction() {
        const actionName = getActionName();

        if (!actionName) return () => ({});

        for (let actionObject of getActions()) {
          if (actionObject[actionName]) {
            return actionObject[actionName];
          }
        }
        return () => ({});
      }

      async function getRequest() {
        const { body, files } = await parseBody(req);

        
        let request = {
          get files() {
            return files;
          },
          get body() {
            return body;
          },
          get query() {
            return query;
          },
          get params() {
            return params;
          },
          locals: {},
        };

        return request;
      }

      const request = await getRequest();

      const helpers = {
        redirect({path, status=303, headers = {}}){
          return {
            status,
            headers: {
              location: path,
              ...headers
            },
            body: {}
          }
        },
        fail({message = 'something went wrong', status = 400, headers = {}, body}){
          return {
            status,
            headers: {
              ...headers
            },
            body: body ?? {message}
          }
        },
        ok({message = 'success', status = 200, headers = {}, body}){
          return {
            status,
            headers: {
              ...headers
            },
            body: body ?? {message}
          }
        }
      }
      const result = await getCurrentAction()(request, helpers);

      res
        .writeHead(result?.status ?? 200, result?.headers ?? {})
        .end(result?.body ? JSON.stringify(result.body) : "");
    });
  }

  function addLayout(route, { component, load, actions } = {}) {
    route = normalizeUrl(route)

    layouts.push({ route, component, load, actions });
  }

  function removePage(route) {
    delete pages[route]
    app.delete(route);
  }

  function addStatic({path, prefix = '/'} = {}) {
    staticFiles = [...staticFiles, {prefix, path}]

    console.log('serve static ' + path)
    
    // const files = readdirSync(path)
    const handler = sirv(path, {
      dev,
    });

    app.get(prefix + "*", (req, res, params, store, query) => {
      
      return handler(req, res, () => {
        res.writeHead(200, {'Content-type': 'text/javascript'})
        res.end(
        readFileSync(
          join(path, req.url.replace(prefix, ''))
          , 'utf-8')
          )
    });
    });
  }

  async function build(output) {
    if(existsSync(output) && output !== './' && output !== '.') {
      rmSync(output, {recursive: true})

      mkdirSync(output)
    }

    // copy static files
    staticFiles.map(({path, prefix}) => {
      cpSync(path , output + prefix, {recursive: true})            
    })

 
    await Promise.all(Object.keys(pages).map(async key => {
 
      let result;

      try {
        const props = await runLoad({url: key}, {}, pages[key]);

        if(!existsSync(output + key)) mkdirSync(output + key, {recursive: true})
        if (pages[key].page) {
          result = renderPage(key, props, pages[key]);

          writeFileSync(output + key + '/' + 'index.html', result)

        } else {
          result = JSON.stringify(props);

          writeFileSync(output + key + '/' + 'index.json', result)

        }

        // return res.end(result);
      }catch(err) {
        console.log(err)
      }
      
      
    }))

    console.log('app built successfully at ' + process.cwd() + output.replace('./', '/'))
    process.exit(0)

  }

  return {
    startServer,
    handleRequest,
    addPage,
    addStatic,
    addLayout,
    removePage,
    build
  };
}
