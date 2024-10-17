const { connectDB,client} = require('../bd/conexao');
const bcrypt = require('bcrypt');

exports.handler = async (req, res) => {

    const isExpress = res && typeof res.status === 'function';
    
    const errorResponse = (message) => {
        if (isExpress) {
            return res.status(400).json({ message, type: 'danger' });
        }
        return {
            statusCode: 400,
            body: JSON.stringify({ message, type: 'danger' }),
        };
    };

    if (isExpress) {
        if (!req.route || !req.route.methods || req.route.methods.post !== true) {
            return errorResponse('Método não permitido.');
        }
    } else {
        if (req.httpMethod !== 'POST') {
            return errorResponse('Método não permitido.');
        }
    }
    
    const nomePersonagem = isExpress ? req.body.characterName : JSON.parse(req.body).characterName;
    const idPersonagem = isExpress ? req.body.characterId : JSON.parse(req.body).characterId;
    const nomeDiscord = isExpress ? req.body.discordName : JSON.parse(req.body).discordName;
    const senha = isExpress ? req.body.password : JSON.parse(req.body).password;

   
    if (!nomePersonagem || !idPersonagem || !nomeDiscord || !senha) {
        return errorResponse('Todos os campos são obrigatórios.');
    }

    if (typeof nomePersonagem !== 'string' || typeof nomeDiscord !== 'string' || typeof senha !== 'string') {
        return errorResponse('Os campos "Nome do Personagem", "Nome do Discord" e "senha" devem ser strings.');
    }

    if (nomePersonagem.length < 3 || nomePersonagem.length > 50) {
        return errorResponse('O campo "Nome do Personagem" deve ter entre 3 e 50 caracteres.');
    }

    const idPersonagemNumber = Number(idPersonagem);
    if (isNaN(idPersonagemNumber) || idPersonagemNumber <= 0) { 
        return errorResponse('O campo "Id do Personagem" deve ser um número válido.');
    }

    if (typeof nomeDiscord !== 'string') {
        return errorResponse('O campo "Nome do Discord" deve conter apenas caracteres alfanuméricos, ponto ou underscore.');
    }

    if (senha.length < 8) {
        return errorResponse('A senha deve ter pelo menos 8 caracteres.');
    }

    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!senhaRegex.test(senha)) {
        return errorResponse('A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.');
    }

    const sanitize = (str) => str.replace(/[^a-zA-Z0-9#_ ]/g, '');
    const cleanCharacterName = sanitize(nomePersonagem);
    const cleanDiscordName = sanitize(nomeDiscord);

    let client = null; 
    
    try {
        client = await connectDB(); // Conecta ao banco de dados

        // Verificar se o usuário já existe no sistema
      const usuarioExistente = await client.query('SELECT * FROM usuario WHERE passaport = $1 OR nome_discord = $2', [idPersonagemNumber, cleanDiscordName]);

      if (usuarioExistente.rows.length > 0) {
            const erroMsg = usuarioExistente.rows.some(user => user.nome_discord === cleanDiscordName)
                ? `O nome do Discord "${cleanDiscordName}" já existe no sistema.`
                : `O Id do personagem "${idPersonagemNumber}" já existe no sistema.`;
            return errorResponse(erroMsg);
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        // Inserindo os dados no banco de dados
        await client.query(
            `INSERT INTO usuario (passaport, nome, nome_discord, senha, liberado, ativo) 
             VALUES ($1, $2, $3, $4, 0, 1) RETURNING *`,
            [idPersonagemNumber, cleanCharacterName, cleanDiscordName, senhaCriptografada]
        );

        if (isExpress) {
            return res.status(201).json({ message: 'Usuário registrado com sucesso!', type: 'success' });
        } else {
            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'Usuário registrado com sucesso!', type: 'success' }),
            };
        }
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        if (isExpress) {
            return res.status(500).json({ message: 'Erro ao cadastrar usuário.', type: 'danger' });
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao cadastrar usuário.', type: 'danger' }),
            };
        }
    } finally {
        if (client) {
            client.release(); // Libera a conexão de volta ao pool
            console.log('conexão ao banco de dados liberada para o pool');
        } else {
            console.log('Nenhuma conexão a ser liberada.');
        }
    }
};
