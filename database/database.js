const Sequelize = require("sequelize");
const connection = new Sequelize('apirest','test','zuk2Ne',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;