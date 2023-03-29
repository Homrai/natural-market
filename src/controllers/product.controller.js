import { Product } from "../../src/models/productModel.js";
import { eliminarImagenProducto } from "../firebase/config.js";

//el admin trae los datos para hacer el registro del producto tanto en la coleccion de mongo como las imagenes en firebase
export const agregarProducto= async (req,res)=>{
    try {
        const {producto} = req.body;
        await producto.save();
        return res.status(201).json({msj:"Producto agregado con exito", ok:true, producto })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msj: "Producto ya existente, cambie el nombre", ok:false });
        }
        return res.status(500).json({ msj: "Problema del servidor", ok:false });
    }
};

//se envia la informacion de todos los productos para actualizar la tienda
export const showProductos= async (req,res)=>{
    try {
        const productos = await Product.find();
        res.status(201).json({productos});     
    } catch (error) {
       console.log(error); 
       res.status(401).json({error: error.message});     
    }
}

//por medio del id se elimina tanto la informacion de la coleccion del producto en mongo como las imagenes almacenadas en firebase
export const borrarProducto= async (req,res)=>{
    try {
        const {id} = req.params;
        const producto = await Product.findByIdAndDelete(id);
        await eliminarImagenProducto(id,producto.imagenes.length);
        return res.status(201).json({msj:"Producto eliminado con exito", ok:true })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ msj: "El producto no se pudo eliminar", ok:false });
        }
        return res.status(500).json({ msj: "Problema del servidor", ok:false });
    }
};

//trae los datos para cambiar la informacion de la coleccion del producto por medio del id
export const editarProducto= async (req,res)=>{
    try {
        const {_id,nombre, precio, cantidad, descripcion} = req.body;
        const nuevoProducto = await Product.findById(_id);
        nuevoProducto.nombre=nombre;
        nuevoProducto.precio=precio;
        nuevoProducto.cantidad=cantidad;
        nuevoProducto.descripcion=descripcion;
        await nuevoProducto.save();
        return res.status(201).json({msj:"Producto editado con exito", ok:true })
    } catch (error) {
        return res.status(500).json({ msj: "Problema del servidor", ok:false });
    }
};