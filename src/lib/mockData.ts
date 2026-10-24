import type { Producto, Movimiento } from "../types";

export const productosMock: Producto[] = [
  { id: "1", codigo: "P001", nombre: "Tornillo 1/4", descripcion: "Tornillo acero", categoria: "Ferretería", stock: 120, stockMinimo: 20, precio: 0.5, ubicacion: "A1" },
  { id: "2", codigo: "P002", nombre: "Martillo", descripcion: "Martillo 16oz", categoria: "Herramientas", stock: 8, stockMinimo: 10, precio: 12.5, ubicacion: "B2" },
  { id: "3", codigo: "P003", nombre: "Pintura blanca 1L", descripcion: "Pintura látex", categoria: "Pinturas", stock: 25, stockMinimo: 5, precio: 8.0, ubicacion: "C3" },
];

export const movimientosMock: Movimiento[] = [
  { id: "m1", productoId: "1", productoNombre: "Tornillo 1/4", tipo: "entrada", cantidad: 100, fecha: "2026-10-20", usuario: "admin", motivo: "Compra proveedor" },
  { id: "m2", productoId: "2", productoNombre: "Martillo", tipo: "salida", cantidad: 2, fecha: "2026-10-22", usuario: "operador", motivo: "Venta" },
];
