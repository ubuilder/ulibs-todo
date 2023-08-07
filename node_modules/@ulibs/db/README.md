# db
Simple database ORM library in javascript, It supports PostgreSQL, MySQL,
MariaDB, SQLite3 and Oracle Databases. 

### Install NPM
```bash
npm install @ulibs/db
```


### connections
```bash
const db = connect({client: 'sqlite3', filename: 'db'})
```



### create table
```bash
 await db.createTable('users',
  {
      username: 'string|reqired',
      email: 'string',
      age: 'number'
  })
```


### getting Model
db.GetModel() retruns a number of method to work with the selected model
retruned methods are: 

- **get(id):** retrives the data by id.
- **query({}):** retrives data based on conditions and 
- **insert({}):** inserts a record.
- **update({}):** updates record based on condation.
- **remove(id):** removes record based on id
```bash
const Users = db.getModel('users) 
```




### inserting data
```bash
const Users = db.getModel('users)
const result = await Users.insert({
     username: 'user1',
     email: 'user1@example.com',
     age: 26,
     })
console.log(result)
```


### getting data
```bash
const Users = db.getModel('users)
const user1 = Users.get(1) //gets user by id
console.log(user1)
```


### query data
```bash
const user1 = await Users.query(
        {
            select: {
                username: true,
                email: true,
                age: true,
            },
            where: {
                id: 1
        }
    )
console.log(user1)
```


### remove data
```bash
const Users = db.getModel('users)
const result = await Users.remove(1)
console.log(result)
```



