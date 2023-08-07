export type WithId<T> = {
    id: number
} & T

export type QueryResult<T> = {
    data: WithId<T>[],
    page: number,
    perPage: number,
    total: number
}


export type QueryWhere<T> = {
    [x in keyof T]: T[x] | {operator: '=' | '!=' | 'in' | 'between' | '>' | '>=' | '<' | '<=', value: T[x]}
}

export type QuerySelect<T> = {
    [x in keyof T]: boolean | QuerySelect<T[x]> | QuerySelect<T[x][0]>
}

export type QueryParams<T> = {
    page: number,
    perPage: number,
    sort: {
        column: keyof T,
        order: 'asc' | 'desc'
    },
    where: QueryWhere<T>,
    select: QuerySelect<T>
}

export type QueryType<T> = (params: QueryParams<T>) => Promise<QueryResult<T>>

export type Model<T> = {
    query: QueryType<T>,
    get: (id: number) => Promise<WithId<T>>,
    insert: (data: T) => Promise<WithId<T>> // fix
    update: (id: number, data: Partial<T>) => Promise<WithId<T>>,
    remove: (id: number) => Promise<boolean>
}
export type TableColumns = {
    [x: string]: string
}

export type ConnectResult = {
    getModel: <T>(table: string) => Model<T>,
    createTable: (name: string, columns: TableColumns) => Promise<void>
}

export type ConnectParams = {
    filename: string,
    client: 'mysql' | 'pg' | 'sqlite3',
    port: number
    host: string
    user: string
    password: string
    database: string
}

export type ConnectType = (params: ConnectParams) => ConnectResult
