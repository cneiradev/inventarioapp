import type { Movimiento } from "../types";

const KEY = "inventario_movimientos";

export function getMovimientos(): Movimiento[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const seed: Movimiento[] = [
      { id: "m1", productoId: "1", productoNombre: "Tornillo 1/4", tipo: "entrada", cantidad: 100, fecha: "2026-10-20", usuario: "admin", motivo: "Compra proveedor" },
      { id: "m2", productoId: "2", productoNombre: "Martillo", tipo: "salida", cantidad: 2, fecha: "2026-10-22", usuario: "operador", motivo: "Venta" },
    ];
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(raw);
}

export function saveMovimientos(movs: Movimiento[]) {
  localStorage.setItem(KEY, JSON.stringify(movs));
}

export function addMovimiento(mov: Movimiento) {
  const list = getMovimientos();
  list.unshift(mov);
  saveMovimientos(list);
}
