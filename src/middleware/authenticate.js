const mysql =  require('mysql2');
const db = mysql.createPool({
  host:"localhost",
  user:"theraint_admin",
  password:"x${E123]qUfA",
  database:"theraint_main"
})
if(db){
  console.log("connection successfull with mysql db.")
}
else{
  throw console.error();
}


const Authenticate = async(req,res, next)=>{
 
  try{
    const token = req.cookies.mysqltoken;
    const sql = `SELECT * FROM user WHERE token = '${token}'`;
    db.query(sql,(err,result)=>{
      const sql_presentdata =   `SELECT * FROM presentaddress WHERE perPhoneOne = ${result[0].perPhoneOne}`;
      const sql_permanantdata =   `SELECT * FROM permanantaddress WHERE perPhoneOne = ${result[0].perPhoneOne}`;
      const sql_nomineedata =   `SELECT * FROM nomineeone WHERE perPhoneOne = ${result[0].perPhoneOne}`;
      const sql_nomineetwodata =   `SELECT * FROM nomineetwo WHERE perPhoneOne = ${result[0].perPhoneOne}`;
      db.query(sql_presentdata,(err,presentdata)=>{
        db.query(sql_permanantdata,(err,permanantAdd)=>{
          db.query(sql_nomineedata,(err,nomineeData)=>{
            db.query(sql_nomineetwodata,(err,nomineetwoData)=>{
                const allData = [result,presentdata,permanantAdd,nomineeData,nomineetwoData];
                const tokenVerify = (result[0].token === token);
                if(tokenVerify === true){
          
                  // console.log("auth data:",result)
                  req.data = allData;
                  next()
                }

            })
            
          })
        })
        
       
      })
     
     
    })
   
  }
  catch (error) {
      res.status(401).send('Unauthorized:No token Provided!')
     console.log(error); 
  }
}
module.exports = Authenticate;
