const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3005;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'testdb'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.use(cors());
app.use(express.json());

// CREATE - Criar novo item
app.post('/items', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    const query = 'INSERT INTO items (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao criar item' });
        }
        res.status(201).json({ 
            message: 'Item criado com sucesso', 
            id: result.insertId 
        });
    });
});

// READ ALL - Ler todos os itens
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar itens' });
        }
        res.json(results);
    });
});

// READ ONE - Ler um item específico
app.get('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'SELECT * FROM items WHERE id = ?';
    
    db.query(query, [itemId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar item' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }
        
        res.json(results[0]);
    });
});

// UPDATE - Atualizar um item
app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    const query = 'UPDATE items SET name = ? WHERE id = ?';
    db.query(query, [name, itemId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar item' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }
        
        res.json({ message: 'Item atualizado com sucesso' });
    });
});

// DELETE - Deletar um item
app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'DELETE FROM items WHERE id = ?';
    
    db.query(query, [itemId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar item' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }
        
        res.json({ message: 'Item deletado com sucesso' });
    });
});

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Servidor CRUD rodando!',
        time: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});