import { initializeApp } from "firebase/app";
import { deleteObject, getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";


//se genera la configuracion del proyecto en firebase
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

//trae la data_url, el id y el index de las imagenes subidas para generar la metadata
export const subirImagenProducto =async(imagen,nombre,index)=>{
    try {
        const imageRef = ref(storage,`imagesProductos/${nombre}/img_${index}`);
        const resUpload = await uploadString(imageRef,imagen,'data_url');
        return resUpload
    } catch (error) {
        console.log(error);
    }
};

//recibe la direccion del metadata para generar el url donde se almacena la imagen y devolverla
export const getUrlProducto=async (path)=>{
    try {
        const imgRef = ref(storage, path);
        const url = await getDownloadURL(imgRef);
        return url
    } catch (error) {
        console.log(error);
    }
};

//valida la existencia del producto en firebase, recibe el id
export const productoExist= async (nombre)=>{
    try {
        const imgRef = ref(storage, `imagesProductos/${nombre}/img_0`);
        await getDownloadURL(imgRef);
        return true
    } catch (error) {
        if (error.code==="storage/object-not-found") {
            return false
        }
    }
};

//elimina las imagenes del producto en firebase, recibe el id y el tamaño del array de imagenes
export const eliminarImagenProducto =async(nombre,tam)=>{
    try {
        for (let index = 1; index <= tam; index++) {
            const imageRef = ref(storage,`imagesProductos/${nombre}/img_${index-1}`);
            await deleteObject(imageRef);      
        }
        return
    } catch (error) {
        console.log(error);
    }
};