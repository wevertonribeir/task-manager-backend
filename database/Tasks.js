const Sequelize = require("sequelize");
const connection = require("./database");

const Tasks = connection.define('tasks',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Tasks.sync({force: false}).then(() => {});

module.exports = Tasks;