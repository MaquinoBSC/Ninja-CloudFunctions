const requestModal= document.querySelector('.new-request');
const requestLink= document.querySelector('.add-request');
const requestForm= document.querySelector('.new-request form');


//open request modal
requestLink.addEventListener('click', ()=> {
    requestModal.classList.add('open');
});

//close request modal
requestModal.addEventListener('click', (e)=> {
    if(e.target.classList.contains('new-request')){
        requestModal.classList.remove('open');
    }
});


//add new request
requestForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    const addRequest= firebase.functions().httpsCallable('addRequest');
    addRequest({
        text: requestForm.request.value,
    })
        .then(()=> {
            requestForm.reset();
            requestModal.classList.remove('open');
            requestForm.querySelector('.error').textContent= '';
        })
        .catch((error)=> {
            requestForm.querySelector('.error').textContent= error.message;
        })
})


//sayHello function call
const button= document.querySelector('.call');
button.addEventListener('click', ()=> {
    //get function reference
    //Podemos acceder a firebase porque importamos e SDK en el index
    //Y podemos acceder a function por que tambien impoprtamos el feature en el index
    //httpsCallable es para especificar que tipo de funcion estamos haciendo referencia
    const sayHello= firebase.functions().httpsCallable('sayHello');
    sayHello({name: "Maquino"})
        .then((result)=> {
            console.log(result.data);
        })
})

//probar una callable function para hacer calculos
const sumaButton= document.querySelector('.suma');
sumaButton.addEventListener('click', ()=> {
    const suma= firebase.functions().httpsCallable('calculator');
    suma({number1: 56, number2: 45})
        .then((result)=> {
            console.log(result.data);
        })
        .catch((erro)=> {
            console.log(erro.data);
        })
});