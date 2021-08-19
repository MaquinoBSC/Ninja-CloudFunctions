const functions = require("firebase-functions");

// Http request 1
//endpoint request kind of cloud functions


//exports es usado porque vamos a exportar esta fincion
//randonNumber es el nombre de la funcion
//functions es la importacion de arriba
//https es el tipo de funcion que estamos creando
//onRequest es porque estamos creando un endpoint request
//request tiene la informacion sobre la peticion
//reponse es la respuesta que se manda al cliente
exports.randonNumber= functions.https.onRequest((request, response)=> {
    const number= Math.round(Math.random() * 100);
    console.log(number);
    console.log("martin");
    response.send(number.toString());
});

//Http request 2
exports.toTheDojo= functions.https.onRequest((request, response)=> {
    response.redirect('https://www.thenetninja.co.uk');
});