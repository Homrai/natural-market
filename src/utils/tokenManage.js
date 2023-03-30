import jwt from "jsonwebtoken";

//genera token de operaciones
export const generateToken=(uid)=>{
    const expiresIn= 60*60;
    try {
        const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn});
        return {token,expiresIn}
    } catch (error) {
        console.log(error);
    }
};

//genera refresh token para actualizar el token de operaciones
export const refreshTokenCookie = (uid, nombre, res)=>{
    const expiresIn=60*60*24*30;
    try {
        const refreshToken = jwt.sign({uid,nombre}, process.env.JWT_REFRESH, {expiresIn});
        res.cookie("refreshToken", refreshToken,{
            // httpOnly:true,
            // Secure: true,
            // expires: new Date(Date.now()+expiresIn*1000),
        });
        //return {refreshToken,expiresIn}
    } catch (error) {
        res.status(401).send({error:tokenVerificationErrors[error.message]});
    }
};

//genera token para confirmacion por email
export const registroToken=(email)=>{
    try {
        const token = jwt.sign({email}, process.env.JWT_SECRET);
        return token
    } catch (error) {
        console.log(error);
        res.status(401).send({error:tokenVerificationErrors[error.message]});

    }
};

//array de errores
export const tokenVerificationErrors = {
    "invalid signature": "La firma del JWT no es válida",
    "jwt expired": "JWT expirado",
    "invalid token": "Token no válido",
    "No Bearer": "Utiliza formato Bearer",
    "jwt malformed": "JWT formato no válido",
};

