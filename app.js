const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
//A FAZER: LER SOBRE CORS errors no mozilla 

//Criamos o diretorio das rotas e aq vamos chamar uma rota
const rotaProdutos = require("./routes/produtos");
const rotaPedidos = require("./routes/pedidos");

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended: false})); // apenas dados simples

app.use(bodyParser.json()) // SO VAI ACEITAR JSON DE ENTRADA NO BODY;


app.use((req, res, next) => {
    //Permisissao de origem do acesso
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Header", 
        "Origin, X-Requrested-With, Content-Type, Accept, Authorization"
    ); //SERVE PARA API IDENTIFICAR QUAIS TIPOS DE OPCOES QUE SAO ACEITAS

    if (req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).send();
    }
    next();

});

//MORGAN VAI SERVIR PRA RETORNAR UM LOG DA APLICACAO
app.use("/produtos", rotaProdutos);
app.use("/pedidos", rotaPedidos);

// > Quando nao encontra rota, entra aqui:
app.use((req, res, next) => {
    const erro = new Error("Não encontrado");
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
})

module.exports = app;
