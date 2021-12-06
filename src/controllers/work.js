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
exports.creatework =  (req,res)=>{ 
    let {title,sub_heading,link,details,file,client,category,created_date} = req.body;
    var processed_file = '';
    var processed_file_two = '';
    if(req.files){ 
        var documentFile = req.files.file;
        var newdocumentFile = documentFile.data;
        processed_file = newdocumentFile.toString('base64');
    }
    if(req.files){ 
        var documentFile_two = req.files.file_two;
        var newdocumentFile_two = documentFile_two.data;
        processed_file_two = newdocumentFile_two.toString('base64');
    }
   
    var created_by = `${req.userData[0].firstname} ${req.userData[0].lastname}`;
     // createdDate---------------
     const created_at = new Date().toLocaleDateString();
     const views = null;
    const sql = 'INSERT INTO work_info (title,sub_heading,details,link,photo,photo_two,client,category,date)VALUES(?,?,?,?,?,?,?,?,?)';
    con.query(sql,[title,sub_heading,details,link,processed_file,processed_file_two,client,category,created_date],(err, result)=>{ 
        console.log(err);
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'created!',
                message:'Work Created Successfully.'
            }
            res.redirect("/admin/creatework")
        }
    })

 }
 exports.editwork =  (req,res)=>{
    const {id,title,sub_heading,details,link} = req.body;
    let sql_update =`UPDATE work_info SET title=?,sub_heading =?,details=?,link=? WHERE id = ${id}`;
    
    con.query(sql_update,[title,sub_heading,details,link],(err, updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/admin/worklist')
    })
}
exports.deletework = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `DELETE  FROM work_info WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/admin/worklist')
    })
}
exports.workdeactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE work_info SET status = 0  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        req.session.message={
            type:'alert-danger',
            intro:'Deactivated!',
            message:'Deactivated successfully.'
        }
        res.redirect('/admin/worklist')
    })
}
exports.workactivate = (req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE work_info SET status = 1  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'activated!',
            message:'activated successfully.'
        }
        res.redirect('/admin/worklist')
    })
}