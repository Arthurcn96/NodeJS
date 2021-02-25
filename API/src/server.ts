import express, { request } from 'express'

const app = express()

/**
 * GET      =>  Busca
 * POST     =>  Salvar
 * PUT      =>  Alterar
 * DELETE   =>  Deletar
 * PATCH    =>  Alteração Especifica
 */

app.get("/", (request, response) => {
    return response.send("Hello World");
});

// 1 parametro => ROTA(Recurso API)
// 2 parametro => Request, Response

app.post("/",  (request, response) => {
    return response.json({message: "Os dados foram salvos com sucesso!"});
});

app.listen(3333, () => console.log("Server is Runnign!"));