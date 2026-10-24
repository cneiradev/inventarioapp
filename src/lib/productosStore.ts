import type { Producto } from "../types";
import { productosMock } from "./mockData";

const KEY = "inventario_productos";

export function getProductos(): Producto[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(productosMock));
    return productosMock;
  }
  return JSON.parse(raw);
}

export function saveProductos(prods: Producto[]) {
  localStorage.setItem(KEY, JSON.stringify(prods));
}

export function updateStock(productoId: string, delta: number) {
  const prods = getProductos();
  const updated = prods.map((p) =>
    p.id === productoId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
  );
  saveProductos(updated);
  return updated;
}
