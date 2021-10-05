
const express =  require('express');
const bycript = require("bcryptjs");
const crypto = require("crypto");
const bodyParser =  require("body-parser");
const flash =  require('connect-flash')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});
const url = require('url');
// middleware
const auth = require('../middleware/authenticate');
const admin_auth = require('../middleware/adminauthenticate');
const sgMail = require('@sendgrid/mail');


//here will be sicret key

// localStorage
// var LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch');


// const { rawListeners, schema } = require("../models/model");
const { handlebars } = require("hbs");
const router = express.Router();
const mysql =  require('mysql2');
const { query } = require('express');
const { json } = require('body-parser');
const { route } = require('./api');
const { callbackify } = require('util');
const { Promise } = require('mongoose');
var con = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'rootpassword',
    database:'educationinfo'
})
if(con){
    console.log("connection successfull with mysql db.")
}
else{
    throw console.error();
}
//================================================================= LAB START====================================================


//---------------------------Admin access---------------------------------------------------------------

//------------------------ Add institution/district Start----------------------------------------------------------
router.get("/users/addinstitution",auth,(req,res)=>{
  res.render('addinstitution')
})

router.post('/users/addinstitution',auth, async(req,res)=>{
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
   
   
});
// router.post('/users/addinstitution/ssc', async(req,res)=>{
//     try {
//         const SQL_INSERT = "INSERT INTO ssc (  institutenamessc, institutecodessc ) VALUES (?,?)";
//         const {
//             institutenamessc,
//             institutecodessc,
//         } = req.body;
//         console.log(institutenamessc, institutenamessc)
//         con.query(SQL_INSERT,[institutenamessc, institutecodessc],(err,result)=>{
//              console.log(err)

//          })
//     } catch (error) {
//         console.log(error)
        
//     }
//     req.flash('message','added successfully');
//     res.redirect('/users/addinstitution')  
// });
// router.post('/users/addinstitution/hsc', async(req,res)=>{
//     try {
//         const SQL_INSERT = "INSERT INTO hsc (  institutenamehsc, institutecodehsc ) VALUES (?,?)";
//         const {
//             institutenamehsc,
//             institutecodehsc,
//         } = req.body;
//         con.query(SQL_INSERT,[institutenamehsc, institutecodehsc],(err,result)=>{
//              console.log(err)

//          })
//     } catch (error) {
//         console.log(error)
        
//     }
//     req.flash('message','added successfully');
//     res.redirect('/users/addinstitution') 
// })
// router.post('/users/addinstitution/bachelor', async(req,res)=>{
//     try {
//         const SQL_INSERT = "INSERT INTO bachelor (  name, institutecodebachelor ) VALUES (?,?)";
//         const {
//             name,
//             institutecodebachelor,
//         } = req.body;
//         con.query(SQL_INSERT,[name, institutecodebachelor],(err,result)=>{
//              console.log(err)

//          })
//     } catch (error) {
//         console.log(error)
        
//     }
//     req.flash('message','added successfully');
//     res.redirect('/users/addinstitution')
// })

// add district/upazila
router.post('/users/addinstitution/district', async(req,res,next)=>{
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
  
})


