import jwt from 'jsonwebtoken';

// const verifyToken=async(req,res,next)=>{
//     let token =req.headers["authorization"]

//     if(token){
//         token=token.split(" ")[1]
//         jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
//             if(err){
//                 return res.status(400).json({message:"Invalid token"})
//             }else{
//                 console.log(decoded)
//                 req.user=decoded
//             }
//         })
//         next()
//     }
//     else{ 
//         return res.status(400).json({message:"Invalid tokenss"})
//     }
// }
// export default verifyToken;

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  token = token.split(" ")[1]; // Bearer <token>

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded;
    next();
  });
};

export default verifyToken;
