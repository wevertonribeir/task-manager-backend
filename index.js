const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./database/database");
const Tasks = require("./database/Tasks");

const port = 8484;

// Estou dizendo para o Express usar o EJS como o VIEW Engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
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
        res.render("index", {
            tasks: tasks,
        });
    });
});


// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});