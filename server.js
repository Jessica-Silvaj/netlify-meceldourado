const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a função hello
app.get('/.netlify/functions/hello', (req, res) => {
    res.json({ message: "Olá do Netlify Functions!" });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
