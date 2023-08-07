export async function update(id, data, {tableName, db}) {
    const result = await db(tableName).where({ id }).update(data);

    return result;
}
