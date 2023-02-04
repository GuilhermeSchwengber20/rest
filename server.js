const http = require("http"); //importando http para o projet
const app = require("./app");
const port = process.env.PORT || 3000 //CONFIGURANDO PORTA DA API
const server = http.createServer(app);
server.listen(port);





