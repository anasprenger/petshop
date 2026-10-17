
import express from "express";
import cors from "cors";
import animaisRoutes from "./routes/animais.js";
import servicosRoutes from "./routes/servicos.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Pet Shop funcionando!" });
});

app.use("/animais", animaisRoutes);
app.use("/servicos", servicosRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
