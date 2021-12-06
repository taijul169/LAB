const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// const fs= require('fs');
const fileUpload = require('express-fileupload');
const authenticate = require('../middleware/authenticate');
const Adminauthenticate = require('../middleware/admin-authenticate');
const router = express.Router();
const request = require('request')
let path = require('path');
const multer = require('multer');
// require('../db/conn');


const mysql =  require('mysql2');
const { query } = require('express');
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
//========================================================= MYSQL CONVERT==================================================================
router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/signin',(req,res)=>{
    res.render('signin')
})
router.get('/dashboard',(req,res)=>{
    res.render('users-home')
})
router.post('/signup', async(req,res)=>{
        
    try { 

       
        const SQL_INSERT = "INSERT INTO user (refereeId,email,firstName,lastName,perPhoneOne,perPhoneTwo,perPhoneThree,dateOfBirth,userPhoto,NIDfront,NIDback,NIDnumber,createdDate,password,token) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const SQL_INSERT_PRESENTADD = "INSERT INTO presentaddress (presentAddHouseNo,presentAddHouseName,presentAddLaneNumber,presentAddRoadNo,presentAddPoliceStn,presentAddVillage,presentAddUpozella,presentAddPostCode,presentAddDistrict,perPhoneOne) VALUES(?,?,?,?,?,?,?,?,?,?)";
        const SQL_INSERT_PERMANANTADD = "INSERT INTO permanantaddress (permanantAddHouseNo,permanantAddHouseName,permanantAddLaneNumber,permanantAddRoadNo,permanantAddPoliceStn,permanantAddVillage,permanantAddUpozella,permanantAddPostCode,permanantAddDistrict,perPhoneOne) VALUES(?,?,?,?,?,?,?,?,?,?)";
        const SQL_INSERT_NOMINEEONE = "INSERT INTO nomineeone (nomineeAddHouseName,nomineeLaneNumber,nomineeAddRoadNo,nomineePhoneOne,nomineeAddPoliceStn,nomineeAddVillage,nomineeAddUpozella,nomineeAddPostCode,nomineeAddDistrict,nomineePercentage,nomineeRelationship,nomineeName,perPhoneOne,nomineePhoto) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const SQL_INSERT_VERIFY = "INSERT INTO codeverify (perPhoneOne,code,referenceNumber) VALUES(?,?,?)";
        const {
            email,
            firstName,
            lastName,
            dateOfBirth,
            perPhoneOne,
            perPhoneTwo,
            perPhoneThree,
            referenceNumber,
            NIDnumber,
            password,
            presentAddHouseNo,
            presentAddHouseName,
            presentAddLaneNumber,
            presentAddRoadNo,
            presentAddPoliceStn,
            presentAddVillage,
            presentAddUpozella,
            presentAddPostCode,
            presentAddDistrict ,
            permanantAddHouseNo,
            permanantAddHouseName,
            permanantAddLaneNumber,
            permanantAddRoadNo,
            permanantAddPoliceStn,
            permanantAddVillage,
            permanantAddUpozella,
            permanantAddPostCode,
            permanantAddDistrict,
            nomineeAddHouseName,
            nomineeLaneNumber,
            nomineeAddRoadNo,
            nomineePhoneOne,
            nomineeAddPoliceStn,
            nomineeAddVillage,
            nomineeAddUpozella,
            nomineeAddPostCode,
            nomineeAddDistrict,
            nomineeRelationship,
            nomineePercentage,
            nomineeName,
        } = req.body;
        console.log(req.body)
        // createdDate---------------
        const createdDate = new Date().toLocaleDateString()
        //Random 8 digit refereeID------------------
        const RANDOM_NUM = Math.round((Math.random()*10000));
        const RANDOM_NUM_TWO = Math.round((Math.random()*10000));
        const refereeId = `cv${RANDOM_NUM}${RANDOM_NUM_TWO}`
        // code-generation
        const code = Math.round((Math.random()*1000000));
        // SECRETTOKEN GEREARATION
        const token =  `@1231@3#CV${RANDOM_NUM*1000}${RANDOM_NUM_TWO*1000}${RANDOM_NUM}${RANDOM_NUM_TWO}`
        // single-image-prcessed-------------------
        const fileOne = req.files.fileOne;
        const newfileOne = fileOne.data;
        const encImgOne = newfileOne.toString('base64');
         // single-image-prcessed-------------------
         const fileTwo = req.files.fileTwo;
         const newfileTwo = fileTwo.data;
         const encImgTwo = newfileTwo.toString('base64');
          // single-image-prcessed-------------------
        const fileThree = req.files.fileThree;
        const newfileThree = fileThree.data;
        const encImgThree = newfileThree.toString('base64');
        // single-image-prcessed-------------------
        const fileFour = req.files.fileFour;
        const newfileFour = fileFour.data;
        const encImgFour = newfileFour.toString('base64');
        

        // Phone already exist or no checking
        const FIND_NUMBER = `SELECT perPhoneOne FROM user WHERE perPhoneOne = ${perPhoneOne}`;
        db.query(FIND_NUMBER,(err, result)=>{
            if(result.length>0){
                res.status(500).json({error:"User already exist!!"})
                console.log("User already exist!!")
                console.log("existing data:",result);
            }else{
                // Query Execution---------------------------
             db.query(SQL_INSERT,[refereeId,email,firstName,lastName,perPhoneOne,perPhoneTwo, perPhoneThree, dateOfBirth,encImgOne,encImgTwo,encImgThree,NIDnumber,createdDate,password,token],(err, result)=>{
                console.log(err);
                if(result){
                   db.query(SQL_INSERT_VERIFY,[perPhoneOne,code,referenceNumber],(err, result)=>{
                       console.log(err);
                   });
                   db.query(SQL_INSERT_PRESENTADD,[presentAddHouseNo,presentAddHouseName,presentAddLaneNumber,presentAddRoadNo,presentAddPoliceStn,presentAddVillage,presentAddUpozella,presentAddPostCode,presentAddDistrict,perPhoneOne],(err, result)=>{
                       console.log(err);
                   });
                   db.query(SQL_INSERT_PERMANANTADD,[permanantAddHouseNo,permanantAddHouseName,permanantAddLaneNumber,permanantAddRoadNo,permanantAddPoliceStn,permanantAddVillage,permanantAddUpozella,permanantAddPostCode,permanantAddDistrict,perPhoneOne],(err, result)=>{
                       console.log(err);
                   });
                   db.query(SQL_INSERT_NOMINEEONE,[nomineeAddHouseName,nomineeLaneNumber,nomineeAddRoadNo,nomineePhoneOne,nomineeAddPoliceStn,nomineeAddVillage,nomineeAddUpozella,nomineeAddPostCode,nomineeAddDistrict,nomineePercentage,nomineeRelationship,nomineeName,perPhoneOne,encImgFour],(err, result)=>{
                       console.log(err);
                   });
                   res.status(201).json({message:"User Created Successfully."});
                   res.redirect
                 
                }
                else{
                   res.status(404).json("Something wrong with your input!!");
                   console.log("Something went wrong with your input!!")
                }
              });
            }
        })
        
    } catch (error) {
        console.log(error)
        
    }

 
});

