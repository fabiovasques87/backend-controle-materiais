const prisma = require('../config/prisma');

async function initDb() {
    console.log('Verificando conexão com o Prisma...');
    try {
        await prisma.$connect();
        console.log('Prisma conectado com sucesso ao banco bd-controle-materiais.');
    } catch (error) {
        console.error('Falha ao conectar o Prisma:', error);
        throw error;
    }
}

module.exports = initDb;