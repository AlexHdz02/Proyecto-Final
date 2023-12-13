//Validación de Inicio de Sesión
const validation_info = JSON.parse(sessionStorage.getItem("user"));
if (!validation_info || validation_info.rol != "USER") {
    window.location.href = 'index.html';
}

function logout() {
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}

async function loadProducts() {
    generarPeticionGet('http://localhost:8080/api/product')
        .then(res => {
            setTimeout(_ => {
                const productsContent = document.getElementById("cart-list");
                cleanProductsContent();
                const cartUser = JSON.parse(sessionStorage.getItem("userCart"));
                let chooseProducts = [];
                chooseProducts = cartUser.map(item => {
                    return res.find(product => product.id === item);
                });
                if(chooseProducts.length == 0){
                    alert("Carrito de compras vacío");
                    window.location.href = "home.html";
                }
                sessionStorage.setItem("chooseProducts", JSON.stringify(chooseProducts));


                chooseProducts.forEach(product => {
                    let productCard = document.createElement('div');
                    productCard.className = 'd-flex align-items-center row border rounded';
                    productCard.style = 'height: 7rem; max-height: 7rem; background-color: white;';
                    const base64String = `data:image/jpeg;base64,${product.productImage}`;

                    productCard.innerHTML = `<img class="col-4" src="${base64String}" style="height: 7rem; object-fit: cover;" alt="">\
                                    <h5 class="p-0 m-0 col-3">${product.name}</h5>\
                                    <input value="${product.choosen?product.choosen:1}" style="width: 100px;" class="form-control col-3" maxlength="4" onchange="recalculateCart(this, ${product.id}, ${product.availableQty})" oninput="sanitizeInput(this)" type="number">\
                                    <span onclick="deleteProductCart(${product.id})" class="col-1 delete-product-cart">&#x2717;</span>`;
                    productsContent.appendChild(productCard);
                });
                loadCardShopList(true);
            }, 50);
        })
        .catch();
}

async function deleteProductCart(id){
    const userCart = JSON.parse(sessionStorage.getItem("userCart"));
    const newListCart = userCart.filter(product => product != id);
    sessionStorage.setItem("userCart", JSON.stringify(newListCart));
    loadProducts();
}

async function loadPayment() {
    generarPeticionGet('http://localhost:8080/api/payment')
        .then(res => {
            setTimeout(_ => {
                const paymentContent = document.getElementById("payment-list");

                res.forEach(payment => {
                    let paymentItem = document.createElement('div');

                    paymentItem.innerHTML = `<input type="radio" id="option${payment.id}" name="choice" value="${payment.id}">\
                                        <label for="option${payment.id}">${payment.name}</label><br>`
                    paymentContent.appendChild(paymentItem);
                });

            }, 50);
        })
        .catch();
}

async function loadCardShopList(reset) {
    const cart = JSON.parse(sessionStorage.getItem("chooseProducts"));
    setTimeout(_ => {
        const cardShopList = document.getElementById("cardShopList");
        let total = 0;

        while (cardShopList.firstChild) {
            cardShopList.removeChild(cardShopList.firstChild);
        }

        cart.forEach(product => {
            let cardShopItem = document.createElement('div');
            cardShopItem.className = 'd-flex justify-content-between';

            cardShopItem.innerHTML = `<h5>${product.name}</h5>\
            <h5><strong>${product.choosen && !reset ? product.choosen : 1} x ${product.price}</strong></h5>`

            total += (product.choosen ? product.choosen : 1) * product.price;

            cardShopList.appendChild(cardShopItem);
        });

        const totalCart = document.getElementById("total-cart");
        const formatMx = total.toLocaleString("en", {
            style: "currency",
            currency: "MXN"
        });
        totalCart.textContent = formatMx;

    }, 50);

}

function recalculateCart(inputElement, id, quantity) {
    let inputValue = Number(inputElement.value);
    inputValue = inputValue < 1 ? 1 : inputValue;
    inputElement.value = inputValue;

    let userCart = JSON.parse(sessionStorage.getItem("chooseProducts")).map(item => {
        if (item.id === id) {
            if (inputValue <= quantity) {
                item['choosen'] = inputValue;
            } else {
                inputElement.value = quantity;
                alert(`Solo hay ${quantity} en stock`);
                item['choosen'] = quantity;
            }
        }
        return item;
    });
    sessionStorage.setItem("chooseProducts", JSON.stringify(userCart));
    loadCardShopList();
}


const sanitizeInput = (inputElement) => {
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/\D/g, '');
    inputElement.value = inputValue;
};

function cleanProductsContent() {
    const productsContent = document.getElementById("cart-list");
    while (productsContent.firstChild) {
        productsContent.removeChild(productsContent.firstChild);
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

function payCart(){
    let selectedOption = document.querySelector('input[name="choice"]:checked');
    if(!selectedOption){
        alert("Elija un método de pago");
        return;
    }
    const chooseProducts = JSON.parse(sessionStorage.getItem("chooseProducts"));
    chooseProducts.forEach(async product => {
        const body = {
            productId: product.id,
            toDecrement: product.choosen?product.choosen:1
        }
        await generarPeticionPost("http://localhost:8080/api/product/removeAvailable", body);
    });
    sessionStorage.removeItem("userCart");
    alert("Artículos pagados exitosamente");
    window.location.href = "home.html";
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

async function initView() {
    await loadProducts();
    await loadPayment();
}

initView();
