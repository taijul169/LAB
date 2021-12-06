const express =  require('express');
const bycript = require("bcryptjs");
const crypto = require("crypto");
const bodyParser =  require("body-parser");
const flash =  require('connect-flash')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv =  require('dotenv');
dotenv.config({path:'./config.env'});
const url = require('url');
const { handlebars } = require("hbs");
const router = express.Router();
const mysql =  require('mysql2');
const { query } = require('express');
const { json } = require('body-parser');
const { callbackify } = require('util');
const { Promise } = require('mongoose');
var con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
})
if(con){
    console.log("connection successfull with mysql db.")
}
else{
    throw console.error();
}
exports.createclient =  (req,res)=>{ 
    let {title,sub_heading} = req.body;
     // createdDate---------------
     const created_at = new Date().toLocaleDateString();
     const views = null;
    const sql = 'INSERT INTO client_info (title,sub_heading)VALUES(?,?)';
    con.query(sql,[title,sub_heading],(err, result)=>{ 
        console.log(err);
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'created!',
                message:'client Created Successfully.'
            }
            res.redirect("/admin/createclient")
        }
    })

 }
 exports.editclient =  (req,res)=>{
    const id =  req.params.id;
    const title =  req.params.title;
    const sub_heading =  req.params.sub_heading; 
    let sql_update =`UPDATE client_info SET title=?,sub_heading =? WHERE id = ${id}`;
    con.query(sql_update,[title,sub_heading],(err, updateresult)=>{
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/admin/clientlist')
    })
}
exports.deleteclient = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `DELETE  FROM client_info WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/admin/clientlist')
    })
}
exports.clientdeactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE client_info SET status = 0  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        req.session.message={
            type:'alert-danger',
            intro:'Deactivated!',
            message:'Deactivated successfully.'
        }
        res.redirect('/admin/clientlist')
    })
}
exports.clientactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE client_info SET status = 1  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'activated!',
            message:'activated successfully.'
        }
        res.redirect('/admin/clientlist')
    })
}