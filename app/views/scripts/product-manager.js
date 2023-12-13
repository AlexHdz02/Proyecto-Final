const validation_info = JSON.parse(sessionStorage.getItem("user"));
if (!validation_info || validation_info.rol != "ADMIN") {
    window.location.href = 'index.html';
}

let productUpdateId = -1;

function loadProducts() {
    fetch('http://localhost:8080/api/product')
        .then(res => {
            if (!res.ok) {
                throw new Error("Falla al buscar la lista de productos");
            }
            return res.json();
        })
        .then(res => {
            setTimeout(_ => {
                const tbody = document.getElementById("tbody");

                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }

                for (let i = 0; i < res.length; i++) {
                    const tr = document.createElement('tr');
                    tr.className = 'align-middle';

                    const tdView = document.createElement('td');
                    tdView.className = "text-center align-middle";
                    tdView.style.width = "30px";

                    const btnView = document.createElement('button');
                    const viewIcon = document.createElement('img');
                    viewIcon.src = './assets/img/eye-icon.svg';
                    viewIcon.style.height = '30px';
                    viewIcon.style.filter = 'invert(1)';

                    btnView.className = 'btn btn-dark';
                    btnView.onclick = _ => {
                        showProduct(res[i].id);
                    }

                    btnView.appendChild(viewIcon);
                    tdView.appendChild(btnView);

                    const tdEdit = document.createElement('td');
                    tdEdit.className = "text-center align-middle";
                    tdEdit.style.width = "30px";

                    const btnEdit = document.createElement('button');
                    const editIcon = document.createElement('img');
                    editIcon.src = './assets/img/edit-icon.svg';
                    editIcon.style.height = '30px';
                    editIcon.style.filter = 'invert(1)';

                    btnEdit.className = 'btn';
                    btnEdit.onclick = _ => {
                        editProduct(res[i]);
                    }

                    btnEdit.appendChild(editIcon);
                    tdEdit.appendChild(btnEdit);

                    const tdName = document.createElement('td');
                    tdName.textContent = res[i].name;

                    const tdCategory = document.createElement('td');
                    tdCategory.textContent = res[i].category;

                    const tdPrice = document.createElement('td');
                    tdPrice.textContent = res[i].price;

                    const trAvailable = document.createElement('td');
                    trAvailable.textContent = res[i].availableQty;

                    const trDelete = document.createElement('td');
                    const btnDelete = document.createElement('button');
                    const trashicon = document.createElement('img');
                    trashicon.src = './assets/img/trash-icon.svg';
                    trashicon.style.height = '30px';
                    trashicon.style.filter = 'invert(1)';

                    btnDelete.className = 'btn btn-dark';
                    btnDelete.onclick = _ => {
                        deleteProduct(res[i].id);
                    }

                    btnDelete.appendChild(trashicon);
                    trDelete.appendChild(btnDelete);

                    tr.appendChild(tdView);
                    tr.appendChild(tdEdit);
                    tr.appendChild(tdName);
                    tr.appendChild(tdCategory);
                    tr.appendChild(tdPrice);
                    tr.appendChild(trAvailable);
                    tr.appendChild(trDelete);

                    tbody.appendChild(tr);
                }
            }, 100);



        })
        .catch(err => {
            alert(err.message);
        });
}

function editProduct(product) {
    changeView(0);
    setEditValues(product);
}

function setEditValues(product) {
    var nameInput = document.getElementById("name");
    var categorySelect = document.getElementById("category");
    var priceInput = document.getElementById("price");
    var quantityInput = document.getElementById("quantity");

    nameInput.value = product.name;
    categorySelect.value = product.category;
    priceInput.value = product.price;
    quantityInput.value = product.availableQty;
    productUpdateId = product.id;
}

async function showProduct(id) {
    sessionStorage.setItem("view-product", id);
    window.location.href = "view-product.html";
}

