const validation_info = JSON.parse(sessionStorage.getItem("user"));
if(!validation_info || validation_info.rol != "ADMIN"){
    window.location.href = 'index.html';
}

function loadPayments() {
    fetch('http://localhost:8080/api/payment')
        .then(res => {
            if (!res.ok) {
                throw new Error("Falla al buscar la lista de métodos de pago");
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

                    const tdName = document.createElement('td');
                    tdName.textContent = res[i].name;

                    const trDelete = document.createElement('td');
                    trDelete.className = 'text-center';
                    const btnDelete = document.createElement('button');
                    const trashicon = document.createElement('img');
                    trashicon.src = './assets/img/trash-icon.svg';
                    trashicon.style.height = '30px';
                    trashicon.style.filter = 'invert(1)';

                    btnDelete.className = 'btn';
                    btnDelete.onclick = _ => {
                        deletePayment(res[i].id);
                    }

                    btnDelete.appendChild(trashicon);
                    trDelete.appendChild(btnDelete);

                    tr.appendChild(tdName);
                    tr.appendChild(trDelete);

                    tbody.appendChild(tr);
                }
            }, 100);
        })
        .catch(err => {
            alert(err.message);
        });
}

async function deletePayment(id) {
    resRemove = await generarPeticionDelete(`http://localhost:8080/api/payment/${id}`);
    if (resRemove.status === 200) {
        loadPayments();
    } else {
        alert(`Error al eliminar el método de pago con id: ${id}`);
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

function changeView(option) {
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
    } catch (err) { }
}

async function sendPayment() {
    try {
        const name = document.getElementById('name').value;

        if (!name) {
            alert('Complete todos los campos');
            return;
        }

        const body = {
            name: name,
        }

        const res = await generarPeticionPost('http://localhost:8080/api/payment', body);
        if (res.name) {
            changeView(1);
            loadPayments();
            document.getElementById('name').value = '';
        } else {
            throw new Error("Error al crear el método de pago, por favor, vuelva a intentarlo.");
        }
    } catch (err) {
        alert(err.message);
        return;
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

function logout(){
    sessionStorage.removeItem("user");
    window.location.href = 'index.html';
}

loadPayments();