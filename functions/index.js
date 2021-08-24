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


//http callable function
exports.sayHello= functions.https.onCall((data, context)=> {
    const name= data.name;
    return `Hello ${name} from Cloud Functions -:)`;
});

//http callable function 2
exports.calculator= functions.https.onCall((data, context)=> {
    const number1= data.number1;
    const number2= data.number2;
    
    if(!isNaN(number1) && !isNaN(number2)){
        const suma= number1 + number2;
        
        return {
            number1,
            number2,
            suma
        }; 
    }
    else{
        return Promise.reject(new functions.https.HttpsError("invalid-argument", 'Revisa los datos enviados.'));
    }

});


//auth trigger (new user signup)

//Esta sera una authentication trigger function, ya no es una funcion https
//esto esta basado en cuando pasa algo con el usuario
//cuando un usuario sea creado se dispara el callback
//ese callback lleva como parametro el usuario creado
exports.newUserSignup= functions.auth.user().onCreate((user)=> {
    console.log("user ", user);
    console.log("user created ", user.email, user.uid);
});

//auth trigger (user deleted)
exports.userDeleted= functions.auth.user().onDelete((user)=> {
    console.log("user ", user);
    console.log("user deleted ", user.email, user.uid);
});