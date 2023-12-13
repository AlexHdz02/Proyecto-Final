//Validación de Inicio de Sesión
const validation_info = JSON.parse(sessionStorage.getItem("user"));
if (!validation_info || validation_info.rol != "USER") {
    window.location.href = 'index.html';
}

let ratedProductId = -1;

function logout() {
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}

async function loadProducts(dfault) {
    let category = document.getElementById("byCategory");
    let name = document.getElementById("byName");

    if (!dfault && (category || name)) {
        const filter = {
            category: category.value,
            name: name.value
        }
        generarPeticionPost('http://localhost:8080/api/product/filter', filter)
            .then(res => {
                setTimeout(_ => {
                    const productsContent = document.getElementById("products-content");
                    cleanProductsContent();
                    res.forEach(product => {
                        let productCard = document.createElement('div');
                        productCard.className = 'card p-0';
                        productCard.style.width = '18rem';
                        const base64String = `data:image/jpeg;base64,${product.productImage}`;

                        productCard.innerHTML = `
                            <img data-bs-toggle="modal" data-bs-target="#modalRate" style="cursor: pointer" onclick="showRates(${product.id})" src="${base64String}" class="card-img-top" alt="">
                            <div class="card-body">
                                <div class="row">
                                    <h4 class="card-title col-10">${product.name}</h4>
                                    <h4>&hearts;</h4>
                                    <h5 class="col-10">$ ${product.price}</h5>
                                </div>
                                <div class="row gap-2">
                                <button onclick="rateProduct(${product.id}, '${product.name}')" type="button" class="btn btn-outline-warning col-md-12 col-sm-12" data-bs-toggle="modal" data-bs-target="#exampleModal">Calificar</button>
                                    <a href="#" onclick="addToCart(${product.id})" class="btn btn-primary col-md-12 col-sm-12">Agregar</a>
                                </div>
                            </div>
                        `;
                        productsContent.appendChild(productCard);
                    });

                }, 50);
            })
            .catch();
    } else {
        if (dfault) {
            category.value = "";
            name.value = "";
        }
        generarPeticionGet('http://localhost:8080/api/product')
            .then(res => {
                setTimeout(_ => {
                    const productsContent = document.getElementById("products-content");
                    cleanProductsContent();
                    res.forEach(product => {
                        let productCard = document.createElement('div');
                        productCard.className = 'card p-0';
                        productCard.style.width = '18rem';
                        const base64String = `data:image/jpeg;base64,${product.productImage}`;

                        productCard.innerHTML = `
                            <img data-bs-toggle="modal" data-bs-target="#modalRate" style="cursor: pointer" onclick="showRates(${product.id})" src="${base64String}" class="card-img-top" alt="">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <h4 class="card-title col-10">${product.name}</h4>
                                    <h4 onclick="addFavorite(${product.id})" class="col-2 click-heart">&hearts;</h4>
                                    <h5 class="col-10">$ ${product.price}</h5>
                                    <h4 onclick="rateProduct(${product.id}, '${product.name}')" data-bs-toggle="modal" data-bs-target="#exampleModal" class="col-2 click-star">&#9733;</h4>
                                </div>
                                <a href="#" onclick="addToCart(${product.id})" class="btn btn-primary col-md-12 col-sm-12">Agregar</a>
                            </div>
                        `;
                        productsContent.appendChild(productCard);
                    });
                }, 50);
            })
            .catch();
    }
}

async function addFavorite(id){
    const body = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        productId: id
    }
    try{
        const resFavorite = await generarPeticionPost("http://localhost:8080/api/favorite", body);
        if(resFavorite.id){
            alert("Producto agregado exitosamente a la lista de favoritos");
        }
    }catch(err){
        alert("El producto ya esta agregado a la lista de favoritos");
    }

}

async function showRates(id){
    const res = await generarPeticionGet(`http://localhost:8080/api/calification/${id}`);
    if(res.length > 0){
        const modalrate = document.getElementById("modalrate-body");

        while(modalrate.firstChild){
            modalrate.removeChild(modalrate.firstChild);
        }

        let htmlString = '';
        htmlString += `<div id="califications" class="row justify-content-around">`;
        for (let i = 0; i < res.length; i++) {
            htmlString += `
                    <div class="col-md-5 col-sm-12 my-2 border rounded p-2">
                        <h4><img src="./assets/img/star-icon.svg" alt="">${res[i].rate}/5</h4>
                        <p>${res[i].content}</p>
                    </div>
            `;
        }
        modalrate.innerHTML = htmlString += "</div>";
    }
}

