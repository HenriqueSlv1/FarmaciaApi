document.addEventListener('DOMContentLoaded', function () {
    // Carrega a lista de medicamentos ao entrar na página
    loadMedicamentosList();

    // Adiciona um listener para o formulário de adição de medicamentos
    document.getElementById('formAdicionarMedicamento').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarMedicamento();
    });
});

function adicionarMedicamento() {
    // Obtém os valores do formulário
    const id = document.getElementById('idMedicamento').value;
    const nome = document.getElementById('nomeMedicamento').value;
    const fabricante = document.getElementById('fabricanteMedicamento').value;
    const preco = document.getElementById('precoMedicamento').value;
    const quantidade = document.getElementById('quantidadeMedicamento').value;

    // Faz uma requisição para adicionar o medicamento
    fetch('http://localhost:3000/api/medicamentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            nome: nome,
            fabricante: fabricante,
            preco: preco,
            quantidade: quantidade
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Recarrega a lista de medicamentos após a adição
        loadMedicamentosList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadMedicamentosList() {
    // Faz uma requisição para carregar a lista de medicamentos
    fetch('http://localhost:3000/api/medicamentos')
        .then(response => response.json())
        .then(data => displayMedicamentosList(data))
        .catch(error => console.error("Erro:", error));
}

function displayMedicamentosList(data) {
    const listaMedicamentos = document.getElementById('listaMedicamentos');
    listaMedicamentos.innerHTML = '';

    // Exibe a lista de medicamentos na página
    data.forEach(medicamento => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>ID:</b> ${medicamento.id} <br> <b>Nome:</b> ${medicamento.nome} <br> <b>Fabricante:</b> ${medicamento.fabricante} <br> <b>Preço:</b> ${medicamento.preco} <br> <b>Quantidade:</b> ${medicamento.quantidade}`;
        listaMedicamentos.appendChild(listItem);
    });


    // Exibe a lista de medicamentos na página
    data.forEach(medicamento => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>ID:</b> ${medicamento.id} <br> <b>Nome:</b> ${medicamento.nome} <br> <b>Fabricante:</b> ${medicamento.fabricante} <br> <b>Preço:</b> ${medicamento.preco} <br> <b>Quantidade:</b> ${medicamento.quantidade}`;
        listaMedicamentos.appendChild(listItem);
    });
}   
