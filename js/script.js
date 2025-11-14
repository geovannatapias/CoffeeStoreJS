function loadHeader() {
    fetch('header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;
            setupNavLinks(); 
        });
}

function loadPage(page) {
    fetch(`${page}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("main-container").innerHTML = html;
            if (page === 'form') setupForm();
        });
}

async function getUF() {
    try {
        const ufSelect = document.getElementById("uf");
        const res = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');
        const data = await res.json(); 
        data.forEach(uf => {
            const option = document.createElement("option");
            option.value = uf.sigla;
            option.textContent = uf.nome;
            ufSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar UFs:", error);
    }
}

async function getMunicipios(uf) {
    try {
        const municipioSelect = document.getElementById("municipio");
        municipioSelect.innerHTML = '<option value="">Selecione um municipio</option>';
        if (!uf) return;
        const res = await fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`);
        const data = await res.json();

        data.forEach(municipio => {
            const option = document.createElement("option");
            option.value = municipio.nome;
            option.textContent = municipio.nome;
            municipioSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao buscar municípios:", error);
    }
}

function setupNavLinks() {
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const page = link.getAttribute("data-page");
            loadPage(page);
        });
    });
}

function setupForm() {
    const form = document.getElementById("clienteForm");
    const ufSelect = document.getElementById("uf");
    if (!form || !ufSelect) return;

    if (!form) return;

    getUF();

    ufSelect.addEventListener("change", () => {
        const uf = ufSelect.value;
        getMunicipios(uf);
    });
    const cpfInput = document.getElementById("cpf");
    const emailInput = document.getElementById("email");
    const dataInput = document.getElementById("datanascimento");

     if (cpfInput) {
        cpfInput.addEventListener("input", () => {
            let v = cpfInput.value.replace(/\D/g, "").slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            cpfInput.value = v;
        });
    }
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            emailInput.value = emailInput.value.trim().toLowerCase();
        });
    }
    if (dataInput) {
        dataInput.addEventListener("input", () => {
            let v = dataInput.value.replace(/\D/g, "").slice(0, 8);
            v = v.replace(/(\d{2})(\d)/, "$1/$2");
            v = v.replace(/(\d{2})(\d)/, "$1/$2");
            dataInput.value = v;
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        const nome = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const cpf = document.getElementById("cpf").value.trim().replace(/\D/g, '');

        if (!nome || !email || !cpf) {
            alert("Preencha todos os campos!");
            return;

        }
        const cliente = {
            nome,
            email,
            cpf,
            date: new Date().toISOString()
        };

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        clientes.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(clientes));

        alert(`Cliente salvo com sucesso!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}`);
        form.reset();
    });
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            form.reset();

            ufSelect.value = "";
            const municipioSelect = document.getElementById("municipio");
            if (municipioSelect) municipioSelect.innerHTML = "<option value=''>Selecione o município</option>";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadPage("home");

});

function openModal(tabelanutricional) {
    document.getElementById("modalOverlay").style.display = "flex";
    const txt1 = document.getElementById("txt1");
    const txt2 = document.getElementById("txt2");
    const txt3 = document.getElementById("txt3");

    switch (tabelanutricional) {
        case "tabelanutricional1":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 34kJ (8kcal)<br>Gordura: 0,2g<br>Gordura saturada: 0,01g<br>Carboidratos: 1,0g<br>Açúcares: 0,4g<br>Fibra: 0g<br>Proteína: 0,5g";
            txt3.innerHTML = "R$8,00";
            break;
        case "tabelanutricional2":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 34kJ (8kcal)<br>Gordura: 0,2g<br>Gordura saturada: 0g<br>Carboidratos: 1,0g<br>Açúcares: 0,4g<br>Fibra: 0g<br>Proteína: 0,5g<br>Sal: 0,02g";
            txt3.innerHTML = "R$10,00";
            break;
        case "tabelanutricional3":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 229kJ (55kcal)<br>Gordura: 2,9g<br>Gordura saturada: 1,8g<br>Carboidratos: 4,1g<br>Açúcares: 3,7g<br>Fibra: 0g<br>Proteína: 3,0g<br>Sal: 0,09g";
            txt3.innerHTML = "R$11,00";
            break;
        case "tabelanutricional4":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 174kJ (41kcal)<br>Gordura: 1,4g<br>Gordura saturada: 0,8g<br>Carboidratos: 4,1g<br>Açúcares: 3,6g<br>Fibra: 0g<br>Proteína: 3,0g<br>Sal: 0,09g";
            txt3.innerHTML = "R$12,00";
            break;
        case "tabelanutricional5":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 34kJ (8kcal)<br>Gordura: 0,2g<br>Gordura saturada: 0g<br>Carboidratos: 1,0g<br>Açúcares: 0,4g<br>Fibra: 0g<br>Proteína: 0,5g<br>Sal: 0,02g";
            txt3.innerHTML = "R$8,00";
            break;
        case "tabelanutricional6":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 229kJ (55kcal)<br>Gordura: 2,9g<br>Gordura saturada: 1,8g<br>Carboidratos: 4,1g<br>Açúcares: 3,7g<br>Fibra: 0g<br>Proteína: 3,0g<br>Sal: 0,09g";
            txt3.innerHTML = "R$8,00";
            break;
        case "tabelanutricional7":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 174kJ (41kcal)<br>Gordura: 1,4g<br>Gordura saturada: 0,8g<br>Carboidratos: 4,1g<br>Açúcares: 3,6g<br>Fibra: 0g<br>Proteína: 3,0g<br>Sal: 0,09g";
            txt3.innerHTML = "R$8,00";
            break;
        case "tabelanutricional8":
            txt1.innerHTML = "Tabela nutricional (Por 100g)";
            txt2.innerHTML = "Energia: 114kJ (27kcal)<br>Gordura: 0,2g<br>Gordura saturada: 0g<br>Carboidratos: 5,8g<br>Açúcares: 5,3g<br>Fibra: 0,1g<br>Proteína: 0,4g<br>Sal: 0,12g";
            txt3.innerHTML = "R$8,00";
            break;
    }

    const modalGlobal = document.getElementById("knowMore");

    modalGlobal.style.display = "block";
};

function fecharModal() {
    const modalGlobal = document.getElementById("knowMore");
    modalGlobal.style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
};