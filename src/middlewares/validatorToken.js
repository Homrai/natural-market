import jwt from "jsonwebtoken";
import { generateToken, tokenVerificationErrors } from "../utils/tokenManage.js";

//valida el token para hacer consultas
export const requireToken =(req,res,next)=>{
    try {
        //console.log("entro a token");
        let token = req.headers?.authorization;
        if (!token) throw new Error("No Bearer");
        token = token.split(" ")[1];
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid=uid;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).send({msj:tokenVerificationErrors[error.message], ok:false});

    }
}

//valida el refresh token guardado en la cookie para generar el token de consulta y devolverlo junto al id
export const requireRefreshToken=(req,res,next)=>{
    try {
        const {refreshtoken}= req.params;
        if (!refreshtoken) return res.status(401).json({error: "Error datos"})
        const tokenRefresh =refreshtoken; //cookie.split("=")[1];
        const {uid} = jwt.verify(tokenRefresh, process.env.JWT_REFRESH);
        const {token, expiresIn} = generateToken(uid);
        res.status(201).json({token, expiresIn, uid})
    } catch (error) {
        res.status(401).send({error:tokenVerificationErrors[error.message]});

    }

}