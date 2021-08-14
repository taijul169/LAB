const mysql =  require('mysql2');
const { query } = require('express');
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});
const db = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
})
if(db){
    console.log("connection successfull with mysql db.")
}
else{
    throw console.error();
}