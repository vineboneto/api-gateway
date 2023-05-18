import express from "express";

const app = express();

app.use(express.json());

app.post("/venda-suprimento/cep", (req, res) => {
  console.log("Entrei aqui");
  console.log(req.headers);
  return res.status(200).send({ cep: "12345678" });
});

app.get("/venda-suprimento/cep", (req, res) => {
  if (!req.query.cep) return res.status(400).send({ error: "informe cep" });
  console.log("Entrei aqui 2");
  return res.status(200).send({ cep: req.query?.cep });
});

app.listen(3334, () => console.log("Service running on port 3334"));