// add district/division
router.post('/users/addinstitution/division', async(req,res,next)=>{
    try {
        const SQL_INSERT = "INSERT INTO divisioninfo ( division,district,upazila ) VALUES (?,?,?)";
        const { division, district,upazila } = req.body;
      
        con.query(SQL_INSERT,[division,district,upazila],(err, result)=>{
            console.log(result);
            if(result== undefined){
                req.session.message={
                    type:'alert-danger',
                    intro:'inserted!',
                    message:'Duplicate Entry for  Upazila!!'
                }
                res.redirect('/users/addinstitution')
                console.log("return true")
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
    } catch (error) {  
        console.log(error)
    }
})


// view institution list  ROUTE------------------------------
router.get("/users/institutionlist",auth,(req,res)=>{
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
    
})
// ---------------------------------------------------update instition----------------------------------

router.post('/users/updateinstitution',(req,res)=>{
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
});
// instituiton update----------------------
router.get("/users/editinstitute/:id/:name/:code/:degree",(req,res)=>{
    const id =  req.params.id;
    console.log(id)
    const name =  req.params.name;
    const code =  req.params.code;
    const degree =  req.params.degree;
    let sql_update;
    if(degree == 'ssc'){
        sql_update = `UPDATE ${degree} SET institutenamessc = ?,institutecodessc = ?  WHERE id = ${id}`;
    }
    else if(degree == 'hsc'){
        sql_update = `UPDATE ${degree} SET institutenamehsc = ?,institutecodehsc = ?  WHERE id = ${id}`;
    }
    else if(degree == 'bachelor'){
        sql_update = `UPDATE ${degree} SET name = ?,institutecodebachelor = ?  WHERE id = ${id}`;
    }
    con.query(sql_update,[name,code],(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/users/institutionlist')
    })
})
// instituiton delete----------------------
router.get("/users/deleteinstitution/:id/:degree",(req,res)=>{
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
})

// division/district/upazila update----------------------
router.get("/users/editdivision/:id/:division/:district/:upazila",(req,res)=>{
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
})


//------------------------ Add institution/district end----------------------------------------------------------

// User home route---------------------
router.get('/admin',auth,(req,res)=>{
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
   
       
   });

// --------------------------------GENERAL USER ACCESS----------------------------------------------------------------

router.post('/contact',(req,res)=>{
    const {firstname,lastname,email,phone,subject,details} = req.body;
    const created_at = new Date().toLocaleDateString();
    con.query('INSERT INTO contactinfo (firstname,lastname,email,phone,subject,details,created_at) VALUES (?,?,?,?,?,?,?)',[firstname,lastname,email,phone,subject,details,created_at],(err, reuslt)=>{
        console.log(err);
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Your message has been sent to authority.'
        }
        res.redirect("/")
    })
});

// User home route---------------------
router.get('/users',auth,(req,res)=>{
 const sql = "SELECT * FROM userinfo";
 con.query(sql,(err, allData)=>{
    res.render('users-home',{userData:req.userData,allData})
 }) 
})

// FRONT END=======================================================================
// index---------------------
router.get('/', (req,res)=>{
 
    con.query("SELECT * FROM notice WHERE status = 1 ORDER BY ID DESC LIMIT 2 ",(err,noticeData)=>{
        // noticeData = JSON.stringify(noticeData)
        if(!err){
            con.query("SELECT * FROM blog WHERE status = 1 ORDER BY ID DESC LIMIT 3 ",(err,blogData)=>{
                if(!err){
                    con.query("SELECT * FROM event WHERE status = 1 ORDER BY ID DESC LIMIT 2",(err,eventData)=>{
                        if(!err){
                            res.render('index',{noticeData,blogData,eventData}) 
                        }
                    })
                   
                  
                }
            })
        }
       
    })
   
 });
 // single notice view---------------------
router.get('/singlenoticeview/:id', (req,res)=>{
   const id =  req.params.id;
   
    con.query(`SELECT * FROM notice WHERE id = ${id}`,(err,noticeData)=>{
        res.render('singlenoticeview',{noticeData}) 
    })
   
 });
//  single-blog-view
 router.get('/singleblogview/:id', (req,res)=>{
    const id =  req.params.id;
     con.query(`SELECT * FROM blog WHERE id = ${id}`,(err,blogData)=>{
         res.render('singleblogview',{blogData}) 
     })
    
  });
//  single-event-view
router.get('/singleeventview/:id', (req,res)=>{
    const id =  req.params.id;
     con.query(`SELECT * FROM event WHERE id = ${id}`,(err,eventData)=>{
         res.render('singleeventview',{eventData}) 
     })
    
  });

// -register---------------------
router.get('/signup',(req,res)=>{
    try {
        // const sql = `SELECT * FROM districtinfo`;
        const sql = `SELECT * FROM divisioninfo`;
        // const sql_district = `SELECT DISTINCT districtname  FROM districtinfo`;
        const sql_division = `SELECT DISTINCT division  FROM divisioninfo`;
        const sql_ssc = `SELECT  name FROM institution WHERE level = 'ssc'`;
        const sql_hsc = `SELECT  name FROM institution WHERE level = 'hsc'`;
        const sql_bachelor = `SELECT name  FROM institution WHERE level = 'bachelor'`;
        const sql_email = 'SELECT email From userinfo'
        con.query(sql_division,(err,result)=>{
     
            // result = JSON.stringify(result)
            // let datadistrict = result;
            let dataDivison = result;
            let emailData;
            con.query(sql,(err,result)=>{
                result = JSON.stringify(result)
                let data = result;
                con.query(sql_ssc,(err,result)=>{
                    let sscdata= result;
                    // sscdata=JSON.stringify(sscdata)
                    con.query(sql_hsc,(err,result)=>{
                        let hscdata= result;
                        // hscdata=JSON.stringify(hscdata)
                        con.query(sql_bachelor,(err,result)=>{
                            let bachelordata = result;
                            con.query(sql_email,(err,resultEmail)=>{
                                emailData =JSON.stringify(resultEmail)
                             res.render('signup',{dataDivison,data,sscdata,hscdata,bachelordata,emailData});
                            })
                           
                        })
                    })
                })
               
            })
            
        })
    } catch (error) {
        console.log(error)
        
    }
 });





//  Email verify   
router.get('/emailverify', (req,res)=>{
        res.render('emailverify') 
});
// Verify email route   
router.get('/verify-email', (req,res)=>{
    const token = req.query.token;
    console.log(token);
    con.query(`UPDATE userinfo SET verifyemail = 1 WHERE jwtoken='${token}'`,(err,data)=>{
        console.log(err)
        console.log(data)
    })
    res.render('emailverifiedmessage') 
    });        
// create user(signup route)
router.post('/signup', (req,res)=>{        
    try {
        const SQL_INSERT = "INSERT INTO userinfo (firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,userphoto,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,certificatessc,institutehsc,hscgroup,passingyearhsc,certificatehsc,institutebachelor,subjectbachelor,passingyearbachelor,certificatebachelor,institutemasters,subjectmasters,passingyearmasters,certificatemasters,institutephd,subjectphd,passingyearphd,certificatephd,profession,organization,designation,address,jwtoken) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const {
            firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,institutehsc,hscgroup,passingyearhsc,institutebachelor,subjectbachelor,passingyearbachelor,institutemasters,subjectmasters,passingyearmasters,institutephd,subjectphd,passingyearphd,profession,organization,designation,address
        } = req.body;
        console.log(req.body)
        // createdDate---------------
        // const createdDate = new Date().toLocaleDateString()
         // createdDate---------------
         const createdat = new Date().toLocaleDateString()
        // code-generation
        const code = Math.round((Math.random()*1000000));
        // SECRETTOKEN GEREARATION
        const RANDOM_NUM = Math.round((Math.random()*10000));
        const RANDOM_NUM_TWO = Math.round((Math.random()*10000));
        // const jwtoken =  `@1231@3#CV${RANDOM_NUM*1000}${RANDOM_NUM_TWO*1000}${RANDOM_NUM}${RANDOM_NUM_TWO}`;
        const jwtoken = crypto.randomBytes(64).toString('hex');

        // single-image-prcessed-------------------
        var userphoto_demo = "";
        const fileOne = req.files.userphoto;
        if(fileOne){
            var newfileOne = fileOne.data;
            userphoto_demo = newfileOne.toString('base64');
        }
         // single-image-prcessed-------------------
         const fileTwo = req.files.certificatessc;
         const newfileTwo = fileTwo.data;
         const certificatessc_demo = newfileTwo.toString('base64');
          // single-image-prcessed-------------------
        const fileThree = req.files.certificatehsc;
        const newfileThree = fileThree.data;
        const certificatehsc_demo = newfileThree.toString('base64');


       // single-image-prcessed-------------------
        var certificatebachelor_demo = '';
        const fileFour = req.files.certificatebachelor;
        if(fileFour){
          
        var newfileFour = fileFour.data;
         certificatebachelor_demo = newfileFour.toString('base64');
        } 
        // single-image-prcessed-------------------
        var certificatemasters_demo = '';
        const fileFive = req.files.certificatemasters;
        if(fileFive){ 
        var newfileFive = fileFive.data;
        certificatemasters_demo = newfileFive.toString('base64');
        }
          // single-image-prcessed-------------------
          var certificatephd_demo = '';
          const fileSix = req.files.certificatemasters;
          if(fileSix){ 
          var newfileSix = fileSix.data;
          certificatephd_demo = newfileSix.toString('base64');
          }
        
        // privacy table data insert
        const sql = "INSERT INTO privacy (useremail) VALUES(?)";
        con.query(sql,[email],(err,result)=>{

        })

       con.query(SQL_INSERT,[firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,userphoto_demo,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,certificatessc_demo,institutehsc,hscgroup,passingyearhsc,certificatehsc_demo,institutebachelor,subjectbachelor,passingyearbachelor,certificatebachelor_demo,institutemasters,subjectmasters,passingyearmasters,certificatemasters_demo,institutephd,subjectphd,passingyearphd,certificatephd_demo,profession,organization,designation,address,jwtoken,createdat],(err,result)=>{
           console.log(err)
           if(!err){
            // email send
            const msg = {
                to:`${email}`,
                from:'taijul.islam169@gmail.com',
                subject:'Email Verification',
                text:`Hello, thanks for regirstering on our site.Please Copy and paste the address below to verify your account.
                      http://${req.headers.host}/verify-email?token=${jwtoken}`,
                html:`
                <h1>Hello</h1>
                <p>Thanks for registering on our site.</p>
                <p>Please click the link below to verify your account.</p>
                <a href="http://${req.headers.host}/verify-email?token=${jwtoken}">Verify your account</a>

                `      
            }
            sgMail.send(msg, function(err, info){
                if(err){
                    console.log(info)
                    console.log("Email has not been sent!!")
                }
                else{
                    console.log("Email has been sent.")
                    
                    res.render('emailverify',{email:email})
                }
            })

              
           }
       })
        
    } catch (error) {
        console.log(error)
        
    }

});

// PROFILE IN ROUTE------------------------------
router.get("/users/profile",auth,(req,res)=>{
    const sql_ssc = `SELECT institutenamessc  FROM ssc`;
        const sql_hsc = `SELECT institutenamehsc  FROM hsc`;
        const sql_bachelor = `SELECT name  FROM bachelor`;
                con.query(sql_ssc,(err,result)=>{
                    let sscdata= result;
                    con.query(sql_hsc,(err,result)=>{
                        let hscdata= result;     
                        con.query(sql_bachelor,(err,result)=>{
                            let bachelordata = result;
                            const sql = `SELECT * FROM privacy WHERE useremail = '${req.userData[0].email}'`;
                            con.query(sql,(err,result)=>{
                               
                                res.render("profile",{userData:req.userData,privacyData:result,sscdata,hscdata,bachelordata})
                            })
                        })
                    })
                })
})

// User Profile update route
router.post('/users/profile',auth, (req,res)=>{        
    try {
        const {
            firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,institutehsc,hscgroup,passingyearhsc,institutebachelor,subjectbachelor,passingyearbachelor,institutemasters,subjectmasters,passingyearmasters,institutephd,subjectphd,passingyearphd,profession,organization,designation,address
        } = req.body;
        // single-image-prcessed-------------------
        
        if(req.files){
            const fileOne = req.files.userphoto;
            const SQL_UPDATE = `UPDATE  userinfo SET firstname=?,midlename=?,lastname=?,email=?,gender=?,dateofbirth=?,bloodgroup=?,division=?,district=?,upazila=?,userphoto=?,mobile=?,secondarymobile=?,confirmpassword=?,institutessc=?,sscgroup=?,passingyearssc=?,institutehsc=?,hscgroup=?,passingyearhsc=?,institutebachelor=?,subjectbachelor=?,passingyearbachelor=?,institutemasters=?,subjectmasters=?,passingyearmasters=?,institutephd=?,subjectphd=?,passingyearphd=?,profession=?,organization=?,designation=?,address=? WHERE  id = ${req.userData[0].id}`;
            const newfileOne = fileOne.data;
            const userphoto_demo = newfileOne.toString('base64');
            con.query(SQL_UPDATE,[firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,userphoto_demo,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,institutehsc,hscgroup,passingyearhsc,institutebachelor,subjectbachelor,passingyearbachelor,institutemasters,subjectmasters,passingyearmasters,institutephd,subjectphd,passingyearphd,profession,organization,designation,address],(err,result)=>{
                console.log("first error",err)
                if(!err){
                    req.session.message={
                        type:'alert-success',
                        intro:'Updated!',
                        message:'Updated successfully.'
                    }
                    res.redirect(`/users/profile`)
                }
            })
        }
        else{
            const SQL_UPDATE = `UPDATE  userinfo SET firstname=?,midlename=?,lastname=?,email=?,gender=?,dateofbirth=?,bloodgroup=?,division=?,district=?,upazila=?,mobile=?,secondarymobile=?,confirmpassword=?,institutessc=?,sscgroup=?,passingyearssc=?,institutehsc=?,hscgroup=?,passingyearhsc=?,institutebachelor=?,subjectbachelor=?,passingyearbachelor=?,institutemasters=?,subjectmasters=?,passingyearmasters=?,institutephd=?,subjectphd=?,passingyearphd=?,profession=?,organization=?,designation=?,address=? WHERE  id = ${req.userData[0].id}`;
            con.query(SQL_UPDATE,[firstname,midlename,lastname,email,gender,dateofbirth,bloodgroup,division,district,upazila,mobile,secondarymobile,confirmpassword,institutessc,sscgroup,passingyearssc,institutehsc,hscgroup,passingyearhsc,institutebachelor,subjectbachelor,passingyearbachelor,institutemasters,subjectmasters,passingyearmasters,institutephd,subjectphd,passingyearphd,profession,organization,designation,address],(err,result)=>{
                console.log("second error",err)
                if(!err){
                    res.redirect(`/users/profile`)
                }
            })
        }    
    } catch (error) {
        console.log(error)
        
    }
});
// User Profile Documents update route
router.post('/users/documentupdate',auth, (req,res)=>{        
    try {      
        // single-image-prcessed-------------------
        
            const SQL_UPDATE = `UPDATE  userinfo SET certificatessc= ?, certificatehsc= ?,certificatebachelor= ?,certificatemasters= ?,certificatephd= ? WHERE  id = ${req.userData[0].id}`;
            var certificatessc_demo = `${req.userData[0].certificatessc}`
            const fileTwo = req.files.certificatessc;
            if(fileTwo){
                var newfileTwo = fileTwo.data;
                certificatessc_demo = newfileTwo.toString('base64');
            }
            var certificatehsc_demo = `${req.userData[0].certificatehsc}`
            const fileThree = req.files.certificatehsc;
            if(fileThree){
                var newfileThree = fileThree.data;
                certificatehsc_demo = newfileThree.toString('base64');
            }

            var certificatebachelor_demo = `${req.userData[0].certificatebachelor}`
            const fileFour = req.files.certificatebachelor;
            if(fileFour){
                var newfileFour= fileFour.data;
                certificatebachelor_demo = newfileFour.toString('base64');
            }
            
            var certificatemasters_demo = `${req.userData[0].certificatemasters}`
            const fileFive = req.files.certificatemasters;
            if(fileFive){
                var newfileFive= fileFive.data;
                certificatemasters_demo = newfileFive.toString('base64');
            }
            var certificatephd_demo = `${req.userData[0].certificatephd}`
            const fileSix = req.files.certificatephd;
            if(fileSix){
                var newfileSix= fileSix.data;
                certificatephd_demo = newfileSix.toString('base64');
            }
           
           
            con.query(SQL_UPDATE,[certificatessc_demo,certificatehsc_demo,certificatebachelor_demo,certificatemasters_demo,certificatephd_demo,],(err,result)=>{
                console.log("first error",err)
                if(!err){

                    req.session.message={
                        type:'alert-success',
                        intro:'Updated!',
                        message:'Documents Updated successfully.'
                    }
                    res.redirect(`/users/profile`)
                }
            }) 
        
    } catch (error) {
        console.log(error)
        
    }
});

// MEMBERSHIP ROUTE------------------------------
// router.get("/users/newpayment",auth,(req,res)=>{
//     const sql ='SELECT * FROM membership'
//     con.query(sql,(err,data)=>{
//         res.render("newpayment",{data,userData:req.userData})
//     })
// });

// // FORM VALIDATION  ROUTE------------------------------
// router.get("/formvalidation",(req,res)=>{
//     res.render("formvalidation")
// })

// // FORM VALIDATION  ROUTE------------------------------
// router.post("/users/formvalidation",(req,res)=>{

//     console.log(req.body)
//     res.render("formvalidation")
// })
//--------------------------------------------------MEMBERSHIP CATEGORY ALL START---------------------------------------------------------
// CREATE MEMBERSHIP-CATEGORY  ROUTE------------------------------
router.get("/admin/createmembership",auth,(req,res)=>{
    res.render("createmembership",{userData:req.userData})
})
// CREATE MEMBERSHIP-CATEGORY ROUTE------------------------------
router.post("/admin/createmembership", auth,(req,res)=>{
    if(req.userData[0].admin == 1){
        const SQL_INSERT = "INSERT INTO membership (name,price,type,remark,useremail) VALUES(?,?,?,?,?)";
        const {name,price,membership_type,remark} = req.body;
        con.query(SQL_INSERT,[name,price,membership_type,remark,req.userData[0].email],(err,result)=>{
            console.log(err)
        })
        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'New Category Created successfully.'
        }
        res.redirect("/admin/createmembership")
    }
    else{
        res.redirect('/signin')
    }
    
})

