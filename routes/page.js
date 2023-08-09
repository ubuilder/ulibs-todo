import {
  Button,
  Card,
  Checkbox,
  Col,
  Container,
  Form,
  FormField,
  Icon,
  Input,
  Row,
  View,
} from "@ulibs/ui";

export async function load({ ctx }) {

  const todos = await ctx.table("todos").query();

  if (!todos) {
    return {};
  }

  return { todos: todos.data };
}

export async function update({ ctx, body }) {
  await ctx.table("todos").update(body.id, {
    todo: body.todo,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function add_todo({ ctx, body }) {
  const page = {
    todo: body.todo,
    completed: body.completed,
  };

  await ctx.table("todos").insert(page);

  return {
    body: {
      success: true,
    },
  };
}

export async function change_status({ctx, body}){
  await ctx.table("todos").update(body.id, {completed: body.completed})

  return {
    body: {
      success: true,
    },
  };
}

export async function delete_todos({ctx, body}){
  await ctx.table("todos").remove(body.id)

  return {
    body: {
      success: true,
    },
  }; 
}

export default ({ todos }) => {
  return View({ d: "flex" }, [
    Container({ size: "md", mx: "auto", py: "3xl" }, [
      View({ style: "text-align: center", my: "2xl" }, "<h1>Todos</h1>"),
      View(
        {
          htmlHead:
            '<link rel="stylesheet" href="/dist/styles.css"/><script src="/dist/ulibs.js"></script>',
        },
        [
          Form(
            {
              $data: { todo: "", completed: false },
              align: "end",
              onSubmit: `$post('?add_todo', {todo, completed}).then(a => location.reload())`,
            },
            [
              Input({ col: true, name: "todo", placeholder: "todo..." }),
              Col({ justify: "end" }, [
                Button({ type: "submit", color: "primary" }, "Submit"),
              ]),
            ]
          ),
          View({ w: "100", p: "md", my: "xl", bgColor: "base-200" }, [
            todos.map((todo) =>
              View({ p: "sm", bgColor: "base-300", mb: "xxs", d: "flex" }, [
                View({textColor: 'secondary'},todo.todo),
                View({ d: "flex", ms: "auto" }, [
                  Checkbox({checked: todo.completed ,style: 'transform: scale(2)', alignSelf: 'center', mt: 'xs', onChange:`$post('?change_status',{id:'${todo.id}', completed: ${!todo.completed}}).then(a => navigation.reload())`}),
                  Button({color: 'success'}, "edit"),
                  Button({color: 'error',
                  onClick:`$post('?delete_todos',{id:'${todo.id}'}).then(a => navigation.reload())`
                },"delete"),
                ]),
              ])
            ),
          ]),
        ]
      ),
    ]),
  ]);
};
