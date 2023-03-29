import { User } from "../models/userModel.js";

//por medio del id verifica los permisos del usuario como administrador para realizar operaciones
export const validarAdmin= async (req,res,next)=>{
    try {
        const {uid} = req;
        const user = await User.findById(uid);
        if(user.usuario!=="Administrador")
            return res.status(401).json({error: "Usuario no autorizado"});
        next();
    } catch (error) {
        console.log(error);
    }
}