//  MEMBERSHIP-CATEGORYLIST VIEW  ROUTE------------------------------
router.get("/admin/membershipcategory", auth,(req,res)=>{
    con.query("SELECT * FROM membership",(err,data)=>{
        res.render("membershipcategory",{userData:req.userData,data})
    })  
})
//CATEGORY UPDATE
router.get("/admin/editcategory",(req,res)=>{
    const query = req.query;
    const id = query.id;
    const name = query.name;
    const price = query.price;
    const type = query.type;
    const remark = query.remark;
    con.query(`UPDATE membership SET  name=?,price=?,type=?,remark=? WHERE id = ${id}`,[name,price,type,remark],(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Category Updated.'
        }
        res.redirect("/admin/membershipcategory")
      }
    })
    
})
//CATEGORY ACTIVATION
router.get("/admin/categoryactive/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`UPDATE membership SET  status = 1 WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Activated!',
            message:'Category Activated.'
        }
        res.redirect("/admin/membershipcategory")
      }
    })
    
})

//CATEGORY DEACTIVATION
router.get("/admin/categorydeactivate/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`UPDATE membership SET  status = 0 WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Dectivated!',
            message:'Category Dectivated.'
        }
        res.redirect("/admin/membershipcategory")
      }
    })
    
})
//CATEGORY DELETE
router.get("/admin/deletecategory/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`DELETE FROM membership  WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Delted!',
            message:'Category Deleted!!.'
        }
        res.redirect("/admin/membershipcategory")
      }
    })
    
})
//-------------------------------------------MEMBERSHIP CATEGORY ALL END-------------------------------------------



//-------------------------------------------COMMITTEE START -------------------------------------------

//  ADD COMMITEE VIEW  ROUTE------------------------------
router.get("/admin/addcommittee",admin_auth, auth,(req,res)=>{
    let sql_institution ='';
    let sql_division = '';
    // var sql_district;
    // var sql_upazila;
    if(req.adminData[0].adminrole == 2){ 
        if(req.adminData[0].category == 'university'){
            sql_institution = `SELECT * FROM institution WHERE name ='${req.adminData[0].university}' AND level = 'bachelor'`;
         }
         else if(req.adminData[0].category == 'division'){
            sql_division = `SELECT * FROM divisioninfo WHERE division ='${req.adminData[0].division}' AND central = 0`;
         }
         else if(req.adminData[0].category == 'district'){
            sql_division = `SELECT * FROM divisioninfo WHERE district ='${req.adminData[0].district}' AND central = 0`;
         }
         else if(req.adminData[0].category == 'upazila'){
            sql_division = `SELECT * FROM divisioninfo WHERE upazila = '${req.adminData[0].upazila}' AND central = 0`;
         }
        con.query("SELECT * FROM membership",(err,data)=>{
            console.log(err)
            
            con.query(sql_division,(err,divisioninfo)=>{
               
                console.log("sql_division",sql_division)
                
                    let result = JSON.stringify(divisioninfo)
                    let data = result;
                    con.query(`SELECT DISTINCT division FROM divisioninfo WHERE division = '${req.adminData[0].division}'`,(err, division)=>{
                        let divisiondata = division
                            con.query(sql_institution,(err, institutionData)=>{
                                res.render("addcommittee",{userData:req.userData,data,divisiondata,institutionData});
                            });
                           
                     
                    });
             
               
            });
       });


    }
    else{
        con.query("SELECT * FROM membership",(err,data)=>{
       
            con.query('SELECT * FROM divisioninfo',(err,divisioninfo)=>{
                
                if(!err){
                    let result = JSON.stringify(divisioninfo)
                    let data = result;
                    con.query(`SELECT DISTINCT division FROM divisioninfo WHERE central = 1`,(err, division)=>{
                        let divisiondata = division
                        if(!err){
                            con.query(`SELECT * FROM institution WHERE level = 'bachelor' AND category IS NULL`,(err, institutionData)=>{
                                res.render("addcommittee",{userData:req.userData,data,divisiondata,institutionData});
                            })
                           
                        }
                    })
                }
               
            })
       
       
        
       })
    }
    


   
})
//  ADD COMMITEE VIEW  ROUTE------------------------------
router.post("/admin/addcommittee", auth,(req,res)=>{
    
    const {name,type,category,institution,division,district,upazila,startdate,enddate,position_name,quantity,method,details} = req.body;
    con.query(`select id from committee ORDER BY id DESC LIMIT 1`,(err,idResult)=>{
        console.log("id",idResult[0].id)
        const committee_id = idResult[0].id + 1;
        for(var i = 0;i<position_name.length;i++){
            con.query('INSERT INTO committee_designation(committee_id,name,quantity,method)VALUES(?,?,?,?)',[committee_id,position_name[i],quantity[i],method[i]],(err, result)=>{
                console.log("designation err:",err)
            })
        }
    })
 
    console.log(req.body)
    console.log(position_name,quantity,method)
     // createdDate---------------
     const createdat = new Date().toLocaleDateString()
    con.query(`INSERT into committee(name,type,category,institution,division,district,upazila,startdate,enddate,createdby,createdat,details,usertoken) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,[name,type,category,institution,division,district,upazila,startdate,enddate,req.userData[0].firstname,createdat,details,req.userData[0].jwtoken],(err,insertedData)=>{

        console.log(err)
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'Committee Created!!.'
            }
            res.redirect('/admin/addcommittee')
        }
       
    })
   
})

// COMMITEE LIST VIEW  ROUTE------------------------------
router.get("/admin/committeelist",admin_auth, auth,(req,res)=>{
   if(req.adminData[0].adminrole == 2){
       con.query(`SELECT * FROM committee WHERE usertoken = '${req.userData[0].jwtoken}'`,(err, data)=>{
        res.render("committeelist",{userData:req.userData,data})
       })
   }
   else{
    con.query("SELECT * FROM committee",(err,data)=>{
        res.render("committeelist",{userData:req.userData,data})
    }) 
   }
    
})

//COMMITTEE ACTIVATION
router.get("/admin/committeeactive/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`UPDATE committee SET  status = 1 WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Activated!',
            message:'committee Activated.'
        }
        res.redirect("/admin/committeelist")
      }
    })
    
})

//COMMITTEE DEACTIVATION
router.get("/admin/committeedeactivate/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`UPDATE committee SET  status = 0 WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
        req.session.message={
            type:'alert-success',
            intro:'Dectivated!',
            message:'committee Dectivated.'
        }
        res.redirect("/admin/committeelist")
      }
    })
    
})
//Committee DELETE
router.get("/admin/deletecommittee/:id",(req,res)=>{
    const id =  req.params.id;
    con.query(`DELETE FROM committee  WHERE id = ${id}`,(err,updateresult)=>{
        console.log(updateresult)
      if(!err){
          con.query(`DELETE FROM committee_designation WHERE id = ${id}`,(err, result)=>{
            req.session.message={
                type:'alert-success',
                intro:'Delted!',
                message:'committee Deleted!!.'
            }
            res.redirect("/admin/committeelist")
          })
      }
    })
    
})

