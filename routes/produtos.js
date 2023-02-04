const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

//RETORNA TODOS OS PRODUTOS;
router.get("/", (req, res, next) => {
    // res.status(200).send({
    //     mensagem: "Retorna todos produtos"
    // });

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query(
            //VAI ME RETORNAR TODOS OS PRODUTOS
            "SELECT * FROM produtos",
            //CALLBACK DE QUANDO RODA O SQL
            (error, result, fields) => {
                if(error) { return res.status(500).send({error: error}) }
                //BOAS PRATICAS
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: "GET",
                                descricao: "Retorna todos os produtos",
                                url: "http://localhost:3000/produtos/" + prod.id_produto
                            }
                        }
                    })
                };
                return res.status(200).send(response);
            }
        )
    })
});

//INSERE UM PRODUTO
router.post("/", (req, res, next) => {
   
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query(
            "INSERT INTO produtos (nome, preco) VALUES(?,?)",
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                //IMPORTANTISSIMO
                conn.release();
                if(error) { return res.status(500).send({error: error}) }
                const response = {
                    mensagem: "Produto inserido com sucesso",
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: result.nome,
                        preco: result.preco,
                        request: {
                            tipo: "GET",
                            descricao: "Insere um produto",
                            url: "http://localhost:3000/produtos/"
                        }
                    } 
                }
                return res.status(201).send(response);
            }
        )
    });
    
});

//RETORNA OS DADOS DE UM PRODUTO;
router.get("/:id_produto", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query(
            //VAI ME RETORNAR UM PRODUTO ESPECIFICO

            "SELECT * FROM produtos WHERE id_produto = ?;",
            //O PONTO DE INTERROGAÇÃO É SUBSTITUIDO PELOS VALORES DO ARRAY DA LINHA DE BAIXO
            [req.params.id_produto],
            //CALLBACK DE QUANDO RODA O SQL
            (error, result, fields) => {
                if(error) { return res.status(500).send({error: error}) }
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado um produto com este ID"
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: "POST",
                            descricao: "Retorna um produto",
                            url: "http://localhost:3000/produtos/"
                        }
                    } 
                }
                return res.status(201).send(response);
            }
        )
    })
});

//ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query(
            `UPDATE produtos
                SET nome        = ?,
                    preco       = ?
             WHERE id_produto   = ?`,
            [
                req.body.nome, 
                req.body.preco, 
                req.body.id_produto
            ],
            (error, result, field) => {
                //IMPORTANTISSIMO
                conn.release();
                if(error) { return res.status(500).send({error: error}) }

                res.status(202).send({
                    mensagem: "Produto alterado com sucesso!",
                });
            }
        )
    })
});
//EXCLUI UM PRODUTO;
router.delete("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({error: error}) }
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [
                req.body.id_produto
            ],
            (error, result, field) => {
                //IMPORTANTISSIMO
                conn.release();
                if(error) { return res.status(500).send({error: error}) }

                res.status(202).send({
                    mensagem: "Produto removido com sucesso!",
                });
            }
        )
    })
});

module.exports = router;