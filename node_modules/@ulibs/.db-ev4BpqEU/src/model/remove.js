export async function remove(id, {tableName, db}) {
    await db(tableName).where({ id }).del();
    return true;
  }