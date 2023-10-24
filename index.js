const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const Tasks = require("./database/Tasks");
const Users = require("./database/Users");
const jwt = require("jsonwebtoken");
require("dotenv-safe").config();

const port = 8484;

// Configurando Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conxão com o DB
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    })
    .catch((msgErr) => {
        console.log(msgErr);
    })

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, process.env.senha, (err, decoded) => {
            if (err) {
                return res.status(500).send("Falha ao tentar validar o token");
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    } else {
        res.status(401).send("Token invalido");
    }
}

// Rota principal
app.get("/", (req, res) => {
    Tasks.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(tasks => {
        res.json({
            tasks: tasks,
        });
    }).catch(error => {
        res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.post("/login", (req, res) => {
    const login = req.body.login;
    const password = req.body.pass;

    Users.findOne({
        where: { username: login }
    }).then(user => {
        if (password === user.password) {
            const userId = user.id
            const token = jwt.sign({ userId }, process.env.senha, { expiresIn: 300 });
            res.status(200).json(token);
        } else {
            res.status(200).json("Senha incorreta");
        }
    })
});

app.get("/profile", verifyJWT, (req, res) => {
    Users.findOne({
        where: { id: req.userId }
    }).then(user => {
        res.status(200).json(user);
    });
});

app.patch("/profile", verifyJWT, (res, req) => {

});

app.get("/tarefas", verifyJWT, (req, res) => {
    Tasks.findAll({
        where: { userID: req.userId }
    }).then(task => {
        res.status(200).json(task);
    })
});

app.post('/tarefas', verifyJWT, (req, res) => {
    const { titulo, descricao, status } = req.body;
    const dataCriacao = new Date();
    Tasks.create({
        userID: req.userId,
        titulo: titulo,
        descricao: descricao,
        status: status,
        createdAt: dataCriacao,
        updatedAt: dataCriacao
    }).then(() => {
        res.status(200).json({ message: 'Tarefa criada com sucesso' });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar a tarefa' });
    });
});

app.get("/tarefas/:id", verifyJWT, (req, res) => {
    let id = req.params.id;

    Tasks.findOne({
        where: { id: id, userID: req.userId }
    }).then(tasks => {
        if (tasks) {
            res.status(200).json(tasks);
        } else {
            res.status(200).json('ID de tarefa não encontrado');
        }
    })
});

app.put("/tarefas/:id", verifyJWT, (req, res) => {
    let id = req.params.id;
    const { titulo, descricao, status } = req.body;
    const dataAtualizacao = new Date();

    Tasks.findOne({
        where: { id: id, userID: req.userId }
    }).then(task => {
        if (task) {
            task.update({
                titulo: titulo,
                descricao: descricao,
                status: status,
                updatedAt: dataAtualizacao
            }).then(() => {
                res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Erro ao atualizar a tarefa' });
            });
        } else {
            res.status(404).json({ message: 'ID de tarefa não encontrado' });
        }
    });
});

app.delete("/tarefas/:id", verifyJWT, (req, res) => {
    let id = req.params.id;

    Tasks.findOne({
        where: { id: id, userID: req.userId }
    }).then(task => {
        if (task) {
            task.destroy().then(() => {
                res.status(200).json({ message: 'Tarefa deletada com sucesso' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Erro ao deletar a tarefa' });
            });
        } else {
            res.status(404).json({ message: 'ID de tarefa não encontrado' });
        }
    });
});

app.patch("/tarefas/:id/concluir", verifyJWT, (req, res) => {
    let id = req.params.id;
    const dataAtualizacao = new Date();

    Tasks.findOne({
        where: { id: id, userID: req.userId }
    }).then(task => {
        if (task) {
            task.update({
                status: "concluida",
                updatedAt: dataAtualizacao
            }).then(() => {
                res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
            }).catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Erro ao atualizar a tarefa' });
            });
        } else {
            res.status(200).json('ID de tarefa não encontrado');
        }
    })
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});