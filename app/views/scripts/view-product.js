const validation_info = JSON.parse(sessionStorage.getItem("user"));
if (!validation_info || validation_info.rol != "ADMIN") {
    window.location.href = 'index.html';
}

function loadProducts() {
    const id = sessionStorage.getItem("view-product");
    fetch(`http://localhost:8080/api/product/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Falla al buscar la lista de productos");
            }
            return res.json();
        })
        .then(res => {

            setTimeout(_ => {
                console.log(res);
                const infoProduct = document.getElementById("infoProduct");
                const imgProduct = document.getElementById("img-product");

                const img = document.createElement("img");
                const base64String = `data:image/jpeg;base64,${res.productImage}`; 
                img.className = "border rounded";
                img.style = "width: 100%";
                img.src = base64String;

                imgProduct.appendChild(img);

                while (infoProduct.firstChild) {
                    infoProduct.removeChild(infoProduct.firstChild);
                }
                const htmlString = `
                                    <h1 class="display-2">${res.name}</h1>
                                    <div class="d-flex gap-2">
                                        <h3><strong>Categoría:</strong></h3>
                                        <h3>${res.category}</h3>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <h2><strong>Precio:</strong></h2>
                                        <h2>${res.price}</h2>
                                    </div>
                                    <div class="d-flex gap-2">
                                        <h3><strong>Stock:</strong></h3>
                                        <h3>${res.availableQty}</h3>
                                    </div>
                                `;
                                console.log(res.name);
                loadCalifications(infoProduct, htmlString, id);
            }, 100);



        })
        .catch(err => {
            alert(err.message);
        });
}

async function loadCalifications(infoProduct, htmlString, id){
    fetch(`http://localhost:8080/api/calification/${id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Falla al buscar la lista de calificaciones");
            }
            return res.json();
        })
        .then(res => {
            if(res.length == 0){
                infoProduct.innerHTML = htmlString;
                return;
            }
            htmlString += `<div id="califications" class="row justify-content-around">`;
            for (let i = 0; i < res.length; i++) {
                htmlString += `
                        <div class="col-md-5 col-sm-12 my-2 border rounded p-2">
                            <h4><img src="./assets/img/star-icon.svg" alt="">${res[i].rate}/5</h4>
                            <p>${res[i].content}</p>
                        </div>
                `;
            }
            infoProduct.innerHTML = htmlString += "</div>";
        })
        .catch(err => {
            alert(err.message);
        });
}

function logout() {
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}

loadProducts();