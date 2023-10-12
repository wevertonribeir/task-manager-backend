const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const Tasks = require("./database/Tasks");

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


// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});