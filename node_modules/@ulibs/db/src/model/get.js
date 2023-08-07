import { query_function } from "./query.js";

export async function get(options = {}, {tableName, db}) {
    const {where = {}, select = {}, with: preloads = {}} = options
    const data = await query_function({where, with: preloads, select, page: 1, perPage: 1}, {tableName, db})

    return data.data[0]
  }