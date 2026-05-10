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
    const { nome, categoria, quantidade, preco } = req.body;
    const db = await setupDb();
    await db.run(
        'INSERT INTO produtos (nome, categoria, quantidade, preco) VALUES (?, ?, ?, ?)',
        [nome, categoria, quantidade, preco]
    );
    res.status(201).send('Produto cadastrado com sucesso');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
