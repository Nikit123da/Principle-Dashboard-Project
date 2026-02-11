require("dotenv").config();
const express = require("express");
const insertAllStudents = require("./Controllers/StudentController");
const insertAllteachers = require("./Controllers/teacherController");

const app = express();

require("./Models/db_connection");

app.use(express.json());

require("./Models/db_connection")

insertAllStudents();
insertAllteachers();

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`running on port ${PORT}`);
});

