import test from "ava";
import { connect } from "../../src/connect.js";

test.beforeEach("prepare database", async (t) => {
  t.context.db = connect();

  // await t.context.db.createTable("test_users", {
  //   name: "string",
  //   test: "string",
  // });

  t.context.usersModel = t.context.db.getModel("test_users");
});

test.skip("Many to many relationship", async (t) => {
  await t.context.db.createTable("users", {
    name: "string",
    groups: "groups[]",
  });
  await t.context.db.createTable("groups", {
    name: "string",
    members: "users[]",
  });

  const Users = t.context.db.getModel("users");
  const Groups = t.context.db.getModel("groups");

  await Users.insert({
    name: "Hadi",
    groups: [
      {
        name: "Ubuilder",
      },
      {
        name: "SE",
      },
    ],
  });
  await Users.insert({
    name: "Edriss",
    groups: [1, 2],
  });
  await Users.insert({
    name: "Jawad",
    groups: [1],
  });

  await Groups.insert({ name: "Another", users: [2] });

  const users = Users.query({ select: { name: true, groups: true } });
  const groups = Users.query({ select: { name: true, users: true } });


  
  t.pass();
  //   Users.update(1, {groups: []})
});
