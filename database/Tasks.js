const Sequelize = require("sequelize");
const connection = require("./database");

const Tasks = connection.define('tasks',{
    userID:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Tasks.sync({force: false}).then(() => {});

module.exports = Tasks;