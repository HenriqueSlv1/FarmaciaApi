const express = require('express');
const server = express();
const dadosMedicamentos = require('./data/dadosMedicamentos.xml');  
const fs = require('fs');
const { parseString, Builder } = require('xml2js');

server.use(express.json());
server.post('/medicamentos', (req, res) => {
    const novoMedicamento = req.body;

    if (!novoMedicamento.nome || !novoMedicamento.fabricante || !novoMedicamento.preco || !novoMedicamento.quantidade) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        parseString(dadosMedicamentos, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensagem: 'Erro interno' });
            }

            result.medicamentos.medicamento.push(novoMedicamento);

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosMedicamentos.xml', xmlString);

            return res.status(201).json({ mensagem: 'Novo medicamento cadastrado com sucesso!' });
        });
    }
});

server.get('/medicamentos', (req, res) => {
    return res.json(dadosMedicamentos.medicamentos.medicamento);
});

server.put('/medicamentos/:id', (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    const atualizarMedicamento = req.body;

    parseString(dadosMedicamentos, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const medicamentos = result.medicamentos.medicamento;
        const idMedicamento = medicamentos.findIndex(m => parseInt(m.id[0]) === medicamentoId);

        if (idMedicamento === -1) {
            return res.status(404).json({ mensagem: 'Medicamento não encontrado' });
        } else {
            medicamentos[idMedicamento].nome = atualizarMedicamento.nome || medicamentos[idMedicamento].nome;
            medicamentos[idMedicamento].preco = atualizarMedicamento.preco || medicamentos[idMedicamento].preco;
            medicamentos[idMedicamento].fabricante = atualizarMedicamento.fabricante || medicamentos[idMedicamento].fabricante;
            medicamentos[idMedicamento].quantidade = atualizarMedicamento.quantidade || medicamentos[idMedicamento].quantidade;

            const xmlBuilder = new Builder();
            const xmlString = xmlBuilder.buildObject(result);

            fs.writeFileSync(__dirname + '/data/dadosMedicamentos.xml', xmlString);

            return res.status(201).json({ mensagem: 'Medicamento atualizado com sucesso.' });
        }
    });
});

server.delete("/medicamentos/:id", (req, res) => {
    const medicamentoId = parseInt(req.params.id);

    parseString(dadosMedicamentos, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const medicamentos = result.medicamentos.medicamento;
        const novosMedicamentos = medicamentos.filter(m => parseInt(m.id[0]) !== medicamentoId);

        result.medicamentos.medicamento = novosMedicamentos;

        const xmlBuilder = new Builder();
        const xmlString = xmlBuilder.buildObject(result);

        fs.writeFileSync(__dirname + '/data/dadosMedicamentos.xml', xmlString);

        return res.status(200).json({ mensagem: 'Medicamento excluído com sucesso' });
    });
});

module.exports = { server };