async function deleteProduct(id) {
    resRemove = await generarPeticionDelete(`http://localhost:8080/api/product/${id}`);
    if (resRemove.status === 200) {
        loadProducts();
    } else {
        alert(`Error al eliminar el producto con id: ${id}`);
    }
    console.log(resRemove);
}


async function generarPeticionDelete(url, body) {
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

function changeView(option, view) {
    try {
        const table = document.getElementById("table");
        table.classList.add('d-none');

        const showTable = document.getElementById("showTable");
        showTable.classList.add('d-none');

        const creation = document.getElementById("creation");
        creation.classList.add('d-none');

        const createBtn = document.getElementById("createBtn");
        createBtn.classList.add('d-none');

        switch (option) {
            case 0:
                creation.classList.remove('d-none');
                createBtn.classList.add('d-none');
                showTable.classList.remove('d-none');
                break;
            case 1:
                table.classList.remove('d-none');
                showTable.classList.add('d-none');
                createBtn.classList.remove('d-none');
                break;
        }
        const sendProduct = document.getElementById("sendProduct");
        const updateProduct = document.getElementById("updateProduct");
        if(view){
            sendProduct.classList.remove("d-none");
            updateProduct.classList.add("d-none");
        }else{
            sendProduct.classList.add("d-none");
            updateProduct.classList.remove("d-none");
        }
    } catch (err) { }
}

function handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const selectedFile = imageInput.files[0];

    if (selectedFile) {
        if (selectedFile.size >= 1024 * 1024) {
            alert('La imagen es demasiado grande. El tamaño máximo permitido es 1 MB.');
            imageInput.value = '';
        }
    }
}

async function updateProduct(){
    try {
        const name = document.getElementById('name').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;


        if (!name || !category || !price || !quantity) {
            alert('Complete todos los campos');
            return;
        }

        let body = {
            name: name,
            category: category,
            price: price,
            availableQty: quantity
        }

        const imageInput = document.getElementById('imageInput');
        const selectedFile = imageInput.files[0];
        if(selectedFile){
            const base64Data = await fileToBase64(selectedFile);
            body['productImage'] = base64Data;
        }

        const res = await generarPeticionPut(`http://localhost:8080/api/product/${productUpdateId}`, body);
        if (res.message == "Product updated succesfully") {
            changeView(1);
            loadProducts();
            document.getElementById('name').value = '';
            document.getElementById('category').value = '';
            document.getElementById('price').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('imageInput').value = '';
            productUpdateId = -1;
            alert("Producto Modificado Exitosamente");
        } else {
            throw new Error("Error al crear el producto, por favor, vuelva a intentarlo.");
        }
    } catch (err) {
        alert(err.message);
        return;
    }
}

async function sendProduct() {
    try {
        const name = document.getElementById('name').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const imageInput = document.getElementById('imageInput');
        const selectedFile = imageInput.files[0];

        if (!name || !category || !price || !quantity || !selectedFile) {
            alert('Complete todos los campos');
            return;
        }

        const base64Data = await fileToBase64(selectedFile);

        const body = {
            name: name,
            category: category,
            price: price,
            availableQty: quantity,
            productImage: base64Data
        }

        const res = await generarPeticionPost('http://localhost:8080/api/product', body);
        if (res.name) {
            changeView(1);
            loadProducts();
            document.getElementById('name').value = '';
            document.getElementById('category').value = '';
            document.getElementById('price').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('imageInput').value = '';
        } else {
            throw new Error("Error al crear el producto, por favor, vuelva a intentarlo.");
        }
    } catch (err) {
        alert(err.message);
        return;
    }
}

const sanitizeInput = (inputElement) => {
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/\D/g, '');
    inputElement.value = inputValue;
};

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

async function generarPeticionPut(url, body) {
    try {
        const options = {
            method: 'PUT',
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

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

function logout() {
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}

//Inicialización de la ventana
loadProducts();