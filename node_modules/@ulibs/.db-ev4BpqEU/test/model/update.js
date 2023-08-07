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

test("update", async (t) => {
    const users = t.context.usersModel;
  
    await users.insert({ name: "test-user", test: "this is test1" });
    const [id] = await users.insert({ name: "test-user", test: "this is test4" });
    await users.insert({ name: "test-user", test: "this is test3" });
  
    await users.update(id, { name: "updated name" });
  
    const query = await users.query({ where: { id } });
  
    t.deepEqual(query.data, [
      { id, name: "updated name", test: "this is test4" },
    ]);
    t.deepEqual(query.page, 1);
    t.deepEqual(query.perPage, 1);
    t.deepEqual(query.total, 1);
  });
  