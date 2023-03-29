import { Router } from "express";
import { editarPerfil, showPerfil } from "../controllers/user.controller.js";
import { editPerfilBodyValidator } from "../middlewares/validatorManage.js";
import { requireToken } from "../middlewares/validatorToken.js";
const router= Router();

//get       /perfil         informacion del usuario
//put       /editarperfil   edita informacion del usuario

router.get("/perfil", requireToken, showPerfil);
router.put("/editarperfil", editPerfilBodyValidator, requireToken, editarPerfil);


export default router;