async function favoriteList(){
    const id = JSON.parse(sessionStorage.getItem("user")).id;
    const resFavorites = await generarPeticionGet(`http://localhost:8080/api/favorite/${id}`);
    
    const modalfavorite = document.getElementById("modalfavorite-body");

    while(modalfavorite.firstChild){
        modalfavorite.removeChild(modalfavorite.firstChild);
    }

    if(resFavorites.length > 0){
        let htmlString = '';
        for (let i = 0; i < resFavorites.length; i++) {
            const base64String = `data:image/jpeg;base64,${resFavorites[i].Product.productImage}`;
            htmlString += `
            <div style="background-color: white;" class="align-items-center row w-100 border rounded p-2 justify-content-between">
                <img class="col-3" src="${base64String}" alt="">
                <h6 class="m-0 p-0 col-5">${resFavorites[i].Product.name}</h6>
                <button onclick="addToCart(${resFavorites[i].Product.id})" class="btn col-2"><img style="width: 30px" src="./assets/img/add-cart-icon.svg"></button>
                <button onclick="removeFavorite(${resFavorites[i].id})" class="btn col-2"><img style="width: 30px" src="./assets/img/trash-icon.svg"></button>
            </div>
            `;
        }
        modalfavorite.innerHTML = htmlString;
    }else{
        modalfavorite.innerHTML = "<h6 class='text-danger'>Lista Vacía, puede agregar productos presionando en el ícono del corazón</h6>";
    }
}

async function removeFavorite(id){
    const resRemove = await generarPeticionDelete(`http://localhost:8080/api/favorite/${id}`);
    if(resRemove.message == "Destroy favorite successfully!"){
        favoriteList();
    }else{
        alert("Error al eliminar favorito");
    }
}

function rateProduct(id, name) {
    const titleRateProduct = document.getElementById("titleRateProduct");
    titleRateProduct.textContent = name;
    ratedProductId = id;
}

function cleanProductsContent() {
    const productsContent = document.getElementById("products-content");
    while (productsContent.firstChild) {
        productsContent.removeChild(productsContent.firstChild);
    }
}

function toCartShop() {
    const cart = JSON.parse(sessionStorage.getItem("userCart"));
    if (cart) {
        window.location.href = "cart-products.html";
    } else {
        alert("El carrito de compras está vacío");
    }
}

function addToCart(id) {
    let userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    if (!userCart.includes(id)) {
        userCart.push(id);
        sessionStorage.setItem("userCart", JSON.stringify(userCart));
        calulateCartLength();
        alert("Producto añadido exitosamente al carrito");
    }
}

async function sendRate() {
    try {
        const averageRating = Number(document.getElementById('average-rating').textContent);
        const contentRate = document.getElementById('contentRate');

        if (!averageRating || averageRating == 0 || !contentRate.value) {
            alert("Por favor, llene la información de la calificación");
            return;
        }

        const body = {
            content: contentRate.value,
            rate: averageRating,
            productId: ratedProductId
        }

        const res = await generarPeticionPost('http://localhost:8080/api/calification', body);
        if (res.id) {
            alert("Calificación enviada con éxito");
            contentRate.value = "";
            document.querySelector('[data-bs-dismiss="modal"]').click();
            ratedProductId = -1;
        } else {
            alert("Error al enviar la calificación, intentelo nuevamente");
        }

    } catch (err) {
        alert("Error al enviar la calificación");
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

async function generarPeticionGet(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error en la solicitud: " + response.status);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        throw err;
    }
}

async function generarPeticionDelete(url) {
    try {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
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

function calulateCartLength() {
    setTimeout(_ => {
        const cartLength = document.getElementById("cartLength");
        const userCart = JSON.parse(sessionStorage.getItem("userCart"));
        cartLength.textContent = userCart ? userCart.length : 0;

    }, 50);
}

loadProducts();
calulateCartLength();

setTimeout(_ => {
    const stars = document.querySelectorAll('.star');
    const averageRating = document.getElementById('average-rating');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            stars.forEach(removeStyle => {
                removeStyle.classList.remove("selectedStar");
            });
            const rate = parseInt(star.getAttribute('data-value'));
            averageRating.textContent = rate;
            for (let i = 0; i < rate; i++) {
                stars[i].classList.add("selectedStar");

            }

        });
    });
}, 50);

