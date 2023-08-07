import { get } from "./get.js";

function query_select(query, { select }) {
  let querySelect;
  if (Object.keys(select).length > 0) {
    querySelect = [];
    for (let key in select) {
      if (select[key]) {
        querySelect.push(key);
      }
    }

    //   id is always available
    if (!querySelect.includes("id")) querySelect.unshift("id");
  } else {
    querySelect = "*";
  }

  return query.select(querySelect);
}

function query_where(query, { where }) {
  if (Object.keys(where).length > 0) {
    for (const key in where) {
      let value;
      let operator;
      if (where[key] && typeof where[key] === "object") {
        value = where[key].value;
        operator = where[key].operator;
      } else {
        value = where[key];
        operator = "=";
      }

      if (!value || !operator) break;

      if (operator === "like") {
        query = query.whereLike(key, `%${value}%`);
      } else if ((operator === "=") & (value === null)) {
        query = query.whereNull(key);
      } else if (operator === "!=" && value === null) {
        query = query.whereNotNull(key);
      } else if (operator === "in") {
        //   const v = value.split(",");
        query = query.whereIn(key, value);
      } else if (operator === "between") {
        query = query.whereBetween(key, [value[0], value[1]]);
      } else {
        query = query.where(key, operator ?? "=", value);
      }
    }
  }

  return query;
}

async function query_paginate(query, { page, perPage }) {
  // Get the total number of rows in the database
  const totalRows = await query.clone().count("* as count").first();
  let total = totalRows.count;

  // Adjust the perPage value if necessary
  if (total < perPage || !perPage) {
    perPage = total;
  }

  const offset = (page - 1) * perPage;
  query = query.offset(offset).limit(perPage);

  return {
    query,
    total,
    perPage,
  };
}

function query_sort(query, { sort }) {
  // TODO sort query...
  return query;
}

async function query_map_data(data, { preloads, db }) {
  for (let fieldName in data) {
    for (let key in preloads) {
      const {
        table,
        field,
        select: select2,
        where: where2,
        with: with2,
      } = preloads[key];

      if (preloads[key].multiple) {
        const result = await query_function(
          {
            select: select2,
            where: { ...where2, [field]: data.id },
            with: with2,
            page: 1,
            perPage: 1000,
          },
          { tableName: table, db }
        );
        data[key] = result.data;
      } else {

        if(data[field]) {

            data[key] = await get(
            { where: { ...where2, id: data[field] }, select: select2, with: with2 },
            { tableName: table, db }
            );
        } 

      }
    }

    // } else if (field.type === "boolean") {
    //   if (data[fieldName] === 1) {
    //     data[fieldName] = true;
    //   } else if (data[fieldName] === 0) {
    //     data[(fieldName = false)];
    //   }
    // } else {
    //   // do not change to query result
    // }
    if (data[fieldName] === undefined) {
      delete data[fieldName];
    }
  }
  return data;
}

export async function query_function(options = {}, { tableName, db }) {
  const {
    where = {},
    select = {},
    with: preloads = {},
    sort = {},
    page = 1,
    perPage = 10,
  } = options;
  let query = db(tableName);

  query = query_select(query, { select });

  query = query_where(query, { where });

  query = query_sort(query, { sort });

  let paginate_result = await query_paginate(query, {
    page,
    perPage,
    db,
    tableName,
  });

  let data = await paginate_result.query;

  data = await Promise.all(
    data.map(async (row) => {
      row = await query_map_data(row, { select, preloads, tableName, db });
      return row;
    })
  );

  return {
    data,
    page,
    perPage: paginate_result.perPage,
    total: paginate_result.total,
  };
}
