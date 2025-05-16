const jwt = require('jsonwebtoken');
const createToken = (req, res, next) => {
    const payload = { ...req.body }; // ודא ש-req.body מכיל רק מידע בטוח
    const secret = process.env.JWT_SECRET; // שם משתנה ברור יותר
    const options = { expiresIn: '1h' }; // הוסף זמן תפוגה לטוקן

    if (!secret) {
        return res.status(500).send("JWT secret is not defined");
    }

    try {
        const token = jwt.sign(payload, secret, options);
        res.cookie('token', token, { httpOnly: true, secure: true });
        req.token = token;
        console.log(token);
        next();
    } catch (err) {
        console.error("Error creating token:", err);
        res.status(500).send("Error creating token");
    }
};
//verify עדכנית
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // שליפת ה-Token מה-Cookie

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send("Forbidden");
        }
        req.user = decoded; // שמירת המידע המפוענח ב-request
        next();
    });
};
//////////////////
const verifyToken1=(req,res,next)=>{
    let token = req.headers["authorization"]
    if(token){
        jwt.verify(token, process.env.PASSWORD, (err, decoded)=>{
            if(err){
                res.status(401).send("Unauthorized")
            }else{
                req.user = decoded
                next()
            }
        })
    }else{
        res.status(401).send("Unauthorized")
    }
}
/////////////////////
const verifyTokenForManager=(req,res,next)=>{
    let token = req.headers["authorization"]
    if(token){
        jwt.verify(token, process.env.PASSWORD, (err, decoded)=>{
            if(err){
                res.status(401).send("Unauthorized")
            }else{
                if(decoded.role==="manager"){
                    req.user = decoded
                    next()
                }else{
                    res.status(401).send("Unauthorized")
                }
            }
        })
    }else{
        res.status(401).send("Unauthorized")
    }
}

module.exports={
    createToken
}
