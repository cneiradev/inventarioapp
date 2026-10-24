export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  precio: number;
  ubicacion: string;
}

export interface Movimiento {
  id: string;
  productoId: string;
  productoNombre: string;
  tipo: "entrada" | "salida";
  cantidad: number;
  fecha: string;
  usuario: string;
  motivo: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "operador";
  mustChangePassword?: boolean;
}

export interface AlertaStock {
  producto: Producto;
  nivel: "bajo" | "critico";
}