// GET COMMITTELIST FROM GENERAL USER END
router.get("/users/committeelist-user",auth, async(req,res)=>{
    let expectedData = [];
   con.query(`SELECT * FROM committee WHERE (category = 'Division' AND division = '${req.userData[0].division}' AND status = 1) OR(category = 'University' AND institution = '${req.userData[0].institutebachelor}' AND status = 1)OR (category = 'district' AND  division = '${req.userData[0].division}' AND district = '${req.userData[0].district}' AND status = 1) OR(category = 'upazila' AND division = '${req.userData[0].division}' AND district = '${req.userData[0].district}' AND upazila = '${req.userData[0].upazila}' AND status = 1)`,(err,allCommitteeData)=>{

    
    for( var a=0;a<allCommitteeData.length;a++){
        con.query(`SELECT * FROM committee_designation WHERE committee_id = ${allCommitteeData[a].id} AND method = 'election'`,(err, desigantionData)=>{
            expectedData.push(desigantionData);
           
            })   
                    
      }
     
     if(allCommitteeData.length < 1){
        res.render("committeelist-user",{userData:req.userData,allCommitteeData,Msg:'No Committee is available right now!!'})
    }
    con.query(`SELECT * FROM nominationinfo WHERE userid = ${req.userData[0].id}`,async(err,userExist)=>{
        if(userExist.length > 0){ 
            let i;
            for(i=0;i<allCommitteeData.length;i++){
                allCommitteeData[i].data = true ;
            }
           
          await  res.render("committeelist-user",{userData:req.userData,allCommitteeData,expectedData})
        }else{
            let i;
            for(i=0;i<allCommitteeData.length;i++){
                allCommitteeData[i].data = false;
            }
          await  res.render("committeelist-user",{userData:req.userData,allCommitteeData,expectedData})
        }
    }) 
      
    })    
   
});

// get-nomination-form
router.get('/users/getnomination/:id',auth,(req,res)=>{
    const committee_id =  req.params.id;
    con.query(`SELECT * FROM committee_designation WHERE committee_id = ${committee_id}`,(err, desigantionData)=>{
        con.query(`SELECT * FROM committee WHERE id = ${committee_id}`,(err,committeeData)=>{
            res.render('get-nomination',{userData:req.userData,desigantionData,committeeData})
        })
        
    })
    
})
// GET SINGLE COMMMITEE  TO EDIT  
router.get("/admin/editcommittee/:id",auth,(req,res)=>{
    const id =  req.params.id;
    con.query(`SELECT * FROM committee WHERE id = ${id}`,(err,singleCommitteeData)=>{
        con.query('SELECT * FROM divisioninfo',(err,divisioninfo)=>{
                
            if(!err){
               let result = JSON.stringify(divisioninfo)
                let data = result;
                con.query("SELECT DISTINCT division FROM divisioninfo",(err, division)=>{
                    let divisiondata = division
                    if(!err){
                        con.query("SELECT * FROM institution WHERE level ='bachelor'",(err, institutionData)=>{
                            con.query(`SELECT * FROM committee_designation WHERE committee_id = ${id}`,(err, designationData)=>{
                                res.render("editcommittee",{userData:req.userData,data,divisiondata,institutionData,singleCommitteeData,designationData});
                            })
                           
                        })
                       
                    }
                })
            }
           
        })
    })
    
});
//  ADD COMMITEE VIEW  ROUTE------------------------------
router.post("/admin/editcommittee/:id", auth,(req,res)=>{
    var position_name_arr = [];
    var position_quantity_arr = [];
    var position_method_arr = [];
    var data_arr = [];
    const id =  req.params.id;
    const {name,type,category,institution,division,district,upazila,startdate,enddate,position_name,quantity,method,desig_id,details} = req.body;
    console.log("desigdata:",desig_id)
    con.query(`SELECT id FROM committee_designation WHERE committee_id = ${id}`,(err, idData)=>{
        console.log("length:",idData.length)
        if(idData.length>0){
            idData.map((data,index)=>{
                console.log(index)
                con.query(`UPDATE committee_designation SET name = ?,quantity=?,method=? WHERE committee_id = ${id} AND id = ${data.id}`,[position_name[index],quantity[index],method[index]],(err, result)=>{    
                });
                console.log("Database id:",data)
                console.log("bodydata:",desig_id)
               if(data.id !== desig_id[index]){
                   
                   // DELETE CODE WILL BE
                   console.log("missig data array:",data_arr)
                   console.log("Dosent match!!")
                   const nf_id =  data.id;
                   
                   data_arr.push(nf_id)
                   console.log("desig_id",desig_id[index])
             
              
               }
            })
            

            if(position_name.length>idData.length){
                console.log("working")
                var indexval = idData.length;
                for(var j = 0;j<(position_name.length - idData.length);j++ ){
                    con.query(`INSERT INTO committee_designation  (committee_id,name,quantity,method)VALUES(?,?,?,?)`,[id,position_name[indexval],quantity[indexval],method[indexval]],(err, result)=>{
                    })
                    indexval++;
                }
                
            }
        }
        else if(idData.length<1){
           
            if(position_name){
                position_name_arr.push(position_name);
                position_quantity_arr.push(quantity);
                position_method_arr.push(method);
                for(var j = 0;j<position_name_arr.length;j++ ){
                    console.log("body data from front:",position_name_arr[j])
                    con.query(`INSERT INTO committee_designation  (committee_id,name,quantity,method)VALUES(?,?,?,?)`,[id,position_name_arr[j],position_quantity_arr[j],position_method_arr[j]],(err, result)=>{
                    });
                }
            }
           
        }
       
     });
   
  
    con.query(`UPDATE committee SET name =?,type =?,category =?,institution =?,division =?,district =?,upazila =?,startdate =?,enddate =?,details=? WHERE id =  ${id}`,[name,type,category,institution,division,district,upazila,startdate,enddate,details],(err,updateData)=>{

        console.log(err)
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'Updated!',
                message:'Committee Updated!!.'
            }
            res.redirect(`/admin/editcommittee/${id}`)
        }
       
    })
   
})
//  // get result page/sinlgeview of committee after publishing result 
router.get("/users/singlecommitteeview/:id",auth,(req,res)=>{
    const com_id = req.params.id;
    con.query(`SELECT * FROM committee WHERE id = ${com_id}`,(err,committee_info)=>{
        con.query(`SELECT  userid FROM nominationinfo WHERE   designation = 'President' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT 1`,(err,presidentData)=>{
            if(presidentData.length >0){
                con.query(`SELECT firstname,mobile,userphoto FROM userinfo WHERE id = ${presidentData[0].userid}`,(err, presidentInfo)=>{
                    con.query(`SELECT userid FROM nominationinfo WHERE designation = 'General Secretary' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT 1`,(err,secretaryData)=>{
                        con.query(`SELECT firstname,mobile,userphoto FROM userinfo WHERE id =${secretaryData[0].userid}`,(err,secretaryInfo)=>{
                            console.log(err)
                            con.query(`SELECT userid,name FROM nominationinfo WHERE designation = 'Vice President' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT ${committee_info[0].vice_president_num}`,(err,vicepresidentData)=>{
                                con.query(`SELECT name,userid FROM nominationinfo WHERE designation = 'Assistant General Secretary' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT ${committee_info[0].assistant_general_secretary_num}`,(err,agsData)=>{
                                    res.render("singlecommitteeview",{userData:req.userData,presidentInfo,secretaryInfo,vicepresidentData,agsData,committee_info})
                                });
                            });
                        });     
                    });
                });
            }
            else{
                res.render("singlecommitteeview",{userData:req.userData,committee_info})
            }
           
        });
    }); 
 
    
});
// single-comview-admin
router.get('/admin/singlecomviewadmin/:id',auth,(req,res)=>{
    const id =  req.params.id;
    con.query(`SELECT * FROM committee WHERE id = ${id}`,(err, committeeData)=>{
        con.query(`SELECT * FROM committee_designation WHERE committee_id =${id} AND method = 'election'`,(err, designationData)=>{
            con.query(`SELECT * FROM committee_designation WHERE committee_id =${id} AND method = 'selection'`,(err,selectiveData)=>{
                res.render('singlecomviewadmin',{userData:req.userData,committeeData,designationData,id,selectiveData})
            })
            
        })
    })
    // con.query(`SELECT * FROM committee com,committee_designation cd WHERE  com.id = cd.committee_id and com.id = ${id}`,(err, result)=>{
    //     console.log(result)
    // })
    
})
//-------------------------------------------COMMITTEE END -------------------------------------------
//  ADD NOMINATION  ROUTE------------------------------
router.post("/users/addnomination", auth,(req,res)=>{
    const {name,userid,type,area,designation,committee_id,details} = req.body;

      // single-image-prcessed-------------------
       var attachment_nomi = "";
    //   const fileOne = req.files.nomination_attachment;
      const filename = (req.files != null) ? req.files.nomination_attachment : null;
      if(filename){
          var newfileOne = filename.data;
          attachment_nomi = newfileOne.toString('base64');
      }
     // createdDate---------------
     const createdat = new Date().toLocaleDateString()
    con.query(`INSERT into nominationinfo(userid,name,committee_type,area,designation,committee_id,nomination_attachment,details) VALUES(?,?,?,?,?,?,?,?)`,[userid,name,type,area,designation,committee_id,attachment_nomi,details],(err,insertedData)=>{
        console.log(err)
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'You have been nominated.'
            }
            res.redirect('/users/committeelist-user')
        }
       
    })
   
});
router.get('/admin/deletenomination/:id/:com_id',(req,res)=>{
    const id =  req.params.id;
    const com_id =  req.params.com_id;
    con.query(`UPDATE nominationinfo SET  delete_status = 1 WHERE id =${id}`,(err,deleteresult)=>{
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'User has been deleted from nomination list'
        }
        res.redirect(`/admin/nominationlist/${com_id}`)
    })
});
// GET Nomination list 
router.get("/admin/nominationlist/:id",auth,(req,res)=>{
    const id =  req.params.id;
    var userData_arr = []
    con.query(`SELECT * FROM nominationinfo WHERE committee_id = ${id} AND delete_status = 0 AND selective IS NULL`,(err, allNominationData)=>{
        con.query(`SELECT name FROM committee_designation WHERE committee_id = ${id}`,(err, designationData)=>{
            res.render("nominationlist",{userData:req.userData,allNominationData,id,designationData});
        });
        
    });
    
});
// GET Nomination delete history 
router.get("/admin/nominationhistorylist/:id",auth,(req,res)=>{
    const id =  req.params.id;
    var userData_arr = []
    con.query(`SELECT * FROM nominationinfo WHERE committee_id = ${id} AND delete_status = 1`,(err, allNominationData)=>{
        con.query(`SELECT name FROM committee_designation WHERE committee_id = ${id}`,(err, designationData)=>{
            res.render("nominationlist",{userData:req.userData,allNominationData,id,designationData});
        });
        
    });
    
});

