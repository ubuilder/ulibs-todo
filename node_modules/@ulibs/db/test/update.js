import test from "ava";
import { connect } from "../src/connect.js";

test("add a relation by id", async (t) => {
  const { createTable, removeTable, getModel } = connect();

  // await createTable("users", {
  //   name: "string",
  // });

  // await createTable("posts", {
  //   title: "string",
  //   creator: "users",
  // });

  const Users = getModel("users");
  const Posts = getModel("posts");


  const [uId] = await Users.insert({
    name: "Hadi",
  });

  await Posts.insert([
    { title: "my first post", creator_id: uId },
    { title: "my second post", creator_id: uId },
    { title: "my third post", creator_id: uId },
    { title: "my fourth post", creator_id: uId },
  ])

  await Users.update(uId, {
    name: "Updated",
    // posts: {
    //   add: { title: "another post" },
    // },
  });

  await Posts.insert({
    title: 'another post',
    creator_id: uId
  })

  const usersWithPosts = await Users.query({
    with: {
      the_posts: {
        table: 'posts',
        field: 'creator_id',
        multiple: true
      }
    }
  });

  t.deepEqual(usersWithPosts.data.length, 1);
  t.deepEqual(usersWithPosts.data[0].the_posts.length, 5);

});

test.todo("add a relation");
test.todo("update a relation's value");
test.todo("remove relation");
