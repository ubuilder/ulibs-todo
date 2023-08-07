import { readFile, writeFile } from "fs/promises";
import {uuid} from 'uuidv4'
export function connect({ filename = ":memory:" } = {}) {
  let data;

  async function get(field) {
    
    if (!data) {
      if(filename === ':memory:') {
        data = {}
      }
      try {

      const fileContent = await readFile(filename, "utf-8");

      data = JSON.parse(fileContent ?? "{}");
    } catch(err) {

      data = {}


    }
  }

    return JSON.parse(JSON.stringify(data[field] ?? []));
  }

  async function save(field, rows) {
    data[field] = rows;
    console.log("save");
    if (filename === ":memory:") return;

    await writeFile(filename, JSON.stringify(data));
  }

  return {
    getModel(field) {
      if (!field) return;

      // if(!data[field]) {
      //   data[field] = []
      // }
      async function query(
        { where, select, sort, with: preloads, page = 1, perPage = 10 } = {},
        table = field
      ) {
        console.log("query ", table, {
          where,
          select,
          preloads,
          page,
          perPage,
        });

        let rows = await get(table);

        console.log({ rows });

        if (where) {
          rows = rows.filter((row) => {
            let result = true;
            Object.keys(where).map((key) => {
              const operator =
                typeof where[key] === "object" ? where[key].operator : "=";
              const value =
                typeof where[key] === "object" ? where[key].value : where[key];

              if (operator === "=" && row[key] !== value) result = false;
              if (operator === "!=" && row[key] === value) result = false;
              if (operator === ">=" && row[key] < value) result = false;
              if (operator === ">" && row[key] <= value) result = false;
              if (operator === "<=" && row[key] > value) result = false;
              if (operator === "<" && row[key] >= value) result = false;
              if (
                operator === "between" &&
                (row[key] < value[0] || row[key] > value[1])
              )
                result = false;
              if (operator === "in" && !value.includes(row[key]))
                result = false;
              if (operator === "like" && row[key].indexOf(value) === -1)
                result = false;

            });
            return result;
          });
        }

        // with: {
        //   others: {
        //     table: "other",
        //     field: "creator_id",
        //     multiple: true,
        //     select: {
        //       name: true,
        //     },
        //   },
        // },
        if (select) {
          rows = rows.map((row) => {
            let result = {};
            result.id = row.id;
            Object.keys(select).map((selec) => {
              result[selec] = row[selec];
            });
            return result;
          });
        }

        if (preloads) {
          rows = await Promise.all(
            rows.map(async (row) => {
              for (let preload in preloads) {
                console.log("Preload: ", preload, row)
                if (preloads[preload].multiple) {
                  console.log("multiple", preloads[preload].field, row.id, preloads[preload].table);
                  
                  row[preload] = await query(
                    {
                      where: {
                        [preloads[preload].field]: row.id,
                        ...(preloads[preload].where ?? {}),
                      },
                      select: preloads[preload].select ?? undefined,
                    },
                    preloads[preload].table
                  ).then((res) => res.data);
                } else {
                  const res = await query(
                    {
                      where: {
                        id: row[preloads[preload].field],
                        ...(preloads[preload].where ?? {}),
                      },
                      select: preloads[preload].select ?? undefined,
                    },
                    preloads[preload].table
                  ).then((res) => res.data[0]);
                  if(res) {
                    row[preload] = res;                    
                  }
                }
              }
              return row;
            })
          );
        }

        if(sort) {
          const {column, order} = sort

          rows = rows.sort((a, b) => {
            let x = 1
            if(order.toLowerCase() === 'desc') {
              x = -1
            }

            return a[column] > b[column] ? x : -x
          })

        }

        let total = rows.length;
        perPage = Math.min(perPage, total);

        rows = rows.slice((page - 1) * perPage, page * perPage);

        return {
          data: rows,
          page,
          perPage,
          total,
        };
      }

      return {
        query,
        async get(options) {
          return query(options).then(res => res.data[0])
        },
        async insert(row) {
          console.log("insert", { row });
          let rows = [];
          if (Array.isArray(row)) {
            rows = row;
          } else {
            rows = [row];
          }
          const newRows = rows.map((x) => ({ id: uuid(), ...x }));

          console.log("save", field, [...(await get(field)), ...newRows]);
          await save(field, [...(await get(field)), ...newRows]);

          return newRows.map((row) => row.id);
        },
        async update(id, newRow = {}) {
          console.log("update", { id, newRow });
          let result = {};
          const rows = (await get(field)).map((row) => {
            if (row.id === id) {
              result = { ...row, ...newRow };
              return result;
            }
            return row;
          });
          await save(field, rows);

          return result;
        },
        async remove(id) {
          await save((await get(field)).filter((row) => row.id === id));
        },
      };
    },
    invalidate() {
      data = undefined
    }
    // createTable()
  };
}
// import { getModel } from "./model/model.js";
// import { addColumns, createTable, removeColumns, removeTable, renameTable, updateColumn } from "./table.js";
// import knex from "knex";

// /**
//  * @type {import('../index.d').ConnectType}
//  */
// export function connect({
//   client = "sqlite3",
//   filename = ":memory:",
//   host,
//   user,
//   password,
//   database,
// } = {}) {
//   const db = knex({
//     client: client,
//     connection:
//       client === "sqlite3"
//         ? { filename }
//         : {
//             host,
//             user,
//             password,
//             database,
//           },
//     useNullAsDefault: true,
//   });

//   return {
//     getModel(tableName) {
//       return getModel(tableName, db);
//     },
//     createTable(tableName, columns) {
//       return createTable(tableName, columns, db);
//     },
//     removeTable(tableName) {
//       return removeTable(tableName, db);
//     },
//     addColumns(tableName, columns) {
//       return addColumns(tableName, columns, db)
//     },
//     removeColumns(tableName, columns) {
//       return removeColumns(tableName, columns, db)
//     },
//     updateColumn(tableName, columnName, column) {
//       return updateColumn(tableName, columnName, column, db)
//     },
//     renameTable(tableName, name) {
//       return renameTable(tableName, name, db)
//     }
//   };
// }
