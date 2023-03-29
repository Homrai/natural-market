import { model, Schema } from "mongoose";

const pedidoSchema= new Schema({
    uid:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    itemsComprados:{
        type: Array,
        require: true,
    },
    estadoCompra:{
        type:String,
        require:true,
        default:null,
        lowercase:true,
    },
    detallesEstado:{
        type:String,
        require:true,
        default:null,
        lowercase:true,
    },
    informacionComprador:{
        type:Object,
        require:true,
    },
    precioCompra:{
        type:Number,
        require:true,
    },
    tipoPago:{
        type: String,
        require:true,
        default:null
    },
    fechaEntrega:{
        type:Object,
        require:true
    },
    fechaCreacion:{
        type: Date,
        require:true,
        default: Date.now,
    },
    entregado:{
        type: Boolean,
        require:true,
        default: false,
    },
});
//crea una condicion para eliminar la coleccion despues de 1 hora si no se ha confirmado el estado de la compra
pedidoSchema.path("fechaCreacion").index({
    expireAfterSeconds: 60*60,
    partialFilterExpression:{estadoCompra: null}})

export const Pedido = model("Pedido", pedidoSchema);