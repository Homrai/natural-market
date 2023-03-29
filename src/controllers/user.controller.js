import { User } from "../../src/models/userModel.js";

//trae el id del usuario para poder enviar su informacion
export const showPerfil = async(req,res)=>{
    const {uid}=req;
    try {
        const user = await User.findById(uid).lean();
        const dataUser={
            id: uid,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            direccion: user.direccion,
            usuario: user.usuario,
        };
        res.status(201).json({dataUser})
    } catch (error) {
        console.log(error);
    }
};

//trae los datos del usuario para actualizarlos
export const editarPerfil = async(req,res)=>{
    const {uid}=req;
    const {nombre,telefono,direccion} = req.body;
    try {
        const user = await User.findById(uid);
        user.nombre=nombre;
        user.telefono=telefono;
        user.direccion=direccion;
        await user.save();
        const dataUser={
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            direccion: user.direccion,
            usuario: user.usuario,
        };
        res.status(201).json({dataUser})
    } catch (error) {
        console.log(error);
    }
};
