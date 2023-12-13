let validPass = false;

async function createAccount() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("pass").value;

    if (!name || !surname || !email || !pass) {
        alert("Debe ingresar todos los campos antes de continuar");
        return;
    }

    if(!validPass){
        alert("Contraseña inválida");
        return;
    }

    const account = {
        firstname: name,
        lastname: surname,
        email: email,
        password: pass,
        rol: "USER"
    }

    const url = 'http://localhost:8080/api/user';

    try{
        await generarPeticionPost(url, account);
        alert("Cuenta creada con éxito");
        window.location.href = "index.html";
    }catch(err){
        alert("Internal Server Error");
    }
}

function validatePass(inputElement){
    var expresionRegular = /^(?=.*[A-Z]).{8}$/;
    const isValidPass = document.getElementById("isValidPass");
    if(expresionRegular.test(inputElement.value)){
        isValidPass.classList.add("d-none");
        validPass = true;
    }else{
        isValidPass.classList.remove("d-none");
        validPass = false;
    }
}


async function generarPeticionPost(url, body) {
    try {
        const options = {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), 
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.status);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        throw err;
    }
}