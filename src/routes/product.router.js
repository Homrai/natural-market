import { Router } from "express";
import { agregarProducto, borrarProducto, editarProducto, showProductos } from "../controllers/product.controller.js";
import { agregarImagenes } from "../middlewares/subirImagenes.js";
import { validarAdmin } from "../middlewares/validatorAdmin.js";
import { productEditBodyValidator, productRegisterBodyValidator, validarParams } from "../middlewares/validatorManage.js";
import { requireToken } from "../middlewares/validatorToken.js";
const router = Router();

//get       /       envia todos los productos
//post      /add    agrega producto
//put       /edit   edita producto
//delete    /delete elimina producto


router.get("/", showProductos);
router.post("/add", productRegisterBodyValidator,  requireToken, validarAdmin,agregarImagenes, agregarProducto);
router.put("/edit", productEditBodyValidator,  requireToken, validarAdmin, editarProducto);
router.delete("/borrar/:id",validarParams, requireToken, validarAdmin, borrarProducto);


export default router;