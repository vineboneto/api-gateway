import express from "express";

const app = express();

app.use(express.json());

app.post("/venda-suprimento/cep", (req, res) => {
  return res.status(200).send({ cep: "87654321" });
});

app.get("/venda-suprimento/cep", (req, res) => {
  if (!req.query.cep) return res.status(400).send({ error: "informe cep" });
  console.log("Entrei aqui 2");
  return res.status(200).send({ cep: req.query?.cep });
});

app.listen(3335, () => console.log("Service 1 running on port 3335"));
