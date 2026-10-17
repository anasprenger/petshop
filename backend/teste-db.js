
import db from "./db.js";

try {
  const [resultado] = await db.query("SELECT 1 AS conectado");
  console.log("MySQL conectado:", resultado[0].conectado);
} catch (erro) {
  console.error("Erro ao conectar ao MySQL:", erro.message);
} finally {
  await db.end();
}

