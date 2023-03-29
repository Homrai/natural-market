import { model, Schema } from "mongoose";

const productSchema= new Schema({
    nombre:{
        type: String,
        require:true,
        trim: true,
        unique:true,
        lowercase:true,
    },
    precio:{
        type: Number,
        require:true,
        trim: true,
    },
    cantidad:{
        type: Number,
        require:true,
        trim: true,
    },
    descripcion:{
        type: String,
        require:true,
        trim: true,
        lowercase:true,
    },
    imagenes:{
        type: Array,
        require:true,
        default:[],
    },
});

export const Product = model("Product", productSchema);