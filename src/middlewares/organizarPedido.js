import { Pedido } from "../models/pedidoModel.js";

//trae los datos necesarios para crear el objeto de busqueda de mercadopago y generar la url del pago
//recibe la informacion para crear el pedido, junto a los datos del cliente, el total de la compra y fecha de entrega
export const organizarDatosPedido = async (req,res,next)=>{
    try {
        const {pedido, usuario,total,fechaEntrega} = req.body;
        delete usuario.usuario;
        delete usuario.token;
        const nuevoPedido = new Pedido({uid:usuario.uid,itemsComprados:pedido,informacionComprador:usuario,precioCompra:total,fechaEntrega: fechaEntrega});
        const pedidoGuardado= await nuevoPedido.save();
        const idPedidoGuardado = await pedidoGuardado.id;
        let itemsPedido = pedido.map((item)=>(
            {
                "id": item.id,
                "title": item.nombre,
                "description": item.descripcion,
                "currency_id": "ARS",
                "picture_url": item.imagen,
                "category_id":"cat123",
                "quantity": item.cantidad,
                "unit_price": item.precioUnidad
            }
        ));
        itemsPedido[0].id=idPedidoGuardado;
        const body ={
            "items": itemsPedido,
            "payer": {
                "name": "Test",
                "surname": "Test",
                "email": "test_user_1878633363@testuser.com",
            },
            "back_urls": {
                "success": "http://localhost:5000/pedido/success",
                "failure": "http://localhost:5000/pedido/failure",
                "pending": "http://localhost:5000/pedido/pending"
            },
            "auto_return": "approved",
            "notification_url": `${process.env.NOTIFICACIONES}pedido/ipn`,
        }
        req.pedido=body;
        next();
        
    } catch (error) {
        console.log(error);
    }
}
// "external_reference": "Reference_1234",
// "expires": true,
// "expiration_date_from": "2016-02-01T12:00:00.000-04:00",
// "expiration_date_to": "2016-02-28T12:00:00.000-04:00"
// const body ={
//     "items": itemsPedido,
//     "payer": {
//         "name": "Juan pepe",
//         "surname": "Luis",
//         "email": "test_user_1878633363@testuser.com",
//         "phone": {
//             "area_code": "57",
//             "number": "4444-4444"
//         },
//         "identification": {
//             "type": "DNI",
//             "number": "12345678"
//         },
//         "address": {
//             "street_name": "Street",
//             "street_number": 123,
//             "zip_code": "5700"
//         }
//     },
//     "back_urls": {
//         "success": "/success",
//         "failure": "/failure",
//         "pending": "/pending"
//     },
//     "auto_return": "approved",
//     "payment_methods": {
//         "excluded_payment_methods": [
//             {
//                 "id": "master"
//             }
//         ],
//         "excluded_payment_types": [
//             {
//                 "id": "ticket"
//             }
//         ],
//         "installments": 12
//     },
//     "notification_url": "http://localhost:5000/pedido/ipn",
//     "statement_descriptor": "tienda_veggie_vasu",
// }