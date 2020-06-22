const { Request, Response } = require("express");
const db = require("../database/db.js");
const fs = require('fs');
const path = require('path');

const MessagesCreateDB = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/MessagesCreateDB.sql')).toString()
const MessagesInsert = fs.readFileSync(path.resolve(__dirname + '/SQLfiles/MessagesInsert.sql')).toString()

class MessagesController {
    createDb() {
        db.run(MessagesCreateDB);
    }
    create(req, res) {
        //Prepara a referência ao diretório da imagem
        //req.body.image = path.resolve(__dirname, '..', '..', 'public', 'uploads', req.file.filename);
        req.body.image = `/uploads/${req.file.filename}`;
        const values = [
            req.body.message,
            req.body.email,
            req.body.date,
        ];
        function afterInsertData(err) {
            if(err){
                console.log(err);
                return "error";
            }
            // console.log("Cadastrado com sucesso!");
            // console.log(this);

            //return res.json("ok");
            return "saved";
        };
        //Cria o item no db
        db.run(MessagesInsert, values, afterInsertData);
    }
    index(req,res) {
        //Pegar os dados do banco de dados
        db.all(`SELECT * FROM messages`, function(err, rows){
            if(err){
                return console.log(err);
            }
            return rows;
        });
    }
    show(req, res, searchParam, searchContent){
        //Pegar os dados do banco de dados de acordo com o filtro
        db.all(`SELECT * 
                FROM messages 
                WHERE ${searchParam} 
                LIKE '%${searchContent}%'
            `, function(err, rows){
            if(err){
                return console.log(err);
            }
            return rows;
        });
    }
}

module.exports = MessagesController;