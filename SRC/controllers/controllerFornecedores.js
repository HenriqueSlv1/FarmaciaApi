const express = require('express');
const server = express();
const dadosFornecedores = require('./data/dadosFornecedores.xml');  
const fs = require('fs');
const { parseString, Builder } = require('xml2js');

server.use(express.json());

server.post('/fornecedores', (req, res) => {
    const novoFornecedor = req.body;

    if (!novoFornecedor.nome || !novoFornecedor.endereco || !novoFornecedor.telefone) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        parseString(dadosFornecedores, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensagem: 'Erro interno' });
            }

            result.fornecedores.fornecedor.push(novoFornecedor);

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosFornecedores.xml', xmlString);

            return res.status(201).json({ mensagem: 'Novo fornecedor cadastrado com sucesso!' });
        });
    }
});

server.get('/fornecedores', (req, res) => {
    return res.json(dadosFornecedores.fornecedores.fornecedor);
});

server.put('/fornecedores/:id', (req, res) => {
    const fornecedorId = parseInt(req.params.id);
    const atualizarFornecedor = req.body;

    parseString(dadosFornecedores, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const fornecedores = result.fornecedores.fornecedor;
        const idFornecedor = fornecedores.findIndex(f => parseInt(f.id[0]) === fornecedorId);

        if (idFornecedor === -1) {
            return res.status(404).json({ mensagem: 'Fornecedor não encontrado' });
        } else {
            fornecedores[idFornecedor].nome = atualizarFornecedor.nome || fornecedores[idFornecedor].nome;
            fornecedores[idFornecedor].endereco = atualizarFornecedor.endereco || fornecedores[idFornecedor].endereco;
            fornecedores[idFornecedor].telefone = atualizarFornecedor.telefone || fornecedores[idFornecedor].telefone;

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosFornecedores.xml', xmlString);

            return res.status(201).json({ mensagem: 'Fornecedor atualizado com sucesso.' });
        }
    });
});

server.delete("/fornecedores/:id", (req, res) => {
    const fornecedorId = parseInt(req.params.id);

    parseString(dadosFornecedores, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const fornecedores = result.fornecedores.fornecedor;
        const novosFornecedores = fornecedores.filter(f => parseInt(f.id[0]) !== fornecedorId);

        result.fornecedores.fornecedor = novosFornecedores;

        const xmlBuilder = new Builder();
        const xmlString = xmlBuilder.buildObject(result);

        fs.writeFileSync(__dirname + '/data/dadosFornecedores.xml', xmlString);

        return res.status(200).json({ mensagem: 'Fornecedor excluído com sucesso' });
    });
});

module.exports = { server };
