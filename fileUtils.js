// fileUtils.js
// Utilidades de lectura/escritura con fs (sin base de datos)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "products.json");

function ensureFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
  }
}

export function readProducts() {
  ensureFile();
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  try {
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
    return [];
  }
}

export function writeProducts(products) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), "utf8");
}

export function addProduct(product) {
  const products = readProducts();
  const exists = products.some((p) => String(p.id) === String(product.id));
  if (exists) {
    throw new Error("ID ya existente");
  }
  products.push(product);
  writeProducts(products);
  return product;
}

export function updateProduct(id, newData) {
  const products = readProducts();
  const idx = products.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) {
    return null;
  }
  products[idx] = { ...products[idx], ...newData, id: products[idx].id };
  writeProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = readProducts();
  const next = products.filter((p) => String(p.id) !== String(id));
  if (next.length === products.length) {
    return false;
  }
  writeProducts(next);
  return true;
}
