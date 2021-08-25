const ref= firebase.firestore().collection('requests'); //Obetner la referencia a la coleccion requests


//onSnapshot es una funcion que ejecuta un callback cada que ocurre un cambio en la coleccion
//snapshot representa la coleccion con los datos ya actualizados
ref.onSnapshot((snapshot)=> {
    let requests= [];

    snapshot.forEach((doc)=> {
        requests.push({...doc.data(), id: doc.id});
    });

    let html= ``;
    requests.forEach((request)=> {
        html += `<li>${request.text}</li>`;
    });

    document.querySelector('ul').innerHTML= html;
});