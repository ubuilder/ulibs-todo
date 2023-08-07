import { connect } from "./src/connect"
const {getModel} = connect({})

export type User = {
    name: string
    age: number
    posts: Post[]
}

export type Post = {
    title: string
    content: string
    creator: User
}

const users = getModel<User>('users')

const result = await users.query({sort: {
    column: "name"
}, where: {
    name: 'hadi',
    age: 3
}, select: {
    posts: {
        creator: {
            age: true,
            name: true
        }
    }
}, page: 1, perPage: 3})


