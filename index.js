import "dotenv/config";
import "./src/database/config.js";
import express from "express";
import authRouter from "./src/routes/auth.router.js";
import userRouter from "./src/routes/user.router.js";
import productRouter from "./src/routes/product.router.js";
import pedidoRouter from "./src/routes/pedido.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;
const whiteList=[process.env.ORIGIN1,process.env.ORIGIN2];
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
app.use(
    cors({
        origin:(origin, callback)=>{
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin)
            }
            return callback("Protegido por CORS :"+ origin + "No autorizado!")
        },
        credentials:true,
        optionSuccessStatus:200,
    })
);
app.use(cookieParser());
app.use(express.json({limit: '55mb'}));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/pedido", pedidoRouter);

app.listen(PORT, ()=>{
    console.log("puerto iniciado");
})
