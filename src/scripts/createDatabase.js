const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: 'postgres', // Connect to default database first
    });

    try {
        await client.connect();

        const dbName = process.env.DB_NAME;
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Banco de dados '${dbName}' não existe. Criando...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Banco de dados '${dbName}' criado com sucesso!`);
        } else {
            console.log(`Banco de dados '${dbName}' já existe.`);
        }
    } catch (err) {
        console.error('Erro ao criar banco de dados:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
