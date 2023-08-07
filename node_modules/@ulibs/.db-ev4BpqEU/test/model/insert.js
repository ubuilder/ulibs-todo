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

test("insert multiple", async (t) => {
  const users = t.context.usersModel;

  await users.insert([
    { name: "test-user", test: "this is test1" },
    { name: "test-user", test: "this is test4" },
    { name: "test-user", test: "this is test3" },
  ]);

  const query = await users.query({});

  t.deepEqual(query.data.length, 3);
  t.deepEqual(query.page, 1);
  t.deepEqual(query.perPage, 3);
  t.deepEqual(query.total, 3);
});

test("insert with relations", async (t) => {
  

  const Posts = t.context.db.getModel("posts");
  const Users = t.context.db.getModel('users');

  const [userId] = await Users.insert({
    name: 'Hadi',
    username: 'hadi'
  })

  const [post1Id]  = await Posts.insert({
    body: "This is body",
    title: "Post title",
    creator_id: userId,
  });

  const [post2Id]  =await Posts.insert({
    body: "This is another post",
    title: "Post title 2",
    creator_id: userId,
  });

  const users = await Users.query({
    with: {
      posts: {
        table: 'posts',
        field: 'creator_id',
        multiple: true,
        select: {
          body: true,
          title: true
        }
      },
    },
    select: {
      name: true,
      username: true,
    }
    //
  });

  t.deepEqual(users.data.length, 1);
  t.deepEqual(users.data[0], {
    id: userId,
    name: "Hadi",
    username: "hadi",
    posts: [
      { id: post1Id, body: "This is body", title: "Post title" },
      { id: post2Id, body: "This is another post", title: "Post title 2" },
    ],
  });

});

test("insert with relation (array)", async (t) => {


  const Users = t.context.db.getModel("users");
  const Posts = t.context.db.getModel("posts");

  const [userId] = await Users.insert({
    name: "Hadi",
    username: "hadi",
    // posts: [
    // ],
  });

  const [post1Id] = await Posts.insert({
     body: "This is first body", title: "Post title #1", creator_id: userId 
  })
  const [post2Id] = await Posts.insert({
 body: "This is second body", title: "Post title #2", creator_id: userId
 })


  const users = await Users.query({
    select: {
      name: true,
      username: true,
    },
    with: {
      posts: {
        table: 'posts',
        field: 'creator_id',
        multiple: true,
      }
    }
  });

  t.deepEqual(users.data.length, 1);
  t.deepEqual(users.data[0], {
    id: userId,
    name: "Hadi",
    username: "hadi",
    posts: [
      {
        id: post1Id,
        creator_id: userId,
        body: "This is first body",
        title: "Post title #1",
      },
      {
        id: post2Id,
        creator_id: userId,
        body: "This is second body",
        title: "Post title #2",
      },
    ],
  });

  const posts = await Posts.query();

  t.deepEqual(posts.data.length, 2);

});

test("insert with relation (multiple id)", async (t) => {
  
  const Users = t.context.db.getModel("users");
  const Posts = t.context.db.getModel("posts");

  const [uId] = await Users.insert({
    name: "Hadi",
    username: "hadi",
  });

  const [p1, p2, p3] = await Posts.insert([
    { body: "description of first post", title: "post #1", creator_id: uId },
    { body: "description of second post", title: "post #2" },
    { body: "description of third post", title: "post #3", creator_id: uId },
  ]);


  const posts = await Posts.query({
    select: {
      title: true,
      creator_id: true
    },
    with: {
      creator: {
        table: 'users',
        field: 'creator_id'
      }
    }
  });

  t.deepEqual(posts.data, [
    {
      id: p1,
      title: "post #1",
      creator_id: uId,
      creator: { id: uId, name: "Hadi", username: "hadi" },
    },
    {
      creator_id: undefined,
      id: p2,
      title: "post #2",
    },
    {
      id: p3,
      title: "post #3",
      creator_id: uId,
      creator: { id: uId, name: "Hadi", username: "hadi" },
    },
  ]);

  const users = await Users.query({});

});

test("insert with relation (multiple array)", async (t) => {
 
  const Users = t.context.db.getModel("users");
  const Posts = t.context.db.getModel("posts");

  const uIds = await Users.insert([
    {
      name: "Hadi",
      username: "hadi",
    },
    {
      name: "Edriss",
      username: "edriss",
    },
    {
      name: "Jawad",
      username: "jawad",
    },
  ]);

  const postIds = await Posts.insert([
    { body: "This is first body", title: "Post title #1", creator_id: uIds[0] },
    { body: "This is second body", title: "Post title #2", creator_id: uIds[0] },
    { body: "This is edriss first body", title: "Post title #1", creator_id: uIds[1] },
    { body: "This is edriss second body", title: "Post title #2", creator_id: uIds[1] },
    { body: "This is jawad first body", title: "Post title #1", creator_id: uIds[2]},
    { body: "This is jawad second body", title: "Post title #2", creator_id: uIds[2]},
  ])

  const users = await Users.query({
    select: {
      name: true,
      username: true,
    },
    with: {
      posts: {
        table: 'posts',
        field: 'creator_id',
        multiple: true
      }
    }
  });

  t.deepEqual(users.data.length, 3);
  t.deepEqual(users.data[0], {
    id: uIds[0],
    name: "Hadi",
    username: "hadi",
    posts: [
      {
        id: postIds[0],
        creator_id: uIds[0],
        body: "This is first body",
        title: "Post title #1",
      },
      {
        id: postIds[1],
        creator_id: uIds[0],
        body: "This is second body",
        title: "Post title #2",
      },
    ],
  });
  t.deepEqual(users.data[1], {
    id: uIds[1],
    name: "Edriss",
    username: "edriss",
    posts: [
      {
        id: postIds[2],
        creator_id: uIds[1],
        body: "This is edriss first body",
        title: "Post title #1",
      },
      {
        id: postIds[3],
        creator_id: uIds[1],
        body: "This is edriss second body",
        title: "Post title #2",
      },
    ],
  });

  t.deepEqual(users.data[2], {
    id: uIds[2],
    name: "Jawad",
    username: "jawad",
    posts: [
      {
        id: postIds[4],
        creator_id: uIds[2],
        body: "This is jawad first body",
        title: "Post title #1",
      },
      {
        id: postIds[5],
        creator_id: uIds[2],
        body: "This is jawad second body",
        title: "Post title #2",
      },
    ],
  });

  const posts = await Posts.query();

  t.deepEqual(posts.data.length, 6);

});
