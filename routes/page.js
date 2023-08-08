import {
  Button,
  Card,
  Col,
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

  return {todos: todos.data};
}

export async function update({ ctx, body }) {
  await ctx.table("todos").update(body.id, {
    todo: body.todo,
    completed: body.completed,
  });

  return {
    body: {
      success: true,
    },
  };
}

export async function add({ ctx, body }) {
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

export default ({todos}) => {
  return [
    View([
        View(todos.map(todo=>View(todo.todo))),
        Form({$data: {todo: '', completed: false}}, [
            Input({ name: "username", label: 'Username' }),
          
            Col({ col: 12, mb: "sm" }, [
              View({ border: true, borderColor: 'base-400', p: "sm"}, [
                View(["Username: ", View({ $text: "username" })]),
              ]),
            ]),
            Col({ justify: 'end'}, [
              Button({ type: "submit", color: 'primary' }, "Submit"),
            ])
          ])
    ])
  ];
};
