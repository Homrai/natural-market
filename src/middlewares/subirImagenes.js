import { getUrlProducto, productoExist, subirImagenProducto } from "../firebase/config.js";
import { Product } from "../models/productModel.js";

//se crea el nuevo producto, consulta si ya existe el producto, envia la informacion para traer la url de las imagenes, las almacena en un array
//se agrega el array al modelo del producto y se envia al controlador para guardarlo
export const agregarImagenes=async (req,res,next)=>{
    try {
        const {nombre, precio, cantidad, descripcion, path} = req.body;
        let nuevoProducto = new Product({nombre, precio, cantidad, descripcion});
        let imagenes=[];
        const respuesta = await productoExist(nuevoProducto._id);
        if (respuesta) 
            return res.status(401).json({msj:"El nombre del producto ya esta en uso, porfavor cambielo", ok: false})
        
        path.map(async (item, index)=>{
            const resImagen = await subirImagenProducto(item,nuevoProducto._id, index);
            await getUrlProducto(resImagen.metadata.fullPath).then((res)=>imagenes.push(res));
            if (path.length===imagenes.length) {
                nuevoProducto.imagenes=imagenes;
                req.body.producto=nuevoProducto;
                next();
            }
        }); 
    } catch (error) {
        console.log(error.code);
        res.status(401).json({msj:"El nombre del producto ya esta en uso, porfavor cambielo", ok: false})
    }
}