//========================================================= CROWD FUNDING START==================================================================
// add multiple nominees---------------------------------
router.post('/addnominee/', async(req,res)=>{
    try {
        const SQL_INSERT_NOMINEEONE = "INSERT INTO nomineetwo (nomineeAddHouseName,nomineeLaneNumber,nomineeAddRoadNo,nomineePhoneOne,nomineeAddPoliceStn,nomineeAddVillage,nomineeAddUpozella,nomineeAddPostCode,nomineeAddDistrict,nomineePercentage,nomineeRelationship,nomineeName,perPhoneOne,nomineePhoto) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const perPhoneOne = req.query.key;
        const {
            secondNomineeAddHouseName,
            secondNomineeLaneNumber,
            secondNomineeAddRoadNo,
            secondNomineePhoneOne, 
            secondNomineeAddPoliceStn,
            secondNomineeAddVillage,
            secondNomineeAddUpozella,
            secondNomineeAddPostCode,
            secondNomineeAddDistrict,
            secondNomineeRelationship,
            secondNomineePercentage,
            secondNomineeName,
        } = req.body;
        // single-image-prcessed-------------------
          const fileOne = req.files.fileOne;
          const newfileOne = fileOne.data;
          const encImgOne = newfileOne.toString('base64');
        
         db.query(SQL_INSERT_NOMINEEONE,[secondNomineeAddHouseName,secondNomineeLaneNumber,secondNomineeAddRoadNo,secondNomineePhoneOne,secondNomineeAddPoliceStn,secondNomineeAddVillage,secondNomineeAddUpozella,secondNomineeAddPostCode,secondNomineeAddDistrict,secondNomineePercentage,secondNomineeRelationship,secondNomineeName,perPhoneOne,encImgOne],(err,result)=>{
             console.log(err)

         })
    } catch (error) {
        console.log(error)
        
    }
})


