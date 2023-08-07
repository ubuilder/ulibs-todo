import { connect } from "./src/connect.js";

const {getModel} = connect()

const Users = getModel("users");
const Posts = getModel("posts");

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

console.log(users.data.length, 1);
console.log(users.data[0], {
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

console.log(posts.data.length, 2);