router.get('/admin/movetonomination/:id/:com_id',(req,res)=>{
    const id =  req.params.id;
    const com_id =  req.params.com_id;
    con.query(`UPDATE nominationinfo SET  delete_status = 0 WHERE id =${id}`,(err,deleteresult)=>{
        req.session.message={
            type:'alert-danger',
            intro:'Created!',
            message:'User has been moved to nomination list'
        }
        res.redirect(`/admin/nominationlist/${com_id}`)
    })
});
// GET Customresult page 
router.get("/admin/customresult/:id",auth,(req,res)=>{
    const id =  req.params.id;
    con.query(`SELECT * FROM nominationinfo WHERE committee_id = ${id}`,(err, allNominationData)=>{
        res.render("customresult",{userData:req.userData,allNominationData,id})
    })

});
// POST Customresult page 
router.post("/admin/customresult/:id",auth,(req,res)=>{
    const id =  req.params.id;
    const {vote}  =req.body;
    console.log(vote)
    con.query(`SELECT * FROM nominationinfo WHERE committee_id = ${id}`,(err, allNominationData)=>{
        for(var i=0;i<allNominationData.length;i++){   
            con.query(`UPDATE nominationinfo SET vote = ${vote[i]} WHERE id=${allNominationData[i].id}`,(err,result)=>{
                console.log(vote[i])
                console.log(result)
            })
        }
        res.redirect(`/admin/customresult/${id}`)
    })

});
// GET voting page 
router.get("/users/voting/:id",auth,(req,res)=>{
    const id =  req.params.id;
    var userData_arr = []
    con.query(`SELECT * FROM nominationinfo WHERE committee_id = ${id} AND delete_status = 0 AND selective IS NULL`,(err, allNominationData)=>{
        con.query(`SELECT * FROM committee_designation WHERE committee_id = ${id}`,(err, designationData)=>{
            con.query(`SELECT * FROM vote_info WHERE committee_id =${id} AND userid = ${req.userData[0].id}`,(err,voteData)=>{
                con.query(`SELECT enddate FROM committee WHERE id = ${id}`,(err,end_date)=>{

                    const desiData = designationData;
               const degiprocessData = JSON.stringify(desiData)
               const ProcdData = voteData;
                const processDataVote = JSON.stringify(ProcdData)
                console.log(processDataVote)
                //   
                res.render("voting",{userData:req.userData,allNominationData,id,designationData,processDataVote,degiprocessData,end_date});

                })
               
             
               
            })
           
        });
        
    });
});
// voting status-activating 
router.get("/admin/activevotingstatus/:id",auth,(req,res)=>{
    const com_id = req.params.id;
    con.query(`UPDATE committee SET voting_status = 1 WHERE id = ${com_id}`,(err,result)=>{
        console.log(err)
        res.redirect('/admin/committeelist')

    })
});
// voting status-deactivating 
router.get("/admin/deactivevotingstatus/:id",auth,(req,res)=>{
    const com_id = req.params.id;
    con.query(`UPDATE committee SET voting_status = 0 WHERE id = ${com_id}`,(err,result)=>{
        console.log(err)
        res.redirect('/admin/committeelist')

    })
});
// voting result publish 
router.get("/admin/publishresult/:id",auth,(req,res)=>{
    const com_id = req.params.id;
    con.query(`UPDATE committee SET result_status = 1 , voting_status = 0 WHERE id = ${com_id}`,(err,result)=>{
        con.query(`SELECT * FROM committee WHERE id = ${com_id}`,(err,committee_info)=>{
            con.query(`SELECT  userid FROM nominationinfo WHERE   designation = 'President' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT 1`,(err,presidentData)=>{
                if(presidentData.length >0){
                    con.query(`SELECT firstname,mobile,userphoto FROM userinfo WHERE id = ${presidentData[0].userid}`,(err, presidentInfo)=>{
                        for(var i = 0;i<presidentData.length;i++){
                            con.query(`UPDATE userinfo SET committee_designation = 'President' WHERE id = ${presidentData[i].userid}`,(err,result)=>{    
                            })
                        }
                        con.query(`SELECT userid FROM nominationinfo WHERE designation = 'General Secretary' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT 1`,(err,secretaryData)=>{
                            con.query(`SELECT firstname,mobile,userphoto FROM userinfo WHERE id =${secretaryData[0].userid}`,(err,secretaryInfo)=>{
                                for(var i = 0;i<secretaryData.length;i++){
                                    con.query(`UPDATE userinfo SET committee_designation = 'General Secretary' WHERE id = ${secretaryData[i].userid}`,(err,result)=>{    
                                    })
                                }
                                console.log(err)
                                con.query(`SELECT userid,name FROM nominationinfo WHERE designation = 'Vice President' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT ${committee_info[0].vice_president_num}`,(err,vicepresidentData)=>{
                                    for(var i = 0;i<vicepresidentData.length;i++){
                                        con.query(`UPDATE userinfo SET committee_designation = 'Vice President' WHERE id = ${vicepresidentData[i].userid}`,(err,result)=>{    
                                        })
                                    }
                                    con.query(`SELECT name,userid FROM nominationinfo WHERE designation = 'Assistant General Secretary' AND committee_id = ${com_id} ORDER BY vote DESC LIMIT ${committee_info[0].assistant_general_secretary_num}`,(err,agsData)=>{
                                        for(var i = 0;i<agsData.length;i++){
                                            con.query(`UPDATE userinfo SET committee_designation = 'A.G.Secretary' WHERE id = ${agsData[i].userid}`,(err,result)=>{    
                                            })
                                        }
                                        res.redirect(`/admin/nominationlist/${com_id}`)
                                    });
                                });
                            });     
                        });
                    });
                }
                else{
                    res.redirect(`/admin/nominationlist/${com_id}`)
                }
               
            });
        }); 

    })
});

// GET voting page 
router.post("/users/voting/:id",auth,(req,res)=>{
    const committee_id = req.params.id;
      let num_vote;
     const {candidate_id,designation} = req.body;
    con.query(`INSERT INTO vote_info (committee_id,userid,candidate_id,designation)VALUES(?,?,?,?)`,[committee_id,req.userData[0].id,candidate_id,designation],(err,result)=>{
        con.query(`SELECT * FROM nominationinfo WHERE userid=${candidate_id}`,(err, voteResult)=>{
            num_vote=voteResult[0].vote
            num_vote = ++num_vote;
            con.query(`UPDATE nominationinfo SET vote=? WHERE userid =${candidate_id}`,[num_vote],(err,voteUpdate)=>{
            }) 
        })
       res.redirect(`/users/voting/${committee_id}`)
    });  
 });
 
//selective result
router.post('/admin/selectiveresult',auth,(req,res)=>{
    const { com_id,designation,userid} = req.body;
    const status = 1;
    con.query(`INSERT INTO nominationinfo (userid,designation,committee_id,selective)VALUES(?,?,?,?)`,[userid,designation,com_id,status],(err,result)=>{
        console.log(err)
    })

})

// ================================PAYMENT===============================