// sending sms route---------------------
router.get ('/sendsms/:refId/:perPhoneOne', async(req, res)=>{
  
    const refereeId =  req.params.refId;
    const uniqueKEY =  req.params.perPhoneOne;
    console.log("refereeId",refereeId);
    console.log("perPhoneOne",uniqueKEY);
    
    try {
        const query = `SELECT * FROM user WHERE perPhoneOne = ${uniqueKEY}`;
        const query_two = `SELECT * FROM codeverify WHERE perPhoneOne = ${uniqueKEY}`;
        db.query(query,(err,resultTwo)=>{
            // sms sending to applicants
            //From api documentation-----------------------
            var options = { method: 'POST',
            url: 'http://api.icombd.com/api/v3/sendsms/plain',
            headers: 
            { 'content-type': 'application/x-www-form-urlencoded' },
            form: 
            { user: 'tariqkhan',
            password: '100200300', sender: '03590001944',
            text: `Welcome to Crowd Carnival-Let's grow togethere!Your application reference number ,email and password is:${resultTwo[0].refereeId},${resultTwo[0].email} & ${resultTwo[0].password}.Your referee is: ${refereeId}`,
            to: '88'+uniqueKEY } };
            request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            })
           

         })
        db.query(query_two,(err,result)=>{
            if(result){
                req.data =  result;
                res.send(req.data);   
            }
            
        })
        // const VeriData  = await Verify.findOne({refereeId:refereeId, perPhoneOne:uniqueKEY})
        // const  userData = await User.findOne({perPhoneOne:uniqueKEY});

    } catch (error) {
        console.log(error);
        
    }

});

// ========================================================
// verify route
// ========================================================
router.get ('/verify/', async(req, res)=>{

    const refereeId =  req.query.refId;
    const uniqueKEY =  req.query.perPhoneOne;
    try {
     const query = `SELECT * FROM user WHERE refereeId = '${refereeId}'`;
     const query_two = `SELECT * FROM codeverify WHERE referenceNumber= '${refereeId}' AND perPhoneOne=${uniqueKEY}`;
     db.query(query,(err,userData)=>{
         console.log("User data is :"+ userData)

    db.query(query_two,(err, codeData)=>{
    console.log("code data"+ codeData);
    const SECURITY_CODE = codeData[0].code;
    const mob =  userData[0].perPhoneOne;
    //From api documentation-----------------------
    var options = { method: 'POST',
    url: 'http://api.icombd.com/api/v3/sendsms/plain',
    headers: 
    { 'content-type': 'application/x-www-form-urlencoded' },
    form: 
    { user: 'tariqkhan',
    password: '100200300', sender: '03590001944',
    text: `Crowd Funding Verification code:${SECURITY_CODE}`,
    to: '88'+mob } };
    request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    })
    
    req.data =  codeData;
    res.send(req.data);

    })
        
})
     
    //  const ReferenceData  = await User.findOne({refereeId})
    //  const VeriData  = await Verify.findOne({refereeId:refereeId, perPhoneOne:uniqueKEY})
 
    // res.redirect(`verifyphone?refId=${req.refereeId}`);
    } catch (error) {
        console.log(error);
    }
    
    // res.json({message:"code has been sent to your number"}) 
});

