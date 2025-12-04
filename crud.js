
//PREPARAÇÃO DO AMBIENTE
//1. Crie o banco de dados e a tabela executando o seguinte script SQL:
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3005;

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'testdb'
});

// Conectar ao banco de dados
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
// Middleware para parsear JSON (mandar ao express ler JSON)
app.use(express.json());
app.use(cors());

// CREATE - Rota para adicionar um item
app.post('/items', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }

    const query = 'INSERT INTO items (name) VALUES (?)';
    db.query(query, [name], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding item');
        }
        res.status(201).send('Item added successfully');
    });
});

// READ - Obter todos os itens (Método GET)
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// READ - Obter um item específico (Método GET)
app.get('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'SELECT * FROM items WHERE id = ?';
    
    db.query(query, [itemId], (err, results) => {
        if (err) throw err;
        
        if (results.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.json(results[0]);
    });
});

// UPDATE - Atualizar um item (Método PUT)
app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Name is required');
    }

    const query = 'UPDATE items SET name = ? WHERE id = ?';
    db.query(query, [name, itemId], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating item');
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item updated successfully');
    });
});

// DELETE - Remover um item (Método DELETE)
app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const query = 'DELETE FROM items WHERE id = ?';
    
    db.query(query, [itemId], (err, result) => {
        if (err) {
            return res.status(500).send('Error deleting item');
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item deleted successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});