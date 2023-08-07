import test from "ava";
import { connect } from "../src/connect.js";

test.beforeEach("prepare database", async (t) => {
    t.context.db = connect();
});
  

test("create third database if there is many to many relation", async t => {

    // await t.context.db.createTable('courses', {
    //     name: 'string',
    //     students: 'students[]'
    // })

    // await t.context.db.createTable('students', {
    //     name: 'string',
    //     courses: 'courses[]'
    // })

    t.pass()
    // const CoursesStudents = t.context.db.getModel(getPivotTableName('courses', 'students'))
    
    // const result = await CoursesStudents.query()
    // t.deepEqual(result.data, [])
});


test.skip('insert data into third table', async t => {
    await t.context.db.createTable('courses', {
        name: 'string',
        students: 'students[]'
    })

    await t.context.db.createTable('students', {
        name: 'string',
        courses: 'courses[]'
    })

    const Courses = t.context.db.getModel('courses');
    const Students = t.context.db.getModel('students');


    await Courses.insert({name: 'math', students: [{name: 'Hadi'}, {name: 'Edriss'}]});

    await Students.insert({name: 'Jawad', courses: [{name: 'Programming'}]})

    const Pivot = t.context.db.getModel(getPivotTableName('courses', 'students'))
    const data = await Pivot.query()

    t.deepEqual(data.data.length, 3)
    
})