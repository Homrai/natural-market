import { User } from "../../src/models/userModel.js"
import { envioCorreo } from "../../src/utils/enviarMail.js";
import { generateToken, refreshToken, registroToken } from "../../src/utils/tokenManage.js";


//recibe los datos para el registro del usuario
export const registroUsuario = async (req,res)=>{
    const {email, password, nombre, telefono, direccion} = req.body;
    try {
        const tokenConfirm = registroToken(email);
        const nuevoRegistro = new User({email, password, nombre, telefono, direccion, tokenConfirm});
        await nuevoRegistro.save();
        envioCorreo(email, tokenConfirm);
        return res.status(201).json({msj: "Revisa tu email y valida la cuenta", ok:true})
    } catch (error) {
         if (error.code === 11000) {
            return res.status(400).json({ msj: "Email ya en uso", ok:false });
        }
        return res.status(500).json({ msj: "Error de servidor" });
    }
};

//recibe el token enviado al correo del usuario para terminar el registro de la cuenta
export const confirmarUsuario= async (req,res)=>{
    try {
        const {token}= req.params;
        const user = await User.findOne({tokenConfirm: token});
        if(!user)
            return res.status(401).json({error: "Confirmacion Invalida, paso mucho tiempo"});
        
        user.tokenConfirm = null; 
        user.confirmarCuenta = true;
        await user.save();
        res.redirect(process.env.FRONT)        
    } catch (error) {
        console.log(error);
    }
};


//valida la existencia del usuario para que realice el login
export const loginUsuario= async (req,res)=>{
    const {email, password}=req.body;
    try {
        const user = await User.findOne({email});
        if (!user) 
            return res.status(400).json({error: "Datos incorrectos, intente de nuevo"})
        
        const asd = await user.comparePassword(password);

        if (!asd) {
            return res.status(400).json({error: "Datos incorrectos, intente de nuevo"})
        }
        if(!user.confirmarCuenta) 
            return res.status(400).json({error: "antes de continuar verifique su cuenta con el enlace enviado al email registrado"});
        const {token, expiresIn} = generateToken(user.id);
        refreshToken(user.id, user.nombre, res);
        res.status(201).json({token: token, nombre: user.nombre})
    } catch (error) {
        console.log(error);
    }
};

//limpia el token de la cookie para desloguear
export const logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ ok: true });
};


//despues de obtener el token por medio del refresh token entra aca para actializar los datos del usuario
export const refrescarUsuario = async (req,res)=>{
    try {
        const {id} =req.params;
        const user = await User.findById(id);
        const usuario={
            id: id,
            email: user.email,
            nombre: user.nombre,
            telefono: user.telefono,
            direccion: user.direccion,
            usuario: user.usuario,
        };
        res.status(201).json({usuario});
        
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"acceso denegado"});
    }
}
