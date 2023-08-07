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

test("get by id", async (t) => {
    const users = t.context.usersModel;
  
    await users.insert({ name: "test-user", test: "this is test1" });
    await users.insert({ name: "test-user", test: "this is test4" });
    const [id3] = await users.insert({ name: "test-user", test: "this is test3" });
  
    const user = await users.get({where: {id: id3}});
  
    t.deepEqual(user.test, "this is test3");
    t.deepEqual(user.name, "test-user");
    t.deepEqual(user.id, id3);
  });
  