// ========================================================
// verifyphone route
// ========================================================
router.post ('/verifyphone/', async(req, res)=>{
  
    const refereeId =  req.query.refId;
    const uniqueKEY =  req.query.perPhoneOne;
    try {      
        const query = `SELECT * FROM codeverify WHERE perPhoneOne = ${uniqueKEY}`;
        db.query(query,(err,result)=>{
            const veryCodeDB = result[0].code;
            const phoneDB = result[0].perPhoneOne;
            const {veriCode, perPhoneOne} = req.body;
            if(veryCodeDB == veriCode && perPhoneOne == phoneDB){
                var sql = `UPDATE user SET primaryVerify = 1 WHERE perPhoneOne = ${phoneDB}`;
                db.query(sql,(err,result)=>{
                    if(result){
                        res.status(200).json({success:'code  matched!!'});
                    }
                })
                
                 // res.redirect(`/signin`);
            }
            else{
                res.status(401).json({error:'code dosent match!!'})
            }

        })

    //    const  verifyData = await Verify.findOne({perPhoneOne:uniqueKEY});
   
    } catch (error) {
        console.log(error);
        
    }

});

// ========================================================
// updateinfo
// ========================================================
router.post('/updateinfo',authenticate, async(req,res)=>{
    try {
        const {
            presentAddHouseNo,
            presentAddHouseName,
            presentLaneNumber,
            presentAddRoadNo,
            presentAddPoliceStn,
            presentAddVillage,
            presentAddUpozella,
            presentAddPostCode,
            presentAddDistrict,
            // permanantAddHouseNo,
            // permanantAddHouseName,
            // permanantLaneNumber,
            // permanantAddRoadNo,
            // permanantAddPoliceStn,
            // permanantAddVillage,
            // permanantAddUpozella,
            // permanantAddPostCode,
            // permanantAddDistrict,
        } = req.body;
        const specificUser = await User.findOne({_id:req.userID});
        if(specificUser){
                const userMessage = await specificUser.addMessage(
                presentAddHouseNo,
                presentAddHouseName,
                presentLaneNumber,
                presentAddRoadNo,
                presentAddPoliceStn,
                presentAddVillage,
                presentAddUpozella,
                presentAddPostCode,
                presentAddDistrict
                )
            await specificUser.save();
            res.status(201).json({message:"Information Updated Successfully"})
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/personaldataupdate',authenticate, async(req,res)=>{
    res.send(req.rootUser)
})
// dashboard route
router.get('/api/dashboard',authenticate, async(req,res)=>{
    // res.write(req.presentaddress)
    res.status(201).send(req.data)
})

// userprofile route
router.get('/api/user-profile',authenticate, async(req,res)=>{
    // res.write(req.presentaddress)
    res.status(201).send(req.data)
})

// ========================================================
// User Verification By Admin
// =======================================================

router.get('/api/request-list', Adminauthenticate, async(req, res)=>{
    try {
        const sql =  "SELECT * FROM user WHERE verify = 0 ";
        db.query(sql,(err,result)=>{
            if(result.length > 0){
                req.Users = result;
                res.status(200).send(req.Users)   
            }
        })
    } catch (error) {
        console.log(error)
        

    }

})


// midleware-for-user-verification

// ========================================================
router.get ('/api/user-verifymedium/:key', async(req, res)=>{
    const key =  req.params.key;
    try {
    const sql = `SELECT * FROM user WHERE perPhoneOne =${key}`;
    db.query(sql,(err,result)=>{
        if(result.length >0){
               //From api documentation-----------------------
                var options = { method: 'POST',
                url: 'http://api.icombd.com/api/v3/sendsms/plain',
                headers: 
                { 'content-type': 'application/x-www-form-urlencoded' },
                form: 
                { user: 'tariqkhan',
                password: '100200300', sender: '03590001944',
                text: `Congratulations Mr.${result[0].firstName}.Your Account has been verified.Your phone number is:${result[0].perPhoneOne} & username is:${result[0].password}`,
                to: '88'+key } };
                request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log(body);
                })
                req.reqUserData =  result;
                res.send(req.reqUserData);

        }
    })
    // res.redirect(`verifyphone?refId=${req.refereeId}`);
    } catch (error) {
        console.log(error);
    }
    
    // res.json({message:"code has been sent to your number"}) 
});


