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
test("remove", async (t) => {
    const users = t.context.usersModel;
  
    await users.insert({ name: "test-user", test: "this is test1" });
    await users.insert({ name: "test-user", test: "this is test4" });
    await users.insert({ name: "test-user", test: "this is test3" });
  
    await users.remove(2);
  
    const query = await users.query({ where: { id: {operator: '=', value: 2} } });
  
    t.deepEqual(query.data, []);
    t.deepEqual(query.page, 1);
    t.deepEqual(query.perPage, 0);
    t.deepEqual(query.total, 0);
  });
  