// Apply Membership  ROUTE------------------------------
router.get("/users/newpayment",auth,(req,res)=>{
    const sql = 'SELECT * FROM membership';
    con.query(sql,(err,data)=>{
        if(!err){
            con.query('SELECT DISTINCT category FROM membership',(err,result)=>{
              if(!err){
                const category = data;
                const allData = JSON.stringify(category)
                res.render("newpayment",{userData:req.userData,category,allData,result})
              }
            })
        }
        
    })
    
})
// make new payment
router.post("/users/newpayment",auth,(req,res)=>{

       // createdDate---------------
       const createdat = new Date().toLocaleDateString()

         // single-image-prcessed-------------------
         const fileFour = req.files.payment_document;
         const newfileFour = fileFour.data;
         const document = newfileFour.toString('base64');


    const SQL_INSERT = `INSERT INTO payment (paymenttitle,paymentfor,paymentmethod,transactionid,category,senderno,document,amount,paymentdate,email,createdat) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
    const {paymenttitle,paymentfor,paymentmethod,transactionid,category,senderno,amount,email,paymentdate} = req.body;
    con.query(SQL_INSERT,[paymenttitle,paymentfor,paymentmethod,transactionid,category,senderno,document,amount,paymentdate,email,createdat],(err,result)=>{
        if(result){
            req.session.message={
                type:'alert-success',
                intro:'Created!',
                message:'Payment Sent to Admin.'
            }
            res.redirect('/users/newpayment')
        }
    })
    

    
})

// my payment list  ROUTE------------------------------
router.get("/users/mypayment",auth,(req,res)=>{
    const sql = `SELECT * FROM payment where email = '${req.userData[0].email}'`;
    con.query(sql,(err,paymentData)=>{   
        res.render("mypayment",{userData:req.userData,paymentData})
    })
    
})
// my payment list  ROUTE------------------------------
router.get("/users/deletemypayment/:id",auth,(req,res)=>{
    const id =  req.params.id;
    const sql = `DELETE  FROM payment where id = ${id}`;
    con.query(sql,(err,paymentData)=>{   
        if(paymentData){
            req.session.message={
                type:'alert-success',
                intro:'Deleted!',
                message:'Deleted Successfully.'
            }
            if( req.userData[0].admin == 1){
                res.redirect("/admin/idcardpayment")
            }
            else{
                res.redirect("/users/mypayment")
            }
            
        }
    })
    
});


// ================================USER MENAGEMENT/VERIFIED USER/UNVERIFIED USER/BLOCK USER===============================
// Verified User  ROUTE------------------------------
router.post('/admin/filterdata',auth,(req,res)=>{
    const {district,mobile,id} = req.body;
    let sql;
  if(req.query.page == 'newuserlist'){
    if(district != '' && mobile != ''  && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND district = '${district}'  AND mobile = '${mobile}' AND id = ${id}`;
    }
    else if(district == '' &&  mobile != '' && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND  mobile = '${mobile}' AND id = ${id}`;
    }
    else if(district == '' &&  mobile == '' && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND id = ${id}`;
    }
    else if(district == '' &&  mobile != '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND  mobile = '${mobile}' `;
    }
    else if(district != '' &&  mobile != '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND  district = '${district}' AND mobile = ${mobile}`;
    }
    else if(district != '' &&  mobile == '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 0 AND  district = '${district}'`;
    }
}
else{
    if(district != '' && mobile != ''  && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND district = '${district}'  AND mobile = '${mobile}' AND id = ${id}`;
    }
    else if(district == '' &&  mobile != '' && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND  mobile = '${mobile}' AND id = ${id}`;
    }
    else if(district == '' &&  mobile == '' && id != ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND id = ${id}`;
    }
    else if(district == '' &&  mobile != '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND  mobile = '${mobile}' `;
    }
    else if(district != '' &&  mobile != '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND  district = '${district}' AND mobile = ${mobile}`;
    }
    else if(district != '' &&  mobile == '' && id == ''){
        sql = `SELECT * FROM userinfo WHERE verify = 1 AND  district = '${district}'`;
    }
}
   
    con.query(sql,(err,verifieduserData)=>{
        console.log(err)
        if(!err){
            let StringData = JSON.stringify(verifieduserData);
            res.render(`verifieduser`,{userData:req.userData,verifieduserData,StringData})
        }
    })
});

router.get('/admin/filterdata',(req,res)=>{
    var url_parts = url.parse(req.url);
    console.log(url_parts.pathname);
    res.redirect(url_parts.pathname);
    // if(url_parts.pathname == '/admin/filterdata'){
    //    res.render("verifieduser")
    // }
    // else{
    //     res.redirect(url_parts.pathname);
    // }
    

})
router.get("/admin/verifieduser",auth,(req,res)=>{

    let sql;
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{ 
            console.log(err);
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 1 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,verifieduserData)=>{   
                    let StringData = JSON.stringify(verifieduserData);
                    if(!err){
                        con.query('SELECT DISTINCT district FROM divisioninfo',(err, divisionInfo)=>{
                            console.log(err)
                           if(!err){
                            res.render("verifieduser",{userData:req.userData,verifieduserData,StringData,divisionInfo})
                           }
                        })
                    }
                    
                })
             }
            
        })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 1`;
        con.query(sql,(err,verifieduserData)=>{
            let StringData = JSON.stringify(verifieduserData);
            if(!err){
                con.query('SELECT DISTINCT district FROM divisioninfo',(err, divisionInfo)=>{
                   if(!err){
                    res.render("verifieduser",{userData:req.userData,verifieduserData,StringData,divisionInfo});
                   }
                })
            }
            // res.render("verifieduser",{userData:req.userData,verifieduserData,StringData})
        })
    }
    
   
    
});
// verified filter
// router.post()

// Unverified/New  User  ROUTE------------------------------
router.get("/admin/newuserlist",auth,(req,res)=>{
    let sql ;
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
          
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 0 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,verifieduserData)=>{   
                    let StringData = JSON.stringify(verifieduserData);
                    res.render("verifieduser",{userData:req.userData,verifieduserData,StringData})
                })
             }
            
        })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 0`;
        con.query(sql,(err,verifieduserData)=>{   
            let StringData = JSON.stringify(verifieduserData);
            res.render("verifieduser",{userData:req.userData,verifieduserData,StringData})
        })
    }
})

