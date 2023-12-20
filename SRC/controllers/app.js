const express = require('express');
const server = express();
const clientesRouter = require('./controllerClientes');
const fornecedoresRouter = require('./controllerFornecedores');
const medicamentosRouter = require('./controllerMedicamentos');
const vendasRouter = require('./controllerVendas');
const fs = require('fs');
const cors = require('cors');
const { parseString, Builder } = require('xml2js');

// função para utilizar o servidor
server.use(express.json());
server.use(cors());

server.use('/api', clientesRouter.server);
server.use('/api', fornecedoresRouter.server);
server.use('/api', medicamentosRouter.server);
server.use('/api', vendasRouter.server);

// mensagem no terminal para indicar o funcionamento
server.listen(3000, () => {
    console.log(`O servidor está funcionando! :D`);
});

// Função para salvar dados no arquivo XML
function salvarDados(dados, caminho) {
    const xmlBuilder = new Builder();
    const xmlString = xmlBuilder.buildObject(dados);
    fs.writeFileSync(__dirname + caminho, xmlString);
}

// CRUD Medicamentos
server.post("/medicamentos", (req, res) => {
    const novoMedicamento = req.body;

    if (!novoMedicamento.id || !novoMedicamento.nome || !novoMedicamento.preco || !novoMedicamento.fabricante || !novoMedicamento.quantidade) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        parseString(fs.readFileSync(__dirname + '/DATA/dados.xml'), (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ mensagem: 'Erro interno' });
            }

            result.dados.medicamentos.push(novoMedicamento);

            salvarDados(result, '/DATA/dados.xml');

            return res.status(201).json({ mensagem: "Novo medicamento cadastrado com sucesso." });
        });
    }
});

server.get("/medicamentos", (req, res) => {
    parseString(fs.readFileSync(__dirname + '/DATA/dados.xml'), (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        return res.json(result.dados.medicamentos);
    });
});

server.put("/medicamentos/:id", (req, res) => {
    const medicamentoId = parseInt(req.params.id);
    const atualizarMedicamento = req.body;

    parseString(fs.readFileSync(__dirname + '/DATA/dados.xml'), (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        const idMedicamento = result.dados.medicamentos.findIndex(m => parseInt(m.id[0]) === medicamentoId);

        if (idMedicamento === -1) {
            return res.status(404).json({ mensagem: 'Medicamento não encontrado' });
        } else {
            result.dados.medicamentos[idMedicamento].nome = atualizarMedicamento.nome || result.dados.medicamentos[idMedicamento].nome;
            result.dados.medicamentos[idMedicamento].preco = atualizarMedicamento.preco || result.dados.medicamentos[idMedicamento].preco;
            result.dados.medicamentos[idMedicamento].fabricante = atualizarMedicamento.fabricante || result.dados.medicamentos[idMedicamento].fabricante;
            result.dados.medicamentos[idMedicamento].quantidade = atualizarMedicamento.quantidade || result.dados.medicamentos[idMedicamento].quantidade;

            salvarDados(result, '/DATA/dados.xml');

            return res.status(201).json({ mensagem: "Medicamento atualizado com sucesso." });
        }
    });
});

server.delete("/medicamentos/:id", (req, res) => {
    const medicamentoId = parseInt(req.params.id);

    parseString(fs.readFileSync(__dirname + '/DATA/dados.xml'), (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro interno' });
        }

        result.dados.medicamentos = result.dados.medicamentos.filter(m => parseInt(m.id[0]) !== medicamentoId);

        salvarDados(result, '/DATA/dados.xml');

        return res.status(200).json({ mensagem: "Medicamento excluído com sucesso" });
    });
});

// CRUD Clientes
server.post("/vendas", (req, res) => {
    const novaVenda = req.body

    if(!novaVenda.id || !novaVenda.data || !novaVenda.id_medicamento || !novaVenda.id_cliente) {
        return res.status(400).json({mensagem: "Dados incompletos, tente novamente"})
    } else {
        dados.vendas.push(novaVenda)
        salvarDados(dados)
        return res.status(201).json({mensagem: "Nova venda cadastrada com sucesso."})
    }
})

server.get("/vendas", (req, res) => {
    return res.json(dados.vendas)
})

server.put("/vendas/:id", (req, res) => {
    const vendaId = parseInt(req.params.id)
    const atualizarVenda = req.body
    const idVenda = dados.vendas.findIndex(v => v.id === vendaId)

    if(idVenda === -1) {
        return res.status(404).json({mensagem: "Venda não encontrada"})
    } else {
        dados.vendas[idVenda].data = atualizarVenda.data || dados.vendas[idVenda].data
        dados.vendas[idVenda].id_medicamento  = atualizarVenda.id_medicamento || dados.vendas[idVenda].id_medicamento
        dados.vendas[idVenda].id_cliente  = atualizarVenda.id_cliente || dados.vendas[idVenda].id_cliente

        salvarDados(dados)
        return res.status(201).json({mensagem: "Venda atualizada com sucesso."})
    }
})

server.delete("/vendas/:id", (req, res) => {
    const vendaId = parseInt(req.params.id)

    dados.vendas = dados.vendas.filter(v => v.id !== vendaId)

    salvarDados(dados)

    return res.status(200).json({mensagem: "Venda excluída com sucesso"})
})