// server.js
// Servidor Express con rutas CRUD sobre products.json

import express from "express";
import {
  readProducts,
  writeProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./fileUtils.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/products", (req, res) => {
  const { id, name, price, quantity } = req.body || {};

  if (id === undefined || name === undefined || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: "Faltan campos: id, name, price, quantity" });
  }

  const product = {
    id,
    name: String(name),
    price: Number(price),
    quantity: Number(quantity),
  };

  if (Number.isNaN(product.price) || Number.isNaN(product.quantity)) {
    return res.status(400).json({ error: "price y quantity deben ser numéricos" });
  }

  try {
    const created = addProduct(product);
    return res.status(201).json(created);
  } catch (e) {
    return res.status(409).json({ error: e.message });
  }
});

app.get("/products", (_req, res) => {
  const products = readProducts();
  res.json(products);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body || {};

  const updates = {};
  if (name !== undefined) updates.name = String(name);
  if (price !== undefined) {
    const num = Number(price);
    if (Number.isNaN(num)) return res.status(400).json({ error: "price debe ser numérico" });
    updates.price = num;
  }
  if (quantity !== undefined) {
    const num = Number(quantity);
    if (Number.isNaN(num)) return res.status(400).json({ error: "quantity debe ser numérico" });
    updates.quantity = num;
  }

  const updated = updateProduct(id, updates);
  if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(updated);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const ok = deleteProduct(id);
  if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
