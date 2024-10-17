const { Pool  } = require('pg');

const pool = new Pool({
    user: "01929724-9495-7773-ac9e-40e42494107a",
    password: "2881563b-1205-4567-917a-0307d4dceaf9",
    host: "us-west-2.db.thenile.dev",
    port: 5432,
    database: "MecEldourado",
});

let client;

const connectDB = async () => {
    try {
        client = await pool.connect(); // Pega uma conexão do pool
        console.log('Conexão ao banco de dados MecEldourado estabelecida com sucesso!');
        return client;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
};

const disconnectDB = async () => {
    try {
        await pool.end(); // Encerra todas as conexões do pool
        console.log('Todas as conexões foram encerradas.');
    } catch (error) {
        console.error('Erro ao encerrar as conexões com o banco de dados:', error);
    }
};

module.exports = {
    connectDB,
    disconnectDB,
};