// import { connect } from "./src/connect.js";

// const { createTable, getModel } = connect({
//   filename: "test.db",
// });

// await createTable("tasks", {
//   title: "string|required",
//   user: "users",
// });

// await createTable("users", {
//   name: "string|required",
//   tasks: "tasks[]",
// });

// const Tasks = getModel("tasks");
// const Users = getModel("users");

// await Users.insert({ name: "hadi" });
// await Users.insert({ name: "edriss" });
// await Tasks.insert({ user: 1, title: "task 1 hadi" });
// await Tasks.insert({ user: 1, title: "task 2 hadi" });
// await Tasks.insert({ user: 2, title: "task 3 edriss" });

// // const userList = await Users.query({
// //   select: {
// //     name: true,
// //     tasks: {
// //       title: true,
// //       user: true,
// //       //   user: {
// //       //     name: true,
// //       //   },
// //     },
// //   },
// // });

// const userList = await Users.query({
//   where: {
//     tasks: {
//       id: 3,
//     },
//   },
//   select: {
//     name: true,
//     tasks: {
//       title: true,
//       user: true,
//       //   user: {
//       //     name: true,
//       //   },
//     },
//   },
// });

// console.log(JSON.stringify(userList));
// console.log("not closing..");
