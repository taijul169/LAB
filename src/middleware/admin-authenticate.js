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

const Adminauthenticate = async(req,res, next)=>{
  try {
      const token = req.cookies.adminjwtoken;
      const sql =  `SELECT * FROM admin WHERE token = '${token}'`;
      db.query(sql, (err, result)=>{
        if(!result || result.length <=0){throw new Error("User not found!!")}

        req.rootUser = result;
        res.status(200);
        next(); 
      })   
  } catch (error) {
      res.status(401).send('Unauthorized:No token Provided!')
     console.log(error); 
  }
}
module.exports = Adminauthenticate;
