const path = require('path');

//importar a dependencia do sqlite3
const sqlite3 = require('sqlite3').verbose();
//Criar o objeto que irá fazer operações no banco de dados
const db = new sqlite3.Database(path.resolve(__dirname + "/database.db"))

module.exports = db;