const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');  // Biblioteca para PostgreSQL

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao banco de dados MySQL
const pool = new Pool({
    host:"localhost",
    dbname:"reserva_restaurante",
    user:"postgres",
    password:"belezabr",
    port:"5432"
});

// Testar a conexão com o banco de dados
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err);
    }
    console.log('Conectado ao banco de dados PostgreSQL');
    release();
});

// Rota para inserir usuário no banco de dados
app.post('/api/usuarios', async (req, res) => {
    const { email, nome, senha, data_nascimento } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO usuario (email, nome, senha, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING *`,
            [email, nome, senha, data_nascimento]
        );
        res.status(201).json(result.rows[0]); // Retorna o registro inserido
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao inserir usuário no banco de dados');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
