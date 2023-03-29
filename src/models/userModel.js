import { Schema, model } from "mongoose";
import bcry from "bcryptjs";

const userSchema = new Schema({
    email:{
        type: String,
        require:true,
        trim: true,
        unique:true,
        lowercase:true,
    },
    password:{
        type: String,
        require:true,
    },
    nombre:{
        type: String,
        require:true,
        trim: true,
        lowercase:true,
    },
    telefono:{
        type: String,
        require:true,
        trim: true,
        lowercase:true,
    },
    direccion:{
        type: String,
        require:true,
        trim: true,
        lowercase:true,
    }, 
    usuario:{
        type: String,
        default:"user",
        require:true,
        trim: true,
        lowercase:true,
    }, 
    tokenConfirm:{
        type: String,
        default: null
    },
    confirmarCuenta:{
        type: Boolean,
        default: false,
    },
    myCustomTTLField: { type: Date, default: Date.now }
});

//genera una condicion para eliminar la cuenta si no se ha confirmado en 3 dias desde el email
userSchema.path("myCustomTTLField").index({
    expireAfterSeconds: 60*60*24*3,
    partialFilterExpression:{confirmarCuenta:false}}
);

//encripta el password
userSchema.pre("save", async function (next){
    const user = this;
    if (!user.isModified("password")) 
        return next();
        try {
            const salt = await bcry.genSalt(10);

            user.password = await bcry.hash(user.password, salt);
            next();
        } catch (error) {
            console.log(error);
        }

});

//metodo para confirmar el password encriptado
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcry.compare(candidatePassword, this.password);
};

export const User= model("User", userSchema);