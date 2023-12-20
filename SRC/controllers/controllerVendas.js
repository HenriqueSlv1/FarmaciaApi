const express = require('express');
const server = express();
const dadosVendas = require('./data/dadosVendas.xml'); 
const fs = require('fs');
const { parseString, Builder } = require('xml2js');

server.use(express.json());

server.post('/vendas', (req, res) => {
    const novaVenda = req.body;

    if (!novaVenda.data || !novaVenda.id_medicamento || !novaVenda.id_cliente) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        parseString(dadosVendas, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensagem: 'Erro interno' });
            }

            result.vendas.venda.push(novaVenda);

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosVendas.xml', xmlString);

            return res.status(201).json({ mensagem: 'Nova venda cadastrada com sucesso!' });
        });
    }
});

server.get('/vendas', (req, res) => {
    return res.json(dadosVendas.vendas.venda);
});

module.exports = { server };
