const express = require("express");
const router = express.Router();



//RETORNA TODOS OS PEDIDOS;
router.get("/", (req, res, next) => {
    res.status(200).send({
        mensagem: "Retorna os pedidos"
    });
});

//INSERE UM PEDIDO
router.post("/", (req, res, next) => {
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
    }
    res.status(201).send({
        mensagem: "O pedido foi criado",
        pedidoCriado: pedido
    })
});

//RETORNA OS DADOS DE UM PEDIDO;
router.get("/:id_pedido", (req, res, next) => {
    const id = req.params.id_produto; // pega como parametro da req
    
    if (id == "especial"){
        res.status(200).send({
            mensagem: "Detalhes do pedido",
            id: id
        });    
    } else {
        res.status(200).send({
            mensagem: "Pedido excluido",
        });
    }
});

//EXCLUI UM PEDIDO
router.delete("/", (req, res, next) => {
    res.status(201).send({
        mensagem: "Pedido excluido"
    });
});

module.exports = router;