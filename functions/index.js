const functions = require("firebase-functions");
const admin= require("firebase-admin"); //El SDK de admin es necesario para poder interactuar con firestore database dentro de nuestras cloud functions
admin.initializeApp();

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
//Con los triggers no retornamos nada al cliente porque no se esta haciendo peticion de nada

//Esta sera una authentication trigger function, ya no es una funcion https
//esto esta basado en cuando pasa algo con el usuario
//cuando un usuario sea creado se dispara el callback
//ese callback lleva como parametro el usuario creado
//para los backgroud  triggers se debe retornar un valor o promesa
exports.newUserSignup= functions.auth.user().onCreate((user)=> {
    //Si la coleccion o el documento no existen, firebase lo crea por nosotros
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        upVotedOn: []
    });
});

//auth trigger (user deleted)
exports.userDeleted= functions.auth.user().onDelete((user)=> {
    //Obtenemos la referencia del documento
    const doc= admin.firestore().collection('users').doc(user.uid);
    //Eliminamos el documento que corresponde al usuario y retornamos una promesa
    return doc.delete();
});


// http callable function (adding a request)
//context contiene informacion util para verificar si el usuario es autenticado
exports.addRequest= functions.https.onCall((data, context)=> {
    const text= data.text;
    
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'only authenticated user can add requests'
        );
    }

    if(text.length > 30){
        throw new functions.https.HttpsError(
            'invalid-argument',
            'request must be no more tha 30 characters long'
        );
    }

    admin.firestore().collection('requests').add({
        text,
        upvotes: 0,
    });
    return {
        msg: "Everythin OK"
    };
});


// upvote callable function
exports.upvote= functions.https.onCall(async(data, context)=> {
    
    //check auth state
    if(!context.auth){
        throw new functions.https.HttpsError(
            'unauthenticated',
            'only authenticated user can add requests'
        );
    }

    //get refs user doc and request doc
    const user= admin.firestore().collection('users').doc(context.auth.uid);
    const request= admin.firestore().collection('requests').doc(data.id);


    const doc= await user.get();
        
    //check user hasn't already upvoted the request
    if(doc.data().upVotedOn.includes(data.id)){
        throw new functions.https.HttpsError(
            'failed-precondition',
            'You can only upvote something once'
        );
    }

    //update upVotedOn array
    await user.update({
        upVotedOn: [...doc.data().upVotedOn, data.id]
    })

    //update votes on the request
    await request.update({
        upvotes: admin.firestore.FieldValue.increment(1)
    })
});


//firestore trigger for tracking activity
//para saber a que documento vamos a triggerear 
//     /users/{id}  -> vamos a triggerear todos los usuarios que se ingresen en el documento users
//     /requests/{id}  -> vamos a triggerear todos los request que se ingrese en el documento requests
//     /{document}/{id}  -> vamos a triggerear todos los camhios en firestore
exports.logActivity= functions.firestore.document('/{collection}/{id}').onCreate(async (snap, context)=> {
    console.log(snap.data());

    const collection= context.params.collection;
    const id= context.params.id;

    const activities= admin.firestore().collection('activities');

    if(collection === 'requests'){
        await activities.add({
            text: "a new tutorial request was added"
        });
    }

    if(collection === 'users'){
        await activities.add({
            text: "a new user signed up"
        });
    }
});