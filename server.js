const express = require('express');
const setupDb = require('./database');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Rota para listar produtos
app.get('/produtos', async (req, res) => {
  const db = await setupDb();
  const produtos = await db.all('SELECT * FROM produtos');
  res.json(produtos);
});

// Rota para cadastrar produto
app.post('/produtos', async (req, res) => {
  const { nome, quantidade, preco } = req.body;
  const db = await setupDb();

  await db.run('INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)', [
    nome,
    quantidade,
    preco,
  ]);

  res.status(201).send('Produto cadastrado com sucesso');
});

// Rota para excluir produto
app.delete('/produtos/:id', async (req, res) => {
  const db = await setupDb();

  await db.run('DELETE FROM produtos WHERE id = ?', [req.params.id]);

  res.sendStatus(200);
});

// Rota para dar baixa na quantidade
app.put('/produtos/baixa/:id', async (req, res) => {
  const { quantidade } = req.body;
  const db = await setupDb();

  const produto = await db.get('SELECT * FROM produtos WHERE id = ?', [req.params.id]);

  if (!produto) {
    return res.status(404).send('Produto não encontrado');
  }

  let novaQuantidade = produto.quantidade - quantidade;

  if (novaQuantidade < 0) {
    novaQuantidade = 0;
  }

  await db.run('UPDATE produtos SET quantidade = ? WHERE id = ?', [novaQuantidade, req.params.id]);

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// Rota para dar entrada na quantidade (aumentar estoque)
app.put('/produtos/entrada/:id', async (req, res) => {
  const { quantidade } = req.body;
  const db = await setupDb();

  await db.run('UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?', [
    quantidade,
    req.params.id,
  ]);

  res.sendStatus(200);
});
