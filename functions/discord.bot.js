require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

// Inicializando o cliente do Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Usando variáveis de ambiente
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;;  // Correção da variável de ambiente
const CHANNEL_ID = '1296492652413456425';  // Substitua com o ID real do seu canal

client.once('ready', () => {
    console.log('Bot do Discord está online!');
});

const notifyNewUser = (cleanDiscordName, idPersonagemNumber, cleanCharacterName) => {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (channel) {
        channel.send(`Novo usuário registrado:\nDiscord: **${cleanDiscordName}**\nID: ${idPersonagemNumber}\nPersonagem: **${cleanCharacterName}**\nAguardando liberação no sistema.`);

    } else {
        console.error('Canal não encontrado');
    }
};


// Logar o cliente do Discord usando o token
client.login(DISCORD_TOKEN).catch(err => {
    console.error('Erro ao logar no Discord:', err);
});

module.exports = { notifyNewUser };
