const { Pool } = require('pg');
require('dotenv').config();

console.log('--- Diagnóstico de Conexão com o Banco ---');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_PASS configurado:', process.env.DB_PASS ? 'SIM' : 'NÃO (ESTÁ VAZIO)');
console.log('-----------------------------------------');

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('Base de Dados conectada com sucesso!');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