// user verification by admin------------------------------
router.post('/api/verify-user/:key', Adminauthenticate, async(req, res)=>{
    try {
        const key =  req.params.key;
        const sql = `UPDATE user SET verify = 1 WHERE perPhoneOne = ${key}`;
        const sql_presentadd = `UPDATE presentaddress SET verify = 1 WHERE perPhoneOne = ${key}`;
        const sql_permanantadd = `UPDATE permanantaddress SET verify = 1 WHERE perPhoneOne = ${key}`;
        const sql_nomineeone = `UPDATE nomineeone SET verify = 1 WHERE perPhoneOne = ${key}`;

        db.query(sql,(err,personaldata)=>{
            console.log(err);
        })
        db.query(sql_presentadd,(err,personaldata)=>{
            console.log(err);
        })
        db.query(sql_permanantadd,(err,personaldata)=>{
            console.log(err);
        })
        db.query(sql_nomineeone,(err,personaldata)=>{
            console.log(err);
        })

        res.status(200).json({message:"user verified!"})
    } catch (error) {
        console.log(error)
        
    }

})

// single-req-profile-view-----------------------------
router.get('/api/single-request-view/:key', Adminauthenticate, async(req, res)=>{
    const key =  req.params.key;
    try {
        const sql_personalData = `SELECT * FROM user WHERE perPhoneOne = ${key}`;
        const sql_presentadd = `SELECT * FROM presentaddress WHERE perPhoneOne = ${key}`;
        const sql_permanantadd = `SELECT * FROM permanantaddress WHERE perPhoneOne = ${key}`;
        const sql_nomineeone = `SELECT * FROM nomineeone WHERE perPhoneOne = ${key}`;
        const sql_nomineetwo = `SELECT * FROM nomineetwo WHERE perPhoneOne = ${key}`;
        db.query(sql_personalData,(err,personaldata)=>{
            if(personaldata.length>0){
                db.query(sql_presentadd,(err,presentdata)=>{

                    console.log("personal data:",presentdata)
                    if(presentdata.length>0){
                        db.query(sql_permanantadd,(err,permanantdata)=>{
                            if(permanantdata.length>0){
                                db.query(sql_nomineeone,(err, nomineedataone)=>{
                                    if(nomineedataone.length>0){
                                        db.query(sql_nomineetwo,(err,nomineedatatwo)=>{
                                            if(nomineedataone.length >0){
                                                const allInfo =  [personaldata,presentdata,permanantdata,nomineedataone,nomineedatatwo];
                                                console.log("all data:",allInfo)
                                                req.allData = allInfo;
                                                res.send(req.allData)

                                            }
                                            else{
                                                const allInfo =  [personaldata,presentdata,permanantdata,nomineedataone];
                                                console.log("all data:",allInfo)
                                                req.allData = allInfo;
                                                res.send(req.allData)
                                            }
                                           
                                        })
                                    }
                                    else{
                                            const allInfo =  [personaldata,presentdata,permanantdata];
                                            console.log("all data:",allInfo)
                                            req.allData = allInfo;
                                            res.send(req.allData)
                                    }
                                })
                            }
                            else{
                                const allInfo =  [personaldata,presentdata];
                                console.log("all data:",allInfo)
                                req.allData = allInfo;
                                res.send(req.allData)
                            }
                        })
                    }
                })
            }
            else{
                const allInfo =  [personaldata];
                console.log("all data:",allInfo)
                req.allData = allInfo;
                res.send(req.allData)
            }
        })
    } catch (error) {
        res.status(404).json({message:'Data not found!!'})
        console.log(error)
        

    }

})


