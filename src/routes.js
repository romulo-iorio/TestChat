const path = require('path'); //Importando o path para usar para caminhos das imagens
const express = require('express');
const MessagesController = require("./controllers/MessagesController"); //Importar a classe DbController
const UserController = require("./controllers/UserController"); //Importar a classe DbController
const LoginController = require("./controllers/LoginController"); //Importar a classe DbController
const multer = require('multer'); //Configuração do multer para upload de arquivos
const bodyParser = require('body-parser'); //cleans our req.body

//Declaração de objetos e configurações
const routes = express.Router();
const messagesController = new MessagesController(); //Criar o objeto para fazer as operações no banco de dados
const userController = new UserController(); //Criar o objeto para fazer as operações no banco de dados
const loginController = new LoginController(); //Criar o objeto para fazer as operações no banco de dados
const multerConfig = { //MULTER CONFIG: to get file photos to temp server storage  
    
    storage: multer.diskStorage({
        //Setup where the user's file will go
        destination: function(req, file, next){
            next(null, './publico/uploads');
        },   
        
        //Then give the file a unique name
        filename: function(req, file, next){
            //console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, file.fieldname + '-' + Date.now() + '.'+ext);
        }
    }),   
    
    //A means of ensuring only images are uploaded. 
    fileFilter: function(req, file, next){
        if(!file){
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if(image){
            console.log('Photo uploaded');
            next(null, true);
        }else{
            console.log("File not supported");
            
            //TODO:  A better message response to user on failure.
            return next();
        }
    }
};
routes.use(bodyParser.urlencoded({extended:false})); //Habilitar o uso do req.body //handle body requests
routes.use(bodyParser.json()); // let's make JSON work too!

let loggedUser = {value: 0};

//Inicialização do bancos de dados e criação das entidades, se ainda não tiverem sido criadas
messagesController.createDb();
userController.createDb();
loginController.createDb();

//Configuração de rotas
routes.get('/', (req, res) => {
    const login = loginController.index(req,res);
    return res.render(path.resolve(__dirname + '/../publico/views/login.html'), { login });
});

routes.get('/chat', (req, res) => {
    return res.render(path.resolve(__dirname + '/../publico/views/chat.html'));
});

routes.get('/registration', (req, res) => {
    const login = loginController.index(req,res);
    return res.render(path.resolve(__dirname + '/../publico/views/registration.html'), { login });
});

routes.get('/profile', (req, res) => {
    return res.render(path.resolve(__dirname + '/../publico/views/profile.html'), {loggedUser: loggedUser.value[0]});
});

routes.get('/registration-completed', (req, res) => {
    return res.render(path.resolve(__dirname + '/../publico/views/registration-completed.html'));
});

routes.post('/registration', multer(multerConfig).single('image'), (req, res) => {
    req.body.image = path.resolve(__dirname + `/../../publico/uploads/${req.file.filename}`);

    let loginExists = {value: 0}, userExists = {value: 0};
    
    loginController.show(req,res,'email',req.body.email,loginExists);
    userController.show(req,res,'nickname',req.body.nickname, userExists);
    
    //userController.show(req,res,'email',req.body.email)
    setTimeout(() => {
        //console.log(req.body);
        //console.log("No tratamento da requisição post: ", loginExists.value);
        //console.log("No tratamento da requisição post: ", userExists.value);
        //console.log(userExists);
        if((loginExists.value == "") && (userExists.value == "")){
            console.log("Sucesso!")
            loginController.create(req,res);
            userController.create(req,res);
            return res.render(path.resolve(__dirname + '/../publico/views/registration-completed.html'));
        }else if((loginExists.value != "") && (userExists.value != "")){
            console.log("E-mail e Nickname já existentes");
            return res.render(path.resolve(__dirname + '/../publico/views/registration.html'), { loginError: true, userError: true });
        }else if(userExists.value != ""){ //houve erro no user
            console.log("Nickname já existente");
            return res.render(path.resolve(__dirname + '/../publico/views/registration.html'), { userError: true });
        }else if(loginExists.value != ""){ //houve erro no login
            console.log("E-mail já existente");
            return res.render(path.resolve(__dirname + '/../publico/views/registration.html'), { loginError: true });
        }
    },20);
});

routes.post('/login', multer(multerConfig).single('image'), (req, res) => {
    let loginExists = {value: 0};
    
    loginController.show(req,res,'email',req.body.email,loginExists);
    userController.show(req,res,'email',req.body.email,loggedUser)
    
    //userController.show(req,res,'email',req.body.email)
    setTimeout(() => {
        if((loginExists.value != "") && (req.body.password == loginExists.value[0].senha)){
            console.log("Sucesso!")
            return res.render(path.resolve(__dirname + '/../publico/views/profile.html'), {loggedUser: loggedUser.value[0]});
        }else if(loginExists.value == ""){ //houve erro no user
            console.log("E-mail não encontrado");
            return res.render(path.resolve(__dirname + '/../publico/views/login.html'), { emailError: true });
        }else if(req.body.password != loginExists.value.senha){ //houve erro no login
            console.log("Senha incorreta");
            return res.render(path.resolve(__dirname + '/../publico/views/login.html'), { passwordError: true });
        }
    },20);
});

routes.post('/change-photo', multer(multerConfig).single('image'), (req, res) => {
    req.body.image = path.resolve(__dirname + `/../../publico/uploads/${req.file.filename}`);
    console.log(loggedUser.value[0].nickname);
    userController.update(req,res,'image',req.body.image,loggedUser.value[0].nickname);
    setTimeout(() => {
        return res.render(path.resolve(__dirname + '/../publico/views/profile.html'), {loggedUser: loggedUser.value[0]});
    }, 20);
});

routes.get('/manifest.json',(req, res) =>{
    return res.sendFile(path.resolve(__dirname + '/../manifest.json'));
});

routes.get('/service-worker.js',(req, res) =>{
    return res.sendFile(path.resolve(__dirname + '/../publico/service-worker.js'));
});


//The 404 Route (ALWAYS Keep this as the last route)
//routes.get('*', (req, res) => {res.status(404).render('page-404.html');});
//Exportação do arquivo para ser usado no server.js
module.exports = routes; 