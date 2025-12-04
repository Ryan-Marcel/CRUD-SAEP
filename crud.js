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
    if (err) throw err;
    console.log('Connected to database');
});

app.use(express.json());
app.use(cors());

// CREATE
app.post('/items', (req, res) => {
    const { name, quantidade } = req.body;
    console.log('Recebido no backend:', { name, quantidade }); // Debug
    
    if (!name) return res.status(400).send('Name is required');
    
    const qtd = quantidade !== undefined ? quantidade : 0;
    const query = 'INSERT INTO items (name, quantidade) VALUES (?, ?)';
    
    db.query(query, [name, qtd], (err, result) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).send('Error adding item');
        }
        console.log('Item inserido com sucesso:', { name, quantidade: qtd });
        res.status(201).send('Item added successfully');
    });
});

// READ - Todos os itens
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// READ - Item específico
app.get('/items/:id', (req, res) => {
    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.status(404).send('Item not found');
        res.json(results[0]);
    });
});

// UPDATE
app.put('/items/:id', (req, res) => {
    const { name, quantidade } = req.body;
    console.log('Atualizando no backend:', { id: req.params.id, name, quantidade }); // Debug
    
    if (!name) return res.status(400).send('Name is required');

    const qtd = quantidade !== undefined ? quantidade : 0;
    const query = 'UPDATE items SET name = ?, quantidade = ? WHERE id = ?';
    
    db.query(query, [name, qtd, req.params.id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar:', err);
            return res.status(500).send('Error updating item');
        }
        if (result.affectedRows === 0) return res.status(404).send('Item not found');
        console.log('Item atualizado com sucesso');
        res.send('Item updated successfully');
    });
});

// DELETE
app.delete('/items/:id', (req, res) => {
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) return res.status(500).send('Error deleting item');
        if (result.affectedRows === 0) return res.status(404).send('Item not found');
        res.send('Item deleted successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});