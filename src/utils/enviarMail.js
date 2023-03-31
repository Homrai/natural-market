import { MailtrapClient } from "mailtrap"
//import { createTransport } from "nodemailer";

//envia el token para confirmar la cuenta al correo
// export const envioCorreo= async (email, tokenConfirm)=>{
//   try {
//       const transport = createTransport({
//           host: "smtp.gmail.com",
//           port: 465,
//           secure: true,
//           auth: {
//             user: process.env.nodeMailerUser,
//             pass: process.env.nodeMailerUser,
//           },
//         });

//         await transport.sendMail({
//           from: `confirmar cuenta <${process.env.nodeMailerUser}>`,
//           to: email,
//           subject:"Verifica tu cuenta",
//           html: `<p>Hola solo falta un ultimo paso para la creacion de tu cuenta, haz click en el enlace: </p> <a href="http://localhost:5000/auth/confirmar/${tokenConfirm}">Verifica tu cuenta, si no has sido tu porfavor ignora este mensaje.</a>`
//         });
    
//   } catch (error) {
//     console.log(error);
//   }
// };


export const envioCorreo= async (email, tokenConfirm)=>{
  try {
    const client = new MailtrapClient({ endpoint: process.env.ENDPOINT, token: process.env.MAILTAP_TOKEN });
    
    const sender = {
      email: "mailtrap@vasudevatiendaonline.shop",
      name: "Natural Market",
    };
    const recipients = [
      {
        email: email,
      }
    ];
    
    client
      .send({
        from: sender,
        to: recipients,
        subject: "Verifica tu cuenta",
        html:`<p>Hola solo falta un ultimo paso para la creacion de tu cuenta, haz click en el enlace: </p> <a href="http://localhost:5000/auth/confirmar/${tokenConfirm}">Verifica tu cuenta, si no has sido tu porfavor ignora este mensaje.</a>`,
      })
      .then(console.log, console.error);
    
  } catch (error) {
    console.log(error);
  }
};

