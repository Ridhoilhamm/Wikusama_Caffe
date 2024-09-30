const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "ridho";

const authVerify = async(req, res, next) => {
    try{
        const header = req.headers.authorization; //minta token
        if(header == null){  //kalo ga ada token
            return res.status(400).json({
                message: "missing token",
                err: null
            })
        }

        let token = header.split(" ")[1]; //ambil token dari bearer token, ambil elemen kedua
        let decodedToken;
        try{
            decodedToken = await jsonwebtoken.verify(token, SECRET_KEY); //verifikasi token pake secret key
        }
        catch(error){
            if (error instanceof jsonwebtoken.TokenExpiredError){ //kalo tokennya kadaluwarsa
                return res.status(400).json({
                    message: "token expired",
                    err: error,
                });
            }
            return res.status(400).json({
                message: "invalid token",
                err: error,
            });
        }
    
    req.userData = decodedToken; //nyimpen data user
    next();
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            message:error,
        })
    }
}
module.exports = {authVerify};