// Block  User  ROUTE------------------------------
router.get("/admin/blockuserlist",auth,(req,res)=>{
    let sql ;
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
          
             if(!err){
                sql = `SELECT * FROM userinfo where block = 1 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,verifieduserData)=>{   
                    res.render("blocklist",{userData:req.userData,verifieduserData});
                })
             }
            
        })
       
    }else{
        sql = `SELECT * FROM userinfo where block = 1`;
        con.query(sql,(err,verifieduserData)=>{   
            res.render("blocklist",{userData:req.userData,verifieduserData})
        })
    }
});

//Block user post method
router.get("/admin/blockuser/:id",auth,(req,res)=>{
    const id = req.params.id;
    con.query(`UPDATE userinfo SET block = 1 WHERE id = ${id}`,(err,result)=>{
        if(!err){
            res.redirect(req.get('referer'));
        }
    })
});
//UnBlock user post method
router.get("/admin/unblockuser/:id",auth,(req,res)=>{
    const id = req.params.id;
    con.query(`UPDATE userinfo SET block = 0 WHERE id = ${id}`,(err,result)=>{
        if(!err){
            res.redirect(req.get('referer'));
        }
    })
});
// admin idcard payment list  ROUTE------------------------------
router.get("/admin/idcardpayment",auth,(req,res)=>{
    const sql = `SELECT * FROM payment where paymentfor = 'Id Card'`;
    con.query(sql,(err,idcardpaymentData)=>{   
        res.render("idcardpayment",{userData:req.userData,idcardpaymentData})
    })
});
// admin idcard payment list  ROUTE------------------------------
router.get("/admin/membershippayment",auth,(req,res)=>{
    const sql = `SELECT * FROM payment where paymentfor = 'membership'`;
    con.query(sql,(err,membershippaymentData)=>{   
        res.render("membershippayment",{userData:req.userData,membershippaymentData})
    })
});
// admin idcard payment list  ROUTE------------------------------
router.get("/admin/eventpayment",auth,(req,res)=>{
    const sql = `SELECT * FROM payment where paymentfor = 'Event'`;
    con.query(sql,(err,eventpaymentData)=>{   
        res.render("eventpayment",{userData:req.userData,eventpaymentData})
    })
});
// update  idcard payment list  ROUTE------------------------------
router.get("/admin/makeeligbleforidcard/:id",auth,(req,res)=>{
    const id =  req.params.id;
    let sql_update = `UPDATE payment SET status = 1  WHERE id = ${id}`;
    con.query(sql_update,(err,updatepayment)=>{ 
        con.query(`SELECT DISTINCT email FROM payment WHERE id = ${id}`,(err, emailResult)=>{
            console.log("this is email",emailResult[0].email)
            con.query(`UPDATE userinfo SET idcard = 1 WHERE email = '${emailResult[0].email}'`,(err, updateResult)=>{
                console.log("idcard eligible true",updateResult)
                res.redirect("/admin/idcardpayment")
            })
            
        })
       
        
    });
    
});


// SIGN IN ROUTE------------------------------
router.get("/signin",(req,res)=>{
    res.render("signin")
})

// General user signin--------------
router.post('/signin', async(req,res)=>{
    try {
        let token;
        const { email, password } = req.body;
        const sql = `SELECT * FROM userinfo WHERE email = '${email}'`
        con.query(sql,(err,result)=>{
            if(result.length>0){
                 const passMatch = (password === result[0].confirmpassword);
                  token = result[0].jwtoken;

                // const passMatch = await bcrypt.compare(password, result[0].password); 
                if(passMatch == true && result[0].verifyemail == 1 ){
                    if(result[0].verify == 1){
                        if(result[0].block == 1){
                            res.render('signin',{errorMsg :`You are temporary blocked!!\n Please contact with admin.`})
                        }
                        else{
                            res.cookie("jwtoken",token,{
                                expires:new Date(Date.now()+259000000),
                                httpOnly:true
                            });
                            req.session.message={
                                type:'alert-success',
                                intro:'logedin!',
                                message:'Welcome to Dashboard.'
                            }
        
                            if(result[0].admin === 1){
                                res.redirect('/admin')
                            }
                            else{
                                res.redirect('/users')
                            } 

                        }
                    }
                    else{
                        res.render('signin',{errorMsg :`You are not yet verified by the authority!!\n Please contact with admin.`})
                    }                   
                      
                }
                else{
                   res.render('signin',{errorMsg :'Invalid Login!!'})
                }
            }
            else{
                res.render('signin',{errorMsg:'Email dose not exist!!!'})
            }
               
            })
            
        
    } catch (error) {
        res.status(500).json(error);
    }

})

// // logout functionality--------------------

router.get("/logout", (req,res)=>{
    try {
        res.clearCookie("jwtoken");
        console.log("logout success...");
        res.redirect("/signin");
    } catch (error) {
        res.status(500).send(error)
        
    }
});

// Blood  ROUTE------------------------------
router.get("/users/blood",auth,(req,res)=>{
    let sql;
    if(req.userData[0].admin === 0){
         sql = `SELECT * FROM userinfo WHERE donateblood = 1 AND district = '${req.userData[0].district}'`;
    }else{
         sql = `SELECT * FROM userinfo WHERE donateblood = 1`;
    }
    con.query(sql,(err,data)=>{
       const rawdata =  data;
       const donatebloodData=  JSON.stringify(data)
      
       res.render("blood",{userData:req.userData,donatebloodData,rawdata})
    })
    
})
// Blood  ROUTE------------------------------
router.get("/users/singledonorview/:id",auth,(req,res)=>{
    const id = req.params.id;
    const sql = `SELECT * FROM userinfo WHERE id = ${id}`;
    con.query(sql,(err,singleuserData)=>{
        const sql_privacy = `SELECT * FROM privacy WHERE useremail = '${singleuserData[0].email}'`;
        con.query(sql_privacy,(err,privacyData)=>{
            console.log(privacyData)
            res.render("singledonorview",{userData:req.userData,singleuserData,privacyData});
        }) 
        
    })
    
})
// singleuserview  ROUTE------------------------------
router.get("/users/singleuserview/:id",auth,(req,res)=>{
 if(req.userData[0].admin == 1){
    const id = req.params.id;
    const sql = `SELECT * FROM userinfo WHERE id = ${id}`;
    con.query(sql,(err,singleuserData)=>{
        
        const sql_privacy = `SELECT * FROM privacy WHERE useremail = '${singleuserData[0].email}'`;
        con.query(sql_privacy,(err,privacyData)=>{
            console.log(privacyData)
            res.render("singleuserview",{userData:req.userData,singleuserData,privacyData});
        }) 
        
    })
 }else{
     res.status(500).send("Permission Denied!!")
 }
    
})
// AVAILABLEBLOODLIST  ROUTE------------------------------
router.get("/users/availablebloodlist/:bloodgroup",auth,(req,res)=>{
    const bloodgroup = req.params.bloodgroup;
    let sql;
    if(req.userData[0].admin == 1){
         sql = `SELECT * FROM userinfo WHERE bloodgroup = '${bloodgroup}' AND donateblood = 1 AND email != '${req.userData[0].email}'`;
    }
    else{
        sql  = `SELECT * FROM userinfo WHERE bloodgroup = '${bloodgroup}' AND donateblood = 1 AND district = '${req.userData[0].district}' AND email != '${req.userData[0].email}'`;
    }
   
    let nodata;
    con.query(sql,(err, bloodData)=>{
       if(bloodData.length<1){
          nodata = 'No Data found!!!' 
          res.render('availablebloodlist',{bloodData,userData:req.userData,bloodgroup,nodata})
       }
       else{
        res.render('availablebloodlist',{bloodData,userData:req.userData,bloodgroup})  
       }
        
    })
    // con.query(sql,(err,singleuserData)=>{
    //     const sql_privacy = `SELECT * FROM privacy WHERE useremail = '${singleuserData[0].email}'`;
    //     con.query(sql_privacy,(err,privacyData)=>{
    //         console.log(privacyData)
    //         res.render("singleuserview",{userData:req.userData,singleuserData,privacyData});
    //     }) 
        
    // })
    
    
})
router.post('/users/privacyupdate/:email',(req,res)=>{
    const email = req.params.email;
    var updateData =  req.body;
    var sql = `UPDATE privacy SET ? WHERE useremail = ?`;
   
    con.query(sql, [updateData, email], function (err, data) {  
    if (err) throw err;
    con.query(`SELECT * FROM privacy WHERE useremail = '${email}'`,(err,result)=>{
        console.log("data after updated:",result)
        const sql_userinfo = `UPDATE userinfo SET donateblood = ${result[0].donateblood} WHERE email = '${email}'`;
        con.query(sql_userinfo,(err, updateresult)=>{
        })
    })
    
    console.log(data.affectedRows + " record(s) updated");
  });
  res.redirect('/users/profile');
})

// USER VERIFY-----------------------------------
router.get('/users/verify/:id',(req,res)=>{
    const id = req.params.id;
    var sql = `UPDATE userinfo SET verify = 1 WHERE id = ${id}`;
    con.query(sql,(err,updateresult)=>{
        res.redirect('/admin');
    })

  
})
// USER DELETE-----------------------------------
router.get('/users/deleteuser/:id',(req,res)=>{
    const id = req.params.id;
    var sql = `DELETE FROM userinfo WHERE id = ${id}`;
    con.query(sql,(err,updateresult)=>{
        res.redirect('/admin');
    })

  
})


// =========================================ADMIN CREATE READ UPDATE DELETE==============================================
// CREATE ADMIN GET METHOD-----------------------------------
router.get('/admin/create-admin',auth,(req,res)=>{
    
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM divisioninfo',(err,divisioninfo)=>{  
            let result = JSON.stringify(divisioninfo)
                let data = result;
                con.query("SELECT DISTINCT division FROM divisioninfo",(err, division)=>{
                    console.log(err)
                    let divisiondata = division;
                    con.query(`SELECT * FROM institution WHERE level =  'bachelor'`,(err ,institutionlist)=>{
                        res.render("create-admin",{userData:req.userData,data,divisiondata,institutionlist})
                    })
                    
                });  
        })
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 })

// CREATE ADMIN POST METHOD-----------------------------------
 router.post('/admin/create-admin',auth,(req,res)=>{ 
    const {email,adminrole,adminarea,password,category,division,district,upazila,university} = req.body;
    const sql_all_email = `SELECT email,id FROM userinfo WHERE email = '${email}' AND verify = 1`;
    con.query(sql_all_email,(err,validuser)=>{
       if(validuser.length >0){
        console.log("valid user:",validuser[0].id)
        const sql_already_admin = `SELECT email FROM admininfo WHERE email = '${email}'`
        con.query(sql_already_admin,(err,result)=>{
           
            if(result.length>0){
                req.session.message={
                    type:'alert-danger',
                    intro:'already admin',
                    message:'Already Admin.'
                }
                res.redirect("/admin/create-admin")
            }
            else{
                const sql = "INSERT INTO admininfo (email,adminrole,adminarea,userid,category,division,district,upazila,university,jwtoken) VALUES (?,?,?,?,?,?,?,?,?,?)";
                if(password == req.userData[0].confirmpassword){
                    con.query(`SELECT jwtoken FROM userinfo WHERE email='${email}'`,(err ,jwtokenData)=>{
                        con.query(sql,[email,adminrole,adminarea,validuser[0].id,category,division,district,upazila,university,jwtokenData[0].jwtoken],(err,result)=>{
                            console.log(err)
                            con.query(`UPDATE userinfo SET admin = 1, adminrole = '${adminrole}' WHERE email = '${email}'`,(err,updateresult)=>{
            
                                if(result){
                                    req.session.message={
                                        type:'alert-success',
                                        intro:'success',
                                        message:'Admin created Successfully.'
                                    }
                                    res.redirect("/admin/create-admin")
                                }
                            })
                            console.log("Admin created Successfully!!")
                        })
                    })
                   
                   
                }
                else{
                    req.session.message={
                        type:'alert-danger',
                        intro:'Wrong password!',
                        message:'Wrong Password!!.'
                    }
                    res.redirect("/admin/create-admin")
                }
            }
        })  
     
       }
       else{
        req.session.message={
            type:'alert-danger',
            intro:'Wrong email!',
            message:'User dose not exist!!!!.'
        }
        res.redirect("/admin/create-admin")
       }
    }) 

  

 });
  


//  ADMIN LIST GET METHOD-----------------------------------
router.get('/admin/admin-list',auth,(req,res)=>{
  
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM admininfo',(err, alladminData)=>{
            res.render("admin-list",{userData:req.userData,alladminData});
        })
       
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 });

 //  ADMIN UPDATE POST METHOD-----------------------------------
router.get('/admin/update-admin',auth,(req,res)=>{
    const id = req.query.id;
    const email = req.query.email;
    const adminrole = req.query.adminrole;
    const adminarea = req.query.adminarea;

    con.query(`UPDATE admininfo SET adminrole = ?,adminarea = ? WHERE id = ${id}`,[adminrole,adminarea],(err,updateresult)=>{

        if(!err){
            con.query(`UPDATE userinfo SET adminrole = ? WHERE email='${email}'`,[adminrole],(err,update)=>{
                if(!err){
                    req.session.message={
                        type:'alert-success',
                        intro:'updated!',
                        message:'Admin data updated!.'
                    }
                    res.redirect("/admin/admin-list")
                }
            })
            
        }
    });
 });

  //  ADMIN UPDATE POST METHOD-----------------------------------
router.get('/admin/deleteadmin/:id/:email',auth,(req,res)=>{
    const id = req.params.id;
    const email = req.params.email;
    const sql = `DELETE FROM admininfo WHERE id = ${id}`;
    con.query(sql,(err,updateresult)=>{
       console.log(err)
        if(!err){
            con.query(`UPDATE userinfo SET admin = 0, adminrole = null WHERE email = '${email}'`,(err,result)=>{
              if(!err){
                req.session.message={
                    type:'alert-success',
                    intro:'Deleted!',
                    message:'Admin Deleted Successfully.'
                }
                res.redirect("/admin/admin-list")
              }
            })
          
        }
    });
 });


//  TEAM SECTION
router.get("/admin/team",auth,(req,res)=>{
    try {
          con.query('SELECT person_id FROM team',(err, teamData)=>{
            for(let i = 0; i<teamData.length;i++){ 
             con.query(`SELECT id,firstname,lastname,mobile,email,committee_designation FROM userinfo WHERE id = ${teamData[i].person_id}`,(err,teamList)=>{ 
                  teamData[i].name = teamList[0].firstname;
                  teamData[i].email = teamList[0].email;
                  teamData[i].mobile = teamList[0].mobile;
                 });
              }  
            res.render("addteam",{userData:req.userData,teamData});
           });
          
           
           
    } catch (error) {
        console.log(error)
    }
    
         
});
//  TEAM SECTION
router.post("/admin/team", auth,(req,res)=>{
    const {personid} = req.body;
    con.query('INSERT INTO team (person_id) VALUES (?)',[personid],(err,result)=>{
       res.redirect('/admin/team') 
    });
  });
 // ==============================================NOTICE CRUD START================================================
 // notice list-----------------------------------
router.get('/admin/noticelist',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM notice',(err,noticeList)=>{
            
            if(!err){
                res.render("noticelist",{userData:req.userData,noticeList})
            }
        })
       
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 })

//  get creatnotice page
 router.get('/admin/createnotice',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        res.render("createnotice",{userData:req.userData})
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 });


 //create notice POST METHOD-----------------------------------
 router.post('/admin/createnotice',auth,(req,res)=>{ 
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
    const sql = 'INSERT INTO notice (title,details,file,created_by,created_at)VALUES(?,?,?,?,?)';
    con.query(sql,[title,details,processed_file,created_by,created_at],(err, result)=>{ 
        console.log(err);
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'created!',
                message:'Notice Created Successfully.'
            }
            res.redirect("/admin/createnotice")
        }
    })

 });

 // instituiton update----------------------
router.get("/admin/editnotice/:id/:title/:details",(req,res)=>{
    const id =  req.params.id;
    const title =  req.params.title;
    const details =  req.params.details;
    let sql_update =`UPDATE notice SET title=?,details=? WHERE id = ${id}`;
    
    con.query(sql_update,[title,details],(err, updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/admin/noticelist')
    })
})
// notice delete----------------------
router.get("/admin/deletenotice/:id",(req,res)=>{
    const id =  req.params.id;
    
    let sql_delete =  `DELETE  FROM notice WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/admin/noticelist')
    })
});
  

