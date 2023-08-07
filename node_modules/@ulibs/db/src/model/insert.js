export async function insert(data, { tableName, db }) {
  const array = toArray(data).map((row) => ({
    id: crypto.randomUUID(),
    ...row,
  }));

  await db(tableName).insert(array);

  return array.map((x) => x.id);
}

// import { update } from "./update.js";

function toArray(data) {
  if (Array.isArray(data)) {
    return data;
  } else if (data) {
    return [data];
  } else {
    return [];
  }
}

// export async function insert(data, {tableName, db, schema}) {

//     let rows = toArray(data);

//     let payload = [];
//     for (let index in rows) {
//       // prepare payload in this block
//       const row = rows[index];
//       payload[index] = {};
//       for (let fieldName in schema[tableName]) {
//         const field = schema[tableName][fieldName];

//         if (field.type === "relation") {
//           if (field.many) {
//             continue;
//           }
//           if (row[field.field_name]) {
//             payload[index][field.field_name] = row[field.field_name];
//             // id
//           } else if (row[fieldName]) {
//             // object

//             const result = insert(
//               row[fieldName],
//               {tableName: field.table, db, schema}
//             );
//             payload[index][field.field_name] = result.id;
//           } else {
//             // nothing..
//           }
//         } else {
//           if (typeof row[fieldName] !== "undefined") {
//             payload[index][fieldName] = row[fieldName];
//           }
//         }
//       }
//     }

//     console.log("payload: ", payload);
//     const result = await Promise.all(
//       payload.map((p) =>
//         db(tableName)
//           .insert(p)
//           .then((res) => res[0])
//       )
//     );
//     console.log({ result });

//     for (let index in rows) {
//       const row = rows[index];
//       console.log("after insert", { row });
//       for (let fieldName in schema[tableName]) {
//         const field = schema[tableName][fieldName];

//         if (field.type === "relation" && field.many) {
//         //   const model = getModel();

//           let otherFieldName;
//           for (let otherField in schema[field.table]) {
//             if (
//               schema[field.table][otherField].type === "relation" &&
//               schema[field.table][otherField].table === tableName
//             ) {
//               otherFieldName = schema[field.table][otherField].field_name;
//               if (!otherFieldName) {
//                 // console.log(
//                 //   "many to many",
//                 //   getPivotTableName(tableName, field.table),
//                 //   otherField + "_id",
//                 //   fieldName + "_id"
//                 // );
//               }
//             }
//           }

//           if (Array.isArray(row[fieldName]) && row[fieldName].length > 0) {
//             if (typeof row[fieldName]?.[0] === "object") {
//               const otherRows = row[fieldName].map((row) => ({
//                 ...row,
//                 [otherFieldName]: result[index],
//               }));

//               await insert(otherRows, {tableName: field.table, db, schema});
//             } else {
//               for (let id of row[fieldName]) {
//                 // TODO
//                 await update(id, {
//                   [otherFieldName]: result[index],
//                 }, {tableName: field.table, db});
//               }
//             }
//           }
//         }
//       }
//     }

//     if (Array.isArray(data)) {
//       return data.map((d, index) => ({ id: result[index], ...d }));
//     } else {
//       return {
//         id: result[0],
//         ...data,
//       };
//     }
//   }
