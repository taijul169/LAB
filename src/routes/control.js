
const express =  require('express');
const bycript = require("bcryptjs");
const crypto = require("crypto");
const bodyParser =  require("body-parser");
const flash =  require('connect-flash')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv =  require('dotenv');
dotenv.config({path:'../config.env'});
// middleware
const auth = require('../middleware/authenticate')
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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')

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
    res.render('addinstitution',{userData:req.userData})
})


router.post('/users/addinstitution/ssc', async(req,res)=>{
    try {
        const SQL_INSERT = "INSERT INTO ssc (  institutenamessc, institutecodessc ) VALUES (?,?)";
        const {
            institutenamessc,
            institutecodessc,
        } = req.body;
        console.log(institutenamessc, institutenamessc)
        con.query(SQL_INSERT,[institutenamessc, institutecodessc],(err,result)=>{
             console.log(err)

         })
    } catch (error) {
        console.log(error)
        
    }
    req.flash('message','added successfully');
    res.redirect('/users/addinstitution')  
})
router.post('/users/addinstitution/hsc', async(req,res)=>{
    try {
        const SQL_INSERT = "INSERT INTO hsc (  institutenamehsc, institutecodehsc ) VALUES (?,?)";
        const {
            institutenamehsc,
            institutecodehsc,
        } = req.body;
        con.query(SQL_INSERT,[institutenamehsc, institutecodehsc],(err,result)=>{
             console.log(err)

         })
    } catch (error) {
        console.log(error)
        
    }
    req.flash('message','added successfully');
    res.redirect('/users/addinstitution') 
})
router.post('/users/addinstitution/bachelor', async(req,res)=>{
    try {
        const SQL_INSERT = "INSERT INTO bachelor (  institutenamebachelor, institutecodebachelor ) VALUES (?,?)";
        const {
            institutenamebachelor,
            institutecodebachelor,
        } = req.body;
        con.query(SQL_INSERT,[institutenamebachelor, institutecodebachelor],(err,result)=>{
             console.log(err)

         })
    } catch (error) {
        console.log(error)
        
    }
    req.flash('message','added successfully');
    res.redirect('/users/addinstitution')
})

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
    const sql_ssc =  "SELECT * FROM ssc";
    con.query(sql_ssc,(err, sscdata)=>{
        con.query("select * from hsc",(err,hscdata)=>{
            con.query("select * from bachelor",(err, bachelordata)=>{
                con.query("select * from divisioninfo",(err, divisiondata)=>{
                    res.render("institutionlist",{userData:req.userData,sscdata,hscdata,bachelordata,divisiondata})
                })
               
            })
            
        })
        
    })
    
})

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
        sql_update = `UPDATE ${degree} SET institutenamebachelor = ?,institutecodebachelor = ?  WHERE id = ${id}`;
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
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 0 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,allData)=>{   
                    res.render("admin-home",{userData:req.userData,allData})
                })
             }
    })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 0`;
        con.query(sql,(err,allData)=>{   
            res.render("admin-home",{userData:req.userData,allData})
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
                   
                   res.render('index',{noticeData,blogData}) 
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


// -register---------------------
router.get('/signup',(req,res)=>{
    try {
        // const sql = `SELECT * FROM districtinfo`;
        const sql = `SELECT * FROM divisioninfo`;
        // const sql_district = `SELECT DISTINCT districtname  FROM districtinfo`;
        const sql_division = `SELECT DISTINCT division  FROM divisioninfo`;
        const sql_ssc = `SELECT institutenamessc  FROM ssc`;
        const sql_hsc = `SELECT institutenamehsc  FROM hsc`;
        const sql_bachelor = `SELECT institutenamebachelor  FROM bachelor`;
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
        const sql_bachelor = `SELECT institutenamebachelor  FROM bachelor`;
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
router.get("/admin/addcommittee", auth,(req,res)=>{
    con.query("SELECT * FROM membership",(err,data)=>{
        res.render("addcommittee",{userData:req.userData,data})
    })  
})
//  ADD COMMITEE VIEW  ROUTE------------------------------
router.post("/admin/addcommittee", auth,(req,res)=>{
    const {name,type,startdate,enddate} = req.body;
    console.log(req.body)
     // createdDate---------------
     const createdat = new Date().toLocaleDateString()
    con.query(`INSERT into committee(name,type,startdate,enddate,createdby,createdat) VALUES(?,?,?,?,?,?)`,[name,type,startdate,enddate,req.userData[0].firstname,createdat],(err,insertedData)=>{

        req.session.message={
            type:'alert-success',
            intro:'Created!',
            message:'Committee Created!!.'
        }
        res.redirect('/admin/addcommittee')
    })
   
})

// COMMITEE LIST VIEW  ROUTE------------------------------
router.get("/admin/committeelist", auth,(req,res)=>{
    con.query("SELECT * FROM committee",(err,data)=>{
        res.render("committeelist",{userData:req.userData,data})
    })  
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
        req.session.message={
            type:'alert-success',
            intro:'Delted!',
            message:'committee Deleted!!.'
        }
        res.redirect("/admin/committeelist")
      }
    })
    
})
//-------------------------------------------COMMITTEE END -------------------------------------------


// ================================PAYMENT===============================

// Apply Membership  ROUTE------------------------------
router.get("/users/newpayment",auth,(req,res)=>{
    const sql = 'SELECT * FROM membership';
    con.query(sql,(err,data)=>{
        if(!err){
            con.query('SELECT DISTINCT paymentfor FROM payment',(err,result)=>{
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
router.get("/admin/verifieduser",auth,(req,res)=>{
    let sql;
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
           
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 1 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,verifieduserData)=>{   
                    res.render("verifieduser",{userData:req.userData,verifieduserData})
                })
             }
            
        })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 1`;
        con.query(sql,(err,verifieduserData)=>{   
            res.render("verifieduser",{userData:req.userData,verifieduserData})
        })
    }
    
   
    
});
// Unverified/New  User  ROUTE------------------------------
router.get("/admin/newuserlist",auth,(req,res)=>{
    let sql ;
    if(req.userData[0].adminrole == 2){
        con.query(`SELECT *  FROM admininfo WHERE email = '${req.userData[0].email}'`,(err,adminData)=>{
          
             if(!err){
                sql = `SELECT * FROM userinfo where verify = 0 AND district = '${adminData[0].adminarea}'`  
                con.query(sql,(err,verifieduserData)=>{   
                    res.render("verifieduser",{userData:req.userData,verifieduserData})
                })
             }
            
        })
       
    }else{
        sql = `SELECT * FROM userinfo where verify = 0`;
        con.query(sql,(err,verifieduserData)=>{   
            res.render("verifieduser",{userData:req.userData,verifieduserData})
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
                    res.render("blocklist",{userData:req.userData,verifieduserData})
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
router.post("/admin/blockuser/:id",auth,(req,res)=>{
    const id = req.params.id;
    con.query(`UPDATE userinfo SET block = 1 WHERE id = ${id}`,(err,result)=>{
        if(!err){
            return true;
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
                if(passMatch == true && result[0].verifyemail == 1){
                    if(result[0].verify == 1){
                        res.cookie("jwtoken",token,{
                            expires:new Date(Date.now()+259000000),
                            httpOnly:true
                        });
                        req.session.message={
                            type:'alert-success',
                            intro:'logedin!',
                            message:'Successfully Login.'
                        }
    
                        if(result[0].admin === 1){
                            res.redirect('/admin')
                        }
                        else{
                            res.redirect('/users')
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
        res.render("create-admin",{userData:req.userData})
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 })

// CREATE ADMIN POST METHOD-----------------------------------
 router.post('/admin/create-admin',auth,(req,res)=>{ 
    const {email,adminrole,adminarea,password} = req.body;
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
                const sql = "INSERT INTO admininfo (email,adminrole,adminarea,userid) VALUES (?,?,?,?)";
                if(password == req.userData[0].confirmpassword){
                    con.query(sql,[email,adminrole,adminarea,validuser[0].id],(err,result)=>{
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
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
 })

//  get creatnotice page
 router.get('/admin/createblog',auth,(req,res)=>{
    if(req.userData[0].adminrole == 1){
        res.render("createblog",{userData:req.userData})
    }
    else{
        res.status(500).send("Entry Restricted!! Please contact with Super admin.")
    }
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