const express = require('express');
const server = express();
const dadosClientes = require('./data/dadosClientes.xml'); 
const fs = require('fs');
const { parseString, Builder } = require('xml2js');

server.use(express.json());

server.post('/clientes', (req, res) => {

    parseString(dadosClientes, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        result.clientes.cliente.push(novoCliente);

        // Salvar dados no arquivo XML
        const xmlBuilder = new Builder();
        const xmlString = xmlBuilder.buildObject(result);

        fs.writeFileSync(__dirname + '/data/dadosClientes.xml', xmlString);

        return res.status(201).json({ mensagem: 'Novo cliente cadastrado com sucesso!' });
    });
});


server.get('/clientes', (req, res) => {
    parseString(dadosClientes, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const clientes = result.clientes.cliente;
        return res.json(clientes);
    });
});

server.put('/clientes/:id', (req, res) => {
    const clienteId = parseInt(req.params.id);
    const atualizaCliente = req.body;

    parseString(dadosClientes, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const clientes = result.clientes.cliente;
        const idCliente = clientes.findIndex(u => parseInt(u.id[0]) === clienteId);

        if (idCliente === -1) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado :/' });
        } else {
            clientes[idCliente].nome = atualizaCliente.nome || clientes[idCliente].nome;
            clientes[idCliente].endereco = atualizaCliente.endereco || clientes[idCliente].endereco;
            clientes[idCliente].email = atualizaCliente.email || clientes[idCliente].email;
            clientes[idCliente].telefone = atualizaCliente.telefone || clientes[idCliente].telefone;

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosClientes.xml', xmlString);

            return res.json({ mensagem: 'Cliente atualizado com sucesso!' });
        }
    });
});

server.delete('/clientes/:id', (req, res) => {
    const clienteId = parseInt(req.params.id);

    parseString(dadosClientes, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const clientes = result.clientes.cliente;
        const novosClientes = clientes.filter(u => parseInt(u.id[0]) !== clienteId);

        result.clientes.cliente = novosClientes;

        const xmlBuilder = new Builder();
        const xmlString = xmlBuilder.buildObject(result);

        fs.writeFileSync(__dirname + '/data/dadosClientes.xml', xmlString);

        return res.status(200).json({ mensagem: 'Cliente excluído com sucesso' });
    });
});


module.exports = { server };
