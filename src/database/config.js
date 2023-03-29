import mongoose from "mongoose";
//configuracion de la conexion a la base de datos
try {
    await mongoose.connect(process.env.DATABASE);
    console.log("conectado a la base de datos");    
} catch (error) {
    console.log(error);
}