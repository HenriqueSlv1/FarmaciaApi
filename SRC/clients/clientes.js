document.addEventListener('DOMContentLoaded', function () {
    // Carrega a lista de clientes ao entrar na página
    loadClientesList();

    // Adiciona um listener para o formulário de adição de clientes
    document.getElementById('formAdicionarCliente').addEventListener('submit', function (event) {
        event.preventDefault();
        adicionarCliente();
    });
});

function adicionarCliente() {
    // Obtém os valores do formulário
    const id = document.getElementById('idCliente').value;
    const nome = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const email = document.getElementById('emailCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;

    // Faz uma requisição para adicionar o cliente
    fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            nome: nome,
            endereco: endereco,
            email: email,
            telefone: telefone
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Recarrega a lista de clientes após a adição
        loadClientesList();
    })
    .catch(error => console.error("Erro:", error));
}

function loadClientesList() {
    // Faz uma requisição para carregar a lista de clientes
    fetch('http://localhost:3000/api/clientes')
        .then(response => response.json())
        .then(data => displayClientesList(data))
        .catch(error => console.error("Erro:", error));
}

function displayClientesList(data) {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';

    // Exibe a lista de clientes na página
    data.forEach(cliente => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<b>ID:</b> ${cliente.id} <br> <b>Nome:</b> ${cliente.nome} <br> <b>Email:</b> ${cliente.email} <br> <b>Endereço:</b> ${cliente.endereco} <br> <b>Telefone:</b> ${cliente.telefone}`;
        listaClientes.appendChild(listItem);
    });
}
