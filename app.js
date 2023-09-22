const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');
const mysql = require('mysql');
const express = require('express');
require('dotenv').config();


const port = process.env.PORT;

const app = express();

const SESSION_FILE_PATH = '/session.json';

let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)){
    sessionData = require(SESSION_FILE_PATH);
}



const client = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  },
  authStrategy: new LocalAuth({ clientId: "Client-one" }),
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2332.15.html'
  }
});




client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('authenticated', (session) => {
  console.log('listo estoy conectado');
  if (session){
    sessionData = session;
    
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
  }
});







let MSGbien = null; // inicia el Mensaje de bienvenida
let etapa = 0;
const registro = {}; // Registra los numeros telefono que inician al programa 
let numeroDocumento = '';

client.initialize();



 client.on('message', async (message) => {
   console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

   const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./media/${file}`)
    client.sendMessage(to, mediaFile)
  }



   if (message.body === 'holahjj'){
    client.sendMessage(message.from, '*Clínica Medsalud: Innovación en Cuidado Visual y Ocular* /n En Clínica Medsalud, transformamos vidas a través de la visión brillante. Nuestros procedimientos líderes en el cuidado de los ojos garantizan una vida más brillante. ¡Cotice su procedimiento aquí y descubra la diferencia! /n  /n Clic aquí para cotización: https://medsaludips.com/servicios-particulares/ ,')
    sendMedia(message.from, 'image.jpg')
    setTimeout(() => {
      delete registro[message.from];
    }, 5 * 1000000);
  
    }



  //  Esta linea de codigo envie el mensaje para llevar al whatsapp de citas y se reinicia a los 5 segundos 
   if (message.body === '2'){
    client.sendMessage(message.from, 'En un momento sera atendido por un asesor. gracias por elegirnos wwww.creativocode.com')
    setTimeout(() => {
      delete registro[message.from];
    }, 5 * 1000000);
  
    }

// Este codigo verifica que ya se envio el mensaje de bienvenida
  if (!registro[message.from]) { 
    client.sendMessage(message.from, 'Potencie su negocio con nuestros Bots de WhatsApp: mensajería masiva, asesoría virtual, marketing efectivo y recordatorios automáticos para sus clientes. ¡Transforme su comunicación hoy mismo con nosotros! \n \n 1️⃣ Cotización Bot de WhatsaApp \n\n 2️⃣ Soporte Tecnico');
  

    registro[message.from] = { etapa: 0, numeroDocumento: '' };
    // registro[message.from] = true; // Register the phone number
    return;
  }

  if (MSGbien !== null) { // Check if MSGbien exists
    client.sendMessage(message.from, MSGbien);
    MSGbien = null; // Reset to a falsy value after sending
  } else {
    console.log('Error al verificar el mensaje de bienvenida');
  }

  setTimeout(() => {
    delete registro[message.from];
  }, 150 * 100000);

  


  switch (registro[message.from].etapa) {

  

    case 0:
      if (message.body === '1') {
        // Preguntar por el número de documento
        client.sendMessage(message.from, 'Por favor, indique el nombre de su empresa y el servicio que le interesa. \n \n Mensajeria masiva  \n \n Bot de WhatsApp \n \n Ventas por WhatsApp. ');
        registro[message.from].etapa = 1;
      }
      break;
}

});


app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
