document.addEventListener('DOMContentLoaded', function () {
    // Carrega a lista de fornecedores ao entrar na página
    loadFornecedoresList();

    // Adiciona um listener para o formulário de adição de fornecedores
    document.getElementById('formAdicionarFornecedor').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarFornecedor();
    });
});

function adicionarFornecedor() {
    // Obtém os valores do formulário
    const id = document.getElementById('idFornecedor').value;
    const nome = document.getElementById('nomeFornecedor').value;
    const endereco = document.getElementById('enderecoFornecedor').value;
    const telefone = document.getElementById('telefoneFornecedor').value;

    // Faz uma requisição para adicionar o fornecedor
    fetch('http://localhost:3000/api/fornecedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            nome: nome,
            endereco: endereco,
            telefone: telefone
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Recarrega a lista de fornecedores após a adição
        loadFornecedoresList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadFornecedoresList() {
    // Faz uma requisição para carregar a lista de fornecedores
    fetch('http://localhost:3000/api/fornecedores')
        .then(response => response.json())
        .then(data => displayFornecedoresList(data))
        .catch(error => console.error("Erro:", error));
}

function displayFornecedoresList(data) {
    const listaFornecedores = document.getElementById('listaFornecedores');
    listaFornecedores.innerHTML = '';

    // Exibe a lista de fornecedores na página
    data.forEach(fornecedor => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>ID:</b> ${fornecedor.id} <br> <b>Nome:</b> ${fornecedor.nome} <br> <b>Endereço:</b> ${fornecedor.endereco} <br> <b>Telefone:</b> ${fornecedor.telefone}`;
        listaFornecedores.appendChild(listItem);
    });
}
