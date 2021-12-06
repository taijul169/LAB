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
exports.addNewInstitution =  async(req,res)=>{
    try {
        const SQL_INSERT = "INSERT INTO institution (  name, level ) VALUES (?,?)";
        const {
            name,
            level,
        } = req.body;
        
        con.query(SQL_INSERT,[name, level],(err,result)=>{
             console.log(err)
             req.session.message={
                type:'alert-success',
                intro:'inserted!',
                message:'Successfully Inserted.'
            }
            res.redirect('/users/addinstitution')

         })
    } catch (error) {
        console.log(error)
        res.redirect('/users/addinstitution')  
    }
   
   
}
exports.addDistrict = async(req,res,next)=>{
    try {
        const SQL_INSERT = "INSERT INTO districtinfo ( districtname, districtcode,upazila,upazilacode ) VALUES (?,?,?,?)";
        const {
            districtname, districtcode,upazila,upazilacode
        } = req.body;
        if(req.body.districtcode == "" || req.body.districtname =="" ||  req.body.upazila =="" || req.body.upazilacode == "" ){
           req.session.message={
               type:'alert-danger',
               intro:'Empty fields!',
               message:'Please insert the requested information'
           }
           res.redirect('/users/addinstitution')
        }
        else{
            con.query(SQL_INSERT,[districtname, districtcode,upazila,upazilacode],(err,result)=>{
                if(err){
                    req.session.message={
                        type:'alert-danger',
                        intro:'Duplicate Data!',
                        message:'Duplicate Data for upazila !!.'
                    }
                    res.redirect('/users/addinstitution')
                }
                else{
                    req.session.message={
                        type:'alert-success',
                        intro:'inserted!',
                        message:'Successfully Inserted.'
                    }
                    res.redirect('/users/addinstitution')
                }
    
             })
        }
      
    } catch (error) {
       
        console.log(error)
        
    }
 
    // req.flash('message','added successfully');
  
}
exports.getInstitutionlist = (req,res)=>{
    const sql_ssc =  "SELECT * from institution WHERE level = 'ssc'";
    con.query(sql_ssc,(err, sscdata)=>{
        con.query("select * from institution WHERE level = 'hsc'",(err,hscdata)=>{
            con.query("select * from institution WHERE level = 'bachelor'",(err, bachelordata)=>{
                      con.query('SELECT * FROM divisioninfo',(err,divisioninfo)=>{  
                        let result = JSON.stringify(divisioninfo)
                            let data = result;
                            con.query("SELECT *  FROM divisioninfo",(err, division)=>{
                                console.log(err)
                                let divisiondata = division;
                                res.render("institutionlist",{userData:req.userData,sscdata,hscdata,bachelordata,data,divisiondata})
                            });  
                    })

            })
            
        })
        
    })
    
}
exports.updateInstitution  =  (req,res)=>{
    const {id,name,level,division,district,upazila,category} = req.body;
    con.query(`UPDATE  institution SET name=?,level=?,division=?,district=?,upazila=?,category=? WHERE id = ${id} `,[name,level,division,district,upazila,category],(err,updateInstition)=>{
     console.log(err)
     req.session.message={
        type:'alert-success',
        intro:'Updated!',
        message:'Updated successfully.'
    }
    res.redirect('/users/institutionlist')
    })
}
exports.deleteInstitution = (req,res)=>{
    const id =  req.params.id;
    const degree =  req.params.degree;
    let sql_delete =  `DELETE  FROM ${degree} WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/users/institutionlist')
    })
}
exports.editDivision =  (req,res)=>{
    const id =  req.params.id;
    const division =  req.params.division;
    const district =  req.params.district;
    const upazila =  req.params.upazila;
    let sql_update = `UPDATE divisioninfo SET division = ?,district = ?, upazila = ?  WHERE id = ${id}`;
    con.query(sql_update,[division,district,upazila],(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/users/institutionlist')
    })
}