// varified user-getting route---------------------------

router.get('/api/verifieduser', Adminauthenticate,  async(req, res)=>{
    try {
        const sql =  "SELECT * FROM user WHERE verify = 1 ";
        db.query(sql,(err,result)=>{
            if(result.length > 0){
                req.Users = result;
                res.status(200).send(req.Users)   
            }
        })
    } catch (error) {
        console.log(error)
        

    }


})


router.get('/api/alladmin',async(req,res)=>{
    try {
        const alladmin =  await Admin.find();
        res.send(alladmin);
    } catch (error) {
        
    }

})

// Admin-signup route

router.post('/create-admin/',Adminauthenticate, async(req,res)=>{
    try {
        const adminPhone =  req.query.key;
        const { 
            firstName,
            lastName,
            password,
            email,
            phone,
            secretCode
        } = req.body;
        //Random 8 digit refereeID------------------
        const RANDOM_NUM = Math.round((Math.random()*10000));
        const RANDOM_NUM_TWO = Math.round((Math.random()*10000));
        const refereeId = `cv${RANDOM_NUM}${RANDOM_NUM_TWO}`
        // code-generation
        const code = Math.round((Math.random()*1000000));
        // SECRETTOKEN GEREARATION
        const token =  `@1231@3#CV${RANDOM_NUM*1000}${RANDOM_NUM_TWO*1000}${RANDOM_NUM}${RANDOM_NUM_TWO}`
        // single-image-prcessed-------------------
        const fileOne = req.files.fileOne;
        const newfileOne = fileOne.data;
        const encImgOne = newfileOne.toString('base64');

        const sql_exist = `SELECT * FROM admin WHERE phone = ${adminPhone}`;
        const sql = `SELECT * FROM admin WHERE secretCode = ${secretCode}`;
        const SQL_INSERT = "INSERT INTO admin (firstName,lastName,email,phone,password,secretCode,adminPhoto,token) VALUES(?,?,?,?,?,?,?,?)";
        db.query(sql_exist,(err,result)=>{
            if(!result || result ==""){
                 console.log("result:",result)
                  db.query(sql,(err,coderesult)=>{
                      if(coderesult){
                        db.query(SQL_INSERT,[firstName,lastName,email,phone,password,secretCode,encImgOne,token],(err,insertresult)=>{
                            if(insertresult){
                                res.status(201).json({message:"New admin created!!"})
                            }
    
                        })
                      }
                      else{
                          console.log("Invalid code");
                      }
                  })
                   
                
            }
            else{
                console.log("user already exist!!")
            }
           
        })
       
        
    } catch (error) {
        console.log(error)
        
    }

});

// Admin-signin route
router.post("/admin-login",(req,res)=>{

    try {
        const {phone,  password } = req.body;
        if( !phone || !password){
            res.status(422).json({error:'all the filed must be filled with data.!!'});
        }
        const sql =  `SELECT * FROM admin WHERE phone = ${phone}`;
        db.query(sql,(err, result)=>{
     
            if(result.length>0){
                const match_sql =  `SELECT * FROM admin WHERE phone = ${phone} AND password = ${password}`;
                db.query(match_sql,(err, matchResult)=>{
                    if(matchResult.length>0){
                        console.log(matchResult)
                        const token = matchResult[0].token

                        res.cookie("adminjwtoken",token,{
                            expires:new Date(Date.now()+259000000),
                            httpOnly:true
                        });
                        res.sendStatus(200)
                    }
                    else{
                        res.status(500).json({err:"Invalid input!!"})
                    }
                })
            }
            else{
                res.status(401).json({err:"User Dosen't exist!!!"})
            }
        })
    
    } catch (error) {
        res.status(500).json(error);
    }

})

