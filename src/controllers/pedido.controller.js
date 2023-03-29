import axios from "axios";
import { Pedido } from "../models/pedidoModel.js";
import { Product } from "../models/productModel.js";

//al terminar la transaccion con mercado pago se redirige aca y trae los datos de la coleccion para buscar el estado de la transaccion
//esos datos ayudan a terminar el registro de los pedidos
export const recibirPedido = async (req,res)=>{
    try {
        const datos = req.query;
        let estadoURL ="";
        const url = `https://api.mercadopago.com/v1/payments/${datos.collection_id}`;
        const payment = await axios.get(url,{
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        const {data} =payment;
        const pedidoId = data.additional_info.items[0].id;
        const { status, status_detail, payment_method}=data;
        const pedidoOrden = await Pedido.findById(pedidoId);
        pedidoOrden.estadoCompra=status;
        pedidoOrden.detallesEstado=status_detail;
        pedidoOrden.tipoPago=payment_method.type;
        await pedidoOrden.save();
        if (status==="approved") {
            estadoURL="successpedido";
            const {itemsComprados} = pedidoOrden;
            itemsComprados.map( async (product)=>{
                const producto = await Product.findById(product.id);
                producto.cantidad = producto.cantidad-Number(product.cantidad);
                await producto.save();
            });
        }
        if (status==="rejected") {
            estadoURL="rejectedpedido";
        }
        if (status==="in_process") {
            estadoURL="pendingpedido";
        }
        res.status(301).redirect(process.env.FRONT+estadoURL);
    } catch (error) {
        console.log(error);
    }

    // return res.status(201).json({url:payment.data.init_point})
    
    //data.additional_info.items[0].id  obtener id de la respuesta
    //transaction_amount                valor transaccion
    //status                            estado
    //status_detail                     acreditado
    //datos.collection_id               id transaccion pedido
    //payment_method:                   metodo pago
    //    { id: 'master', type: 'credit_card' }
};


//despues de crear el objeto de consulta con los datos que necesita mercado pago entra aca para generar traer y reenviar el link para realizar el pago
export const rutaPayment = async (req,res)=>{
    try {
        const url = "https://api.mercadopago.com/checkout/preferences";
        const body = req.pedido;
        const payment = await axios.post(url,body,{
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        const {init_point} =payment.data;
        return res.status(201).json({url:init_point})
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:error})
    }
};

//cuando hay alguna actualizacion en el pago entra aca y trae los datos
//se hace la consulta de los datos de la transaccion en mercadopago y se actualizan la informacion del pedido
export const notificacion = async (req,res)=>{
    try {
        const datos = req.query;
        const url = `https://api.mercadopago.com/v1/payments/${datos.collection_id}`;
        const payment = await axios.get(url,{
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });
        const {data} =payment;
        const pedidoId = data.additional_info.items[0].id;
        const { status, status_detail} = data;
        const pedidoOrden = await Pedido.findById(pedidoId);
        pedidoOrden.estadoCompra=status;
        pedidoOrden.detallesEstado=status_detail;
        await pedidoOrden.save();
        if (status==="approved") {
            estadoURL="successpedido";
            const {itemsComprados} = pedidoOrden;
            itemsComprados.map( async (product)=>{
                const producto = await Product.findById(product.id);
                producto.cantidad = producto.cantidad-Number(product.cantidad);
                await producto.save();
            });
        }
    } catch (error) {
        console.log(error);
    }
};


//por medio del id se buscan y envian los pedidos del usuario que consulta
export const pedidoUsuario = async (req,res)=>{
    try {
        const {id}=req.params;
        const pedidos = await Pedido.find({uid:id});
        res.status(201).json({pedidos});
        
    } catch (error) {
        console.log(error); 
        res.status(400).json({error:error});       
    }
}


//busca todos los pedidos para uso del administrador
export const pedidoAdmin = async (req,res)=>{
    try {
        const pedidos = await Pedido.find();
        res.status(201).json({pedidos});
        
    } catch (error) {
        console.log(error); 
        res.status(400).json({error:error});       
    }
}

//trae el id del pedido para cambiar el estado de la entrega
export const marcarEntrega = async (req,res)=>{
    try {
        const {id}=req.params;
        const pedido = await Pedido.findById(id);
        pedido.entregado=true;
        await pedido.save();
        res.status(201).json({mensaje:`Se ha marcado como entregado el pedido con orden: ${id}`});
        
    } catch (error) {
        console.log(error); 
        res.status(400).json({error:"error al marcar la entrega del pedido"});       
    }
}