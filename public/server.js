const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('./public/db_config'); 
const path = require('path');

const app = express();
const PORT = 3333;

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Tarefas',
            version: '1.0.0',
            description: 'API para gerenciar usuários, autenticação e tarefas',
        },
    },
    apis: ['./public/server.js'], // Caminho para este arquivo
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Usuário não encontrado ou senha incorreta
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Erro ao sair
 */
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Registro bem-sucedido
 *       400:
 *         description: Falha no registro devido a dados inválidos ou email já cadastrado
 */
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtém a lista de tarefas do usuário autenticado
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada
 *       401:
 *         description: Usuário não autenticado
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Tarefas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: Estudar Node.js
 *               status:
 *                 type: string
 *                 example: "pendente"
 *     responses:
 *       200:
 *         description: Tarefa criada com sucesso
 *       401:
 *         description: Usuário não autenticado
 */

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Atualiza o status de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "concluída"
 *     responses:
 *       200:
 *         description: Status atualizado
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Tarefa não encontrada
 */

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza a descrição de uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "Estudar API REST"
 *     responses:
 *       200:
 *         description: Descrição atualizada
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Tarefa não encontrada
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     tags: [Tarefas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Tarefa não encontrada
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));

app.use(session({
    secret: '904200',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Defina secure: true em produção, se usar HTTPS
}));

// Funções Auxiliares
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function comparePassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

// Rota Principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Rotas de Autenticação
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuário não encontrado' });
        }

        const user = results[0];
        const isPasswordValid = await comparePassword(password, user.senha);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Senha incorreta' });
        }

        // Salvar usuário na sessão
        req.session.userId = user.id;
        req.session.userName = user.nome;
        req.session.userEmail = user.email;

        res.json({ success: true, user: { id: user.id, nome: user.nome, email: user.email } });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro ao sair' });
        }
        res.json({ success: true });
    });
});

app.post('/register', async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const hashedPassword = await hashPassword(password);
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, hashedPassword], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'Email já cadastrado' });
            }
            throw err;
        }
        res.json({ success: true, user: { id: results.insertId, nome, email } });
    });
});

// Middleware para verificar a autenticação
function checkAuthentication(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
    next();
}

// Rotas de Tarefas
app.get('/tasks', checkAuthentication, (req, res) => {
    const userId = req.session.userId;

    const query = 'SELECT * FROM tarefas WHERE usuario_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.json({ success: true, tasks: results });
    });
});

app.post('/tasks', checkAuthentication, (req, res) => {
    const { descricao, status } = req.body;
    const usuario_id = req.session.userId;

    const query = 'INSERT INTO tarefas (descricao, status, usuario_id) VALUES (?, ?, ?)';
    db.query(query, [descricao, status, usuario_id], (err, results) => {
        if (err) throw err;
        res.json({ success: true, task: { id: results.insertId, descricao, status, usuario_id } });
    });
});

// Rota para atualizar o status da tarefa (concluir/desmarcar)
app.patch('/tasks/:id', checkAuthentication, (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    const userId = req.session.userId;

    const query = 'UPDATE tarefas SET status = ? WHERE id = ? AND usuario_id = ?';
    db.query(query, [status, taskId, userId], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tarefa não encontrada ou não pertence ao usuário' });
        }
        res.json({ success: true, message: 'Status da tarefa atualizado com sucesso' });
    });
});

// Rota para editar a descrição de uma tarefa
app.put('/tasks/:id', checkAuthentication, (req, res) => {
    const taskId = req.params.id;
    const { descricao } = req.body;
    const userId = req.session.userId;

    const query = 'UPDATE tarefas SET descricao = ? WHERE id = ? AND usuario_id = ?';
    db.query(query, [descricao, taskId, userId], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tarefa não encontrada ou não pertence ao usuário' });
        }
        res.json({ success: true, message: 'Tarefa atualizada com sucesso' });
    });
});

// Rota para excluir uma tarefa
app.delete('/tasks/:id', checkAuthentication, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;

    const query = 'DELETE FROM tarefas WHERE id = ? AND usuario_id = ?';
    db.query(query, [taskId, userId], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tarefa não encontrada ou não pertence ao usuário' });
        }
        res.json({ success: true, message: 'Tarefa excluída com sucesso' });
    });
});

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});