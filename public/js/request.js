var app = new Vue({//Instancia de Vue
    el: '#app',
    data: {
        requests: []
    },
    mounted() {
        const ref= firebase.firestore().collection('requests'); //Obetner la referencia a la coleccion requests
        
        //onSnapshot es una funcion que ejecuta un callback cada que ocurre un cambio en la coleccion
        //snapshot representa la coleccion con los datos ya actualizados
        ref.onSnapshot((snapshot)=> {
            let requests= [];
        
            snapshot.forEach((doc)=> {
                requests.push({...doc.data(), id: doc.id});
            });
            this.requests= requests;
        });
    },
})


