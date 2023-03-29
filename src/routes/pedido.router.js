import { Router } from "express";
import { marcarEntrega, notificacion, pedidoAdmin, pedidoUsuario, recibirPedido, rutaPayment } from "../controllers/pedido.controller.js";
import { organizarDatosPedido } from "../middlewares/organizarPedido.js";
import { validarAdmin } from "../middlewares/validatorAdmin.js";
import { validarParams } from "../middlewares/validatorManage.js";
import { requireToken } from "../middlewares/validatorToken.js";

const router= Router();

//post      /                   genera el link de pago
//get       /success            recibe informacion del estado de pago
//          /failure 
//          /pending
//get       /ipn                recibe informacion de las actualizaciones de los pagos
//get       /pedidouser/:id     envia los pedidos del usuario
//get       /pedidoadmin        envia todos los pedidos para administrar
//put       /pedidoadmin/:id    cambia el estado de entrega del pedido

router.post("/",requireToken, organizarDatosPedido, rutaPayment);
router.get("/success", recibirPedido);
router.get("/failure", recibirPedido);
router.get("/pending", recibirPedido);
router.get("/ipn", notificacion);
router.get("/pedidouser/:id",validarParams, requireToken,pedidoUsuario);
router.get("/pedidoadmin", requireToken,validarAdmin,pedidoAdmin);
router.put("/pedidoadmin/:id",validarParams, requireToken,validarAdmin,marcarEntrega);




export default router;