const express = require("express");
const app = express();
const WebsocketServer = require("ws").Server;
const models = require('../backend/models');

var gradosServo

var valorSensor
const mqtt = require('mqtt')
const cliente = mqtt.connect("mqtt://192.168.1.104")

cliente.on('connect', function(){
  cliente.subscribe('sensor')
  
})

cliente.on('message', function(tema, dato){
  console.log(dato.toString())
  valorSensor = dato.toString();
})

/**Websocket**/
let ws_server = new WebsocketServer({ port: 40150 });

            
ws_server.on("connection", function (ws, req) {
  console.log("Cliente conectado: ", req.socket.remoteAddress);
  const data =
            {
                type: "sensor",
                data: valorSensor,
            };
            ws.send(JSON.stringify(data));
  //  Mensajes
  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    console.log(msg.data);
    switch(msg.type) {
      case 'servo': cliente.publish('servo', msg.data.toString());
                  break;
      case 'guardar': insertarDatos(valorSensor); break;
    }
    
  });
});

/**Servidor**/
app.listen(8080, () => {
  console.log("Servidor en: 8080");
});
app.use(express.static("public"));
//  Ruteo
app.use((req, res) => {
  res.sendFile("C:/Users/gio_o/OneDrive/Desktop/proyectoFinal/frontend/frontend.html");
});


//  Function para recibir del Cliente html
function actualizarLED(value) {
  ws_server.clients.forEach((client) => {
    const data = {
      type: "led",
      data: value,
    };
    client.send(JSON.stringify(data));
    console.log("Send message: ", JSON.stringify(data));
  });
}

async function insertarDatos(valor)
{
  await models.sensor.create({
    valor: valor
  });
}

setInterval(() => {
  ws_server.clients.forEach((client) => {
    client.send(JSON.stringify(valorSensor));
  });
});