// notice deactive----------------------
router.get("/admin/noticedeactivate/:id",(req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE notice SET status = 0  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-danger',
            intro:'Deactivated!',
            message:'Deactivated successfully.'
        }
        res.redirect('/admin/noticelist')
    })
});
// notice active----------------------
router.get("/admin/noticeactive/:id",(req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE notice SET status = 1  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'activated!',
            message:'activated successfully.'
        }
        res.redirect('/admin/noticelist')
    })
});
 // Contact message list-----------------------------------
 router.get('/admin/contactlist',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM contactinfo',(err,contactList)=>{
            console.log(err)
            console.log(contactList)
            if(!err){
                res.render("contactlist",{userData:req.userData,contactList})
            }
        }) 
    }
    else{
        res.send("Entry Restricted!!")
    }

 })
 router.get('/admin/singlecontact/:id',auth,(req,res)=>{
     const id =  req.params.id;
     con.query(`SELECT * FROM contactinfo WHERE id = ${id}`,(err, result)=>{
        res.render('singlecontact',{userData:req.userData,result});
     });

 })
// ==============================================BLOG CRUD START================================================
 // blog list-----------------------------------
 router.get('/admin/bloglist',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM blog',(err,noticeList)=>{    
            if(!err){
                res.render("bloglist",{userData:req.userData,noticeList})
            }
        }) 
    }

    else{
        con.query(`SELECT * FROM blog WHERE jwtoken  = '${req.userData[0].jwtoken}'`,(err,noticeList)=>{    
            if(!err){
                res.render("bloglist",{userData:req.userData,noticeList})
            }
        }) 
    }
 })

//  get creatnotice page
 router.get('/admin/createblog',auth,(req,res)=>{
        res.render("createblog",{userData:req.userData})

 });


 //create notice POST METHOD-----------------------------------
 router.post('/admin/createblog',auth,(req,res)=>{ 
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

 });

 // instituiton update----------------------
router.get("/admin/editblog/:id/:title/:details",(req,res)=>{
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
})
// blog delete----------------------
router.get("/admin/deleteblog/:id",(req,res)=>{
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
});
  

// blog deactive----------------------
router.get("/admin/blogdeactivate/:id",(req,res)=>{
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
});
// blog active----------------------
router.get("/admin/blogactive/:id",(req,res)=>{
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
});


// ==============================================EVENT CRUD START================================================
 // blog list-----------------------------------
 router.get('/admin/eventlist',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        con.query('SELECT * FROM event',(err,noticeList)=>{    
            if(!err){
                res.render("eventlist",{userData:req.userData,noticeList})
            }
        }) 
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 })

//  get creatnotice page
 router.get('/admin/createevent',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        res.render("createevent",{userData:req.userData})
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 });


 //create notice POST METHOD-----------------------------------
 router.post('/admin/createevent',auth,(req,res)=>{ 
    let {title,details,start_date,end_date,start_time,end_time,file} = req.body;
    var processed_file = '';
    if(req.files){ 
        var documentFile = req.files.file;
        var newdocumentFile = documentFile.data;
        processed_file = newdocumentFile.toString('base64');
    }
    function onTimeChange(time) {
        var timeSplit = time.split(':'),
          hours,
          minutes,
          meridian;
        hours = timeSplit[0];
        minutes = timeSplit[1];
        if (hours > 12) {
          meridian = 'PM';
          hours -= 12;
        } else if (hours < 12) {
          meridian = 'AM';
          if (hours == 0) {
            hours = 12;
          }
        } else {
          meridian = 'PM';
        }
        return start_time =  hours + ':' + minutes + ' ' + meridian;
      }
      function onTimeChangeEnd(time) {
        var timeSplit = time.split(':'),
          hours,
          minutes,
          meridian;
        hours = timeSplit[0];
        minutes = timeSplit[1];
        if (hours > 12) {
          meridian = 'PM';
          hours -= 12;
        } else if (hours < 12) {
          meridian = 'AM';
          if (hours == 0) {
            hours = 12;
          }
        } else {
          meridian = 'PM';
        }
        return end_time =  hours + ':' + minutes + ' ' + meridian;
      }
    var created_by = `${req.userData[0].firstname} ${req.userData[0].lastname}`;
     // createdDate---------------
     const created_at = new Date().toLocaleDateString();
     const views = null;
    const sql = 'INSERT INTO event (title,details,file,start_date,end_date,start_time,end_time,created_by)VALUES(?,?,?,?,?,?,?,?)';
    onTimeChange(start_time)
    onTimeChangeEnd(end_time)
    con.query(sql,[title,details,processed_file,start_date,end_date,start_time,end_time,created_by],(err, result)=>{ 
        console.log(err);
        if(!err){
            req.session.message={
                type:'alert-success',
                intro:'created!',
                message:'Event Created Successfully.'
            }
            res.redirect("/admin/createevent")
        }
    })

 });

 // instituiton update----------------------
router.get("/admin/editevent/:id/:title/:details/:start_date/:end_date/:start_time/:end_time",(req,res)=>{
    const id =  req.params.id;
    const title =  req.params.title;
    const details =  req.params.details;
    const start_date =  req.params.start_date;
    const end_date =  req.params.end_date;
    const start_time =  req.params.start_time;
    const end_time =  req.params.end_time;
    let sql_update =`UPDATE event SET title=?,details=?,start_date=?,end_date=?,start_time=?,end_time=? WHERE id = ${id}`;
    
    con.query(sql_update,[title,details,start_date,end_date,start_time,end_time],(err, updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Updated!',
            message:'Updated successfully.'
        }
        res.redirect('/admin/eventlist')
    })
})
// event delete----------------------
router.get("/admin/deleteevent/:id",(req,res)=>{
    const id =  req.params.id;
    
    let sql_delete =  `DELETE  FROM event WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'Deleted!',
            message:'Deleted successfully.'
        }
        res.redirect('/admin/eventlist')
    })
});
  

// event deactive----------------------
router.get("/admin/eventdeactivate/:id",(req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE event SET status = 0  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-danger',
            intro:'Deactivated!',
            message:'Deactivated successfully.'
        }
        res.redirect('/admin/eventlist')
    })
});
// event active----------------------
router.get("/admin/eventactive/:id",(req,res)=>{
    const id =  req.params.id;
    let sql_delete =  `UPDATE event SET status = 1  WHERE id = ${id}`;

    con.query(sql_delete,(err,updateresult)=>{
        console.log(err)
        console.log(updateresult)
        req.session.message={
            type:'alert-success',
            intro:'activated!',
            message:'activated successfully.'
        }
        res.redirect('/admin/eventlist')
    })
});
// router.get('/users/sendemail',(req,res)=>{
//     const msg = {
//         to:'taijul.islam169@gmail.com',
//         from:'software1.polock@gmail.com',
//         subject:'Testing Node email Service',
//         text:'This is awesome email sent from node app'
//     }
//     sgMail.send(msg, function(err, info){
//         if(err){
//             console.log("Email has not been sent!!")
//         }
//         else{
//             console.log("Email has been sent.")
//         }
//     })

// })




// Email send demo-------------------------

//================================================================= LAB END======================================================





module.exports =  router;