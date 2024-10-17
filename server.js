const express = require('express');
const path = require('path');
const { handler } = require('./functions/registrar')
const { handler: discordBotHandler } = require('./functions/discord.bot');


const app = express();
const port = process.env.PORT || 3000;

// Middleware para analisar JSON
app.use(express.json()); // Adiciona middleware para analisar JSON

// Serve os arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/.netlify/functions/registrar', handler); // Usando a função handler diretamente

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
