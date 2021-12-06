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
exports.createblog =  (req,res)=>{ 
    const {title,details,file} = req.body;
    var processed_file = '';
    if(req.files){ 
        var documentFile = req.files.file;
        var newdocumentFile = documentFile.data;
        processed_file = newdocumentFile.toString('base64');
    }
    var created_by = `${req.userData[0].firstname} ${req.userData[0].lastname}` 
     // createdDate---------------
     const created_at = new Date().toLocaleDateString();
     const views = null;
    const sql = 'INSERT INTO blog (title,details,file,views,created_by,created_at)VALUES(?,?,?,?,?,?)';
    con.query(sql,[title,details,processed_file,views,created_by,created_at],(err, result)=>{ 
        console.log(err);
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'created!',
                message:'Blog Created Successfully.'
            }
            res.redirect("/admin/createblog")
        }
    })

 }
 exports.editblog =  (req,res)=>{
    const id =  req.params.id;
    const title =  req.params.title;
    const details =  req.params.details;
    let sql_update =`UPDATE blog SET title=?,details=? WHERE id = ${id}`;
    
    con.query(sql_update,[title,details],(err, updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/admin/bloglist')
    })
}
exports.deleteblog = (req,res)=>{
    const id =  req.params.id;
    
    let sql_delete =  `DELETE  FROM blog WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/admin/bloglist')
    })
}
exports.blogdeactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE blog SET status = 0  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-danger',
            intro:'Deactivated!',
            message:'Deactivated successfully.'
        }
        res.redirect('/admin/bloglist')
    })
}
exports.blogactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE blog SET status = 1  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'activated!',
            message:'activated successfully.'
        }
        res.redirect('/admin/bloglist')
    })
}