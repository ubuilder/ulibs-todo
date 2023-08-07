import { get } from "./get.js";
import { insert } from "./insert.js";
import { query_function } from "./query.js";
import { remove } from "./remove.js";
import { update } from "./update.js";

export function getModel(tableName, db) {
  if (!tableName) throw "tableName should be string";
  if (!db) throw "database connection is not available";

  return {
    async query(options) {
      return query_function(options, {tableName, db})
    },
    async insert(data) {
      return insert(data, {tableName, db})
    },
    async update(id, data) {
      return update(id, data, {tableName, db})
    },
    async remove(id) {
      return remove(id, {tableName, db})
    },
    async get(id) {
      return get(id, {tableName, db})
    },
  };
}
