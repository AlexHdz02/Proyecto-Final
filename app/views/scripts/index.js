async function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const login = {
        email: email,
        password: pass
    }

    try {
        const res = await generarPeticionPost("http://localhost:8080/api/login", login);
        if(!res.token){
            alert(res.message);
        }else{
            debugger;
            sessionStorage.setItem("user", JSON.stringify(res.infoUser));
            window.location.href = res.infoUser.rol == "ADMIN"?"adminHome.html":"home.html";
        }
    }catch(err){
        alert(err);
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
        debugger;

        if (!response.ok) {
            throw new Error("Internal Server Error");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        throw err;
    }
}