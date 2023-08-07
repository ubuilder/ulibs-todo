export function isUrlChildOfLayout(requestUrl, pageUrl) {
    const requestSplitted = normalizeUrl(requestUrl).split('/')
    const pageSplitted = normalizeUrl(pageUrl).split('/')

    // case: (page: /test/abc/sdef) (request: /abc)
    if(pageSplitted.length > requestSplitted.length) return false;
    
    // case (page: /abc) (request: /asde)
    if(pageSplitted.length === requestSplitted.length) {
      for(let i=0; i<pageSplitted.length; i++) {
        // case (page: /:id) (request: /abc)
        if(pageSplitted[i].startsWith(':') || pageSplitted[i] === '') {
          continue;
        } else {

          // case (page: /abc) (request: /abc)
          if(pageSplitted[i] === requestSplitted[i]) {
            continue
          } 
            // case (page: /abc) (request: /def)
          else
           {
            return false
          }
        }
      }
      return true;
    }

    // case (page: /abcd/abc) (request: /abcd/adb/sdafk/sdfew)
    if(pageSplitted.length < requestSplitted.length) {
        let result = true
      for(let i=0; i<requestSplitted.length; i++) {
        // case (page: /:id) (request: /3/edit)
        if(pageSplitted[i]) {
          if(pageSplitted[i].startsWith(':') || pageSplitted[i] === '') {
            continue
          } else if(pageSplitted[i] !== requestSplitted[i]) {
            return false;
          }
        } else {
          result = true
        }
      }
      return result;
    }

    // return requestUrl.startsWith(pageUrl)
  }
  

  export function normalizeUrl(url) {
    if(url !== '/' && url.endsWith('/')) url = url.substring(0, url.length - 1)

    return url
  }
