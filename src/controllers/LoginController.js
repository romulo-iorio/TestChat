const { Request, Response } = require("express");
const db = require("../database/db.js");
const fs = require('fs');
const path = require('path');

const LoginCreateDB = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/LoginCreateDB.sql')).toString()
const LoginInsert = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/LoginInsert.sql')).toString()

class LoginController {
    createDb() {
        db.run(LoginCreateDB);
    }
    create(req, res) {
        //Prepara a referência ao diretório da imagem
        //req.body.image = path.resolve(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
        
        req.body.image = `/uploads/${req.file.filename}`;
        const values = [
            req.body.email,
            req.body.password
        ];
        function afterInsertData(err) {
            if(err){
                console.log(err);
            }else{
                console.log("Cadastrado com sucesso!");
            }
        };
        //Cria o item no db
        db.run(LoginInsert, values, afterInsertData);
    }
    index(req,res) {
        //Pegar os dados do banco de dados
        db.all(`SELECT * FROM login`, function(err, rows){
            if(err){
                return console.log(err);
            }
            return rows;
        });
    }
    show(req, res, searchParam, searchContent, loginExists){
        //Pegar os dados do banco de dados de acordo com o filtro/
        let param = loginExists;
        //console.log("Dentro do método show:", param);
        db.all(`SELECT * 
                FROM login 
                WHERE ${searchParam} 
                = \'${searchContent}\'
            `, afterOperation);

        function afterOperation(err, rows) {
            if(err){
                //console.log("Dentro do db.all: ", param);
                //console.log(err);
                param.value = "err";
            }else{
                //console.log("Dentro do db.all: ", param);
                //console.log(rows)
                param.value = rows;
            }
        }
    }
}

module.exports = LoginController;