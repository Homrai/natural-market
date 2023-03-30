import { Router } from "express";
import { confirmarUsuario, loginUsuario, logout, refrescarUsuario, registroUsuario } from "../controllers/auth.controller.js";
import { loginBodyValidator, userRegisterBodyValidator, validarParams } from "../middlewares/validatorManage.js";
import { requireRefreshToken, requireToken } from "../middlewares/validatorToken.js";
const router = Router();

//post  /register           agrega usuario
//get   /confirmar/:token   trae el token del email para confirmar cuenta
//get   /refresh            refresca el el id y el token, por medio del refresh token guardado en la cookie
//get   /refreshdatos/:id   actualiza la informacion del usuario por medio del id y el token anterior

router.post("/register", userRegisterBodyValidator, registroUsuario);
router.post("/login", loginBodyValidator, loginUsuario);
router.get("/logout", logout)
router.get("/confirmar/:token", confirmarUsuario);
router.get("/refresh/:refreshtoken", requireRefreshToken);
router.get("/refreshdatos/:id",validarParams, requireToken, refrescarUsuario);



export default router;