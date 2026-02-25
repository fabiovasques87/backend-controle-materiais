const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API CRUD Simples rodando!');
});

// initialize database when server starts
// require.main === module (Comentado para garantir execução no VPS via PM2)
const initDb = require('./scripts/initDb');

initDb()
    .then(() => {
        console.log('Banco de dados inicializado (tabelas criadas se necessário)');
    })
    .catch(err => {
        console.error('Falha ao inicializar banco de dados:', err);
    })
    .finally(() => {
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    });

module.exports = app;
