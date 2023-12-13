//Validación de Inicio de Sesión
const validation_info = JSON.parse(sessionStorage.getItem("user"));
if(!validation_info || validation_info.rol != "ADMIN"){
    window.location.href = 'index.html';
}

function logout(){
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}