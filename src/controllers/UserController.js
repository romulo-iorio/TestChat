const { Request, Response } = require("express");
const db = require("../database/db.js");
const fs = require('fs');
const path = require('path');

const UserCreateDB = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/UserCreateDB.sql')).toString()
const UserInsert = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/UserInsert.sql')).toString()

class UserController {
    createDb() {
        db.run(UserCreateDB);
    }
    create(req, res) {
        //Prepara a referência ao diretório da imagem
        //req.body.image = path.resolve(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
        req.body.image = `/uploads/${req.file.filename}`;
        const values = [
            req.body.email,
            req.body.name,
            req.body.nickname,
            req.body.gender,
            req.body.birthday,
            req.body.image,
        ];
        function afterInsertData(err) {
            if(err){
                console.log(err);
            }else{
                console.log("Cadastrado com sucesso!");
            }
        };
        //Cria o item no db
        db.run(UserInsert, values, afterInsertData);
    }
    index(req,res) {
        //Pegar os dados do banco de dados
        db.all(`SELECT * FROM user`, function(err, rows){
            if(err){
                return console.log(err);
            }
            return rows;
        });
    }
    show(req, res, searchParam, searchContent, userExists){
        let param = userExists;
        //console.log("Dentro do método show:", param);
        db.all(`SELECT * 
                FROM user 
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
    update(req, res, updateParam, updateContent, nickname){
        db.all(`UPDATE user
                SET \'${updateParam}\' = \'${updateContent}\'
                WHERE nickname = \'${nickname}\'       
        `, afterOperation);

        function afterOperation(err) {
            if(err){
                console.log(err);
                return "err";
            }
        }
    }
}

module.exports = UserController;