// GET admin -route--------------
router.get('/api/admin',Adminauthenticate, async(req,res)=>{
    // res.write(req.presentaddress)
    res.status(201).send(req.rootUser)
})

//Admin Logout page---------------
router.get('/admin-logout', (req,res)=>{
    res.clearCookie('adminjwtoken',{path:'/admin-login'})
    res.status(200).json("User Logged Out")
    console.log("logged out..")
});

//General user Logout page---------------
router.get('/logout', (req,res)=>{
    res.clearCookie('mysqltoken',{path:'/'})
    res.status(200).send("User Logged Out")
    console.log("logged out..")
});


// General user signin--------------

router.post('/signin', async(req,res)=>{

    try {
        let token;
        const { perPhoneOne, password } = req.body;
        if( !perPhoneOne || !password){
            res.status(422).json({error:'all the field must be filled with data.!!'});
        }
        const sql = `SELECT * FROM user WHERE perPhoneOne = ${perPhoneOne}`
        db.query(sql,(err,result)=>{
            if(result){
                 const passMatch = (password === result[0].password);
                // const passMatch = await bcrypt.compare(password, result[0].password); 
                if(passMatch){
                    if(result[0].primaryVerify === 1){
                        if(result[0].verify === 1){
                           const  token =  result[0].token;

                            res.cookie("mysqltoken",token,{
                                expires:new Date(Date.now()+259000000),
                                httpOnly:true
                            });
                            res.status(200).json({Message:'Your are Logged in'});
                        }
                        else{
                            res.status(401).json({error:'Admin Verification Required!!'})
                        }
                    }else{
                        res.status(400).json({error:'Primary Verification Required!!'})
                    }
                    
                }
    
            }
            else{
                res.status(404).json({error:"Not Found"});
            }

        }) 
        
    } catch (error) {
        res.status(500).json(error);
    }

})


// Delete a specifi User by id

router.get('/api/delete-user/:key',(req, res)=>{
    const key = req.params.key;
    const sql = `DELETE FROM user WHERE perPhoneOne = ${key}`;
    const sql_presentadd = `DELETE FROM presentaddress WHERE perPhoneOne = ${key}`;
    const sql_permanantadd = `DELETE FROM permanantaddress WHERE perPhoneOne = ${key}`;
    const sql_nomineeone = `DELETE FROM nomineeone WHERE perPhoneOne = ${key}`;
    const sql_nomineetwo = `DELETE FROM nomineetwo WHERE perPhoneOne = ${key}`;

    db.query(sql,(err,userdeleted)=>{
        console.log("user deleted");
   
    });
    db.query(sql_presentadd,(err,presentdeleted)=>{
        console.log("presnt address deleted");
   
    });
    db.query(sql_permanantadd,(err,permanantdeleted)=>{
        console.log("permanat deleted");
   
    });
    db.query(sql_nomineeone,(err,nomineedeleted)=>{
        console.log("nomineeone deleted");
   
    });
    db.query(sql_nomineetwo,(err,nomineetwodeleted)=>{
        console.log("nomineetwo deleted");
   
    });
    res.status(200).json({message:"all the data has been deleted!"})
})

// codeverify 
router.post ('/codeverify', async(req, res)=>{
  
    try {
       const {veriCode, perPhoneOne} = req.body;
       const sql = `SELECT * FROM codeverify WHERE code = ${veriCode} AND perPhoneOne = ${perPhoneOne}`;
       db.query(sql, (err,result)=>{
           if(result.length > 0){
            const sql_update = `UPDATE user SET primaryVerify = 1 WHERE perPhoneOne = ${perPhoneOne}`;
            db.query(sql_update,(err, updateresult)=>{
                if(updateresult){
                    res.sendStatus(200)
                    console.log("primaryVerification done.")
                }
                else{
                    res.status(500)
                    console.log(err)
                }
            })
           }
           else{
               console.log(err);
               res.status(401)
           }
       }) 
    } catch (error) {
        console.log(error);
        
    }
})
//=================== CROWD FUNDING END================================
module.exports =  router;