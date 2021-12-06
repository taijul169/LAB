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

exports.getAdminDashboard  = (req,res)=>{
    let sql;
    const sql_total_blog = 'SELECT id FROM blog';
    const sql_total_payment = 'SELECT id FROM payment';
    const sql_total_member = 'SELECT id FROM userinfo';
    const sql_total_b_donor = 'SELECT bloodgroup FROM userinfo WHERE donateblood = 1';
    const sql_total_committee = 'SELECT id FROM committee';

    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 0 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,allData)=>{  
                    con.query(`SELECT id FROM blog WHERE district = '${adminData[0].adminarea}'`,(err,totalBlog)=>{
                        con.query(`SELECT id FROM payment WHERE district = '${adminData[0].adminarea}'`,(err,totalPayment)=>{
                            con.query(`SELECT id FROM userinfo WHERE district = '${adminData[0].adminarea}'`,(err,totalMember)=>{
                                con.query(`SELECT bloodgroup FROm userinfo WHERE donateblood=1 AND district ='${adminData[0].adminarea}'`,(err,totalBlooddonor)=>{
                                    con.query(sql_total_committee,(err,totalCommittee)=>{
                                       
                                        res.render("admin-home",{userData:req.userData,allData,totalBlog,totalPayment,totalMember,totalBlooddonor,totalCommittee})
                                    })
                                })
                            })   
                        }) 
                    })  
                })
             }
    })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 0`;
        con.query(sql,(err,allData)=>{   
            con.query(sql_total_blog,(err,totalBlog)=>{
                con.query(sql_total_payment,(err,totalPayment)=>{
                    con.query(sql_total_member,(err,totalMember)=>{
                        con.query(sql_total_b_donor,(err,totalBlooddonor)=>{
                            con.query(sql_total_committee,(err,totalCommittee)=>{
                                console.log(totalBlooddonor)
                                res.render("admin-home",{userData:req.userData,allData,totalBlog,totalPayment,totalMember,totalBlooddonor,totalCommittee});
                            }) 
                        })  
                    })
                })
            }) 
        })
    } 

    //-------------------
    // const sql = "SELECT * FROM userinfo WHERE verify = 0";
    // con.query(sql,(err, allData)=>{
    //    const sql_blood = `SELECT * FROM userinfo WHERE donateblood = 1`;
    //     con.query(sql_blood,(err, data)=>{
    //         const donatebloodData=  JSON.stringify(data)
    //         res.render('admin-home',{userData:req.userData,allData,donatebloodData})
    //     })
       
    // }) 
   
       
   }