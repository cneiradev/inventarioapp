import { useState } from "react";
import { getProductos } from "../lib/productosStore";
import type { Producto } from "../types";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";

export default function ProductosPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const [productos] = useState<Producto[]>(getProductos());
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        {isAdmin && (
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Nuevo producto
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400" />
        <input className="border rounded px-3 py-2 w-64" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Código</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-right p-3">Mínimo</th>
              <th className="text-right p-3">Precio</th>
              <th className="text-left p-3">Ubicación</th>
              {isAdmin && <th className="text-right p-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.codigo}</td>
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">{p.categoria}</td>
                <td className={`p-3 text-right ${p.stock <= p.stockMinimo ? "text-red-600 font-bold" : ""}`}>{p.stock}</td>
                <td className="p-3 text-right">{p.stockMinimo}</td>
                <td className="p-3 text-right">${p.precio.toFixed(2)}</td>
                <td className="p-3">{p.ubicacion}</td>
                {isAdmin && (
                  <td className="p-3 text-right space-x-2">
                    <button className="text-blue-600 hover:text-blue-800"><Pencil className="w-4 h-4 inline" /></button>
                    <button className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4 inline" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isAdmin && (
        <p className="text-xs text-slate-400">Como operador puedes consultar productos y registrar movimientos de entrada/salida.</p>
      )}
    </div>
  );
}
