import { body, param, validationResult } from "express-validator";

//validacion de errores de express validator
export const validationResultExpress = (req,res,next)=>{
    //console.log("entro a validacion");
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({error: errors.array()})
    }
    next();
}

//valida los datos del registro de usuario
export const userRegisterBodyValidator=[
    body("email", "formato Email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail()
        .notEmpty()
        .escape(),
    body("password", "Password error")
        .trim()
        .notEmpty()
        .escape(),
    body("nombre", "Nombre error")
        .trim()
        .notEmpty()
        .escape(),
    body("telefono", "Telefono error")
        .trim()
        .notEmpty()
        .escape(),
    body("direccion", "Direccion error")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress    
];

//valida los datos del login de usuario
export const loginBodyValidator=[
    body("email", "formato Email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail()
        .notEmpty()
        .escape(),
    body("password", "Password error")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress    
];

//valida los datos de edicion de usuario
export const editPerfilBodyValidator=[
    body("nombre", "Nombre error")
        .trim()
        .notEmpty()
        .escape(),
    body("telefono", "Telefono error")
        .trim()
        .notEmpty()
        .escape(),
    body("direccion", "Direccion error")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress    
];

//valida los datos del producto
export const productRegisterBodyValidator=[
    body("nombre", "formato nombre incorrecto")
        .trim()
        .notEmpty()
        .escape(),
    body("precio", "precio error")
        .trim()
        .notEmpty()
        .escape(),
    body("cantidad", "cantidad error")
        .trim()
        .notEmpty()
        .escape(),
    body("descripcion", "descripcion error")
        .trim()
        .notEmpty()
        .escape(),
    body('path', "imagenes error: array vacio o datos incorrectos")
        .isArray(),
    body('path.*', "imagenes error")
        .trim()
        .notEmpty()
        .blacklist("<>'"), 
    validationResultExpress  
];

//valida los datos del edicion del producto
export const productEditBodyValidator=[
    body("nombre", "formato nombre incorrecto")
        .trim()
        .notEmpty()
        .escape(),
    body("precio", "precio error")
        .trim()
        .notEmpty()
        .escape(),
    body("cantidad", "cantidad error")
        .trim()
        .notEmpty()
        .escape(),
    body("descripcion", "descripcion error")
        .trim()
        .notEmpty()
        .escape(),
    validationResultExpress  
];

//valida los parametros de consulta
export const validarParams=[
    param("id")
    .isMongoId()
    .escape(),
    validationResultExpress 
]