import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProductos, updateStock } from "../lib/productosStore";
import type { Producto } from "../types";
import { addMovimiento } from "../lib/movimientosStore";
import jsPDF from "jspdf";
import { Search, Trash2, FileDown } from "lucide-react";

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export default function MovimientosPage() {
  const { user } = useAuth();
  const productos = getProductos();
  const [tipo, setTipo] = useState<"entrada" | "salida">("salida");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [motivo, setMotivo] = useState("");

  const resultados = productos.filter(
    (p) =>
      busqueda.length > 0 &&
      (p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const agregarProducto = (p: Producto) => {
    if (carrito.find((i) => i.producto.id === p.id)) return;
    setCarrito([...carrito, { producto: p, cantidad: 1 }]);
    setBusqueda("");
  };

  const actualizarCantidad = (id: string, cant: number) => {
    const item = carrito.find((i) => i.producto.id === id);
    if (!item) return;
    let nuevo = Math.max(1, cant);
    if (tipo === "salida" && nuevo > item.producto.stock) {
      nuevo = item.producto.stock;
      alert("No puedes retirar mas de " + item.producto.stock + " unidades de " + item.producto.nombre);
    }
    setCarrito(carrito.map((i) => (i.producto.id === id ? { ...i, cantidad: nuevo } : i)));
  };

  const quitar = (id: string) => {
    setCarrito(carrito.filter((i) => i.producto.id !== id));
  };

  const limpiar = () => {
    setCarrito([]);
    setMotivo("");
    setBusqueda("");
  };

  const confirmar = () => {
    if (carrito.length === 0) return alert("Agrega al menos un producto.");
    if (tipo === "salida") {
      const exceso = carrito.find((i) => i.cantidad > i.producto.stock);
      if (exceso) return alert("Cantidad supera stock disponible para " + exceso.producto.nombre);
    }
    const fecha = new Date().toISOString().slice(0, 10);
    carrito.forEach((item) => {
      addMovimiento({
        id: String(Date.now()) + item.producto.id,
        productoId: item.producto.id,
        productoNombre: item.producto.nombre,
        tipo,
        cantidad: item.cantidad,
        fecha,
        usuario: user?.nombre || "desconocido",
        motivo: motivo || (tipo === "entrada" ? "Ingreso a bodega" : "Retiro de bodega"),
      });
      updateStock(item.producto.id, tipo === "entrada" ? item.cantidad : -item.cantidad);
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    // Encabezado
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INVENTARIOAPP", 14, 12);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Registro de Movimiento de Bodega", 14, 21);

    // Datos generales
    doc.setTextColor(0, 0, 0);
    let y = 38;
    doc.setFontSize(10);
    const line = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 50, y);
      y += 6;
    };
    line("Tipo:", tipo === "entrada" ? "ENTRADA (llegada a bodega)" : "SALIDA (retiro de bodega)");
    line("Fecha:", fecha);
    line("Usuario:", user?.nombre || "-");
    line("Motivo:", motivo || "-");
    line("Total items:", String(carrito.length));

    // Tabla
    y += 4;
    doc.setFillColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.text("#", 16, y + 5.5);
    doc.text("Codigo/SKU", 24, y + 5.5);
    doc.text("Producto", 60, y + 5.5);
    doc.text("Cantidad", pageWidth - 30, y + 5.5);
    y += 8;

    doc.setFont("helvetica", "normal");
    let totalCantidad = 0;
    carrito.forEach((item, idx) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(String(idx + 1), 16, y + 5);
      doc.text(item.producto.codigo, 24, y + 5);
      doc.text(item.producto.nombre.slice(0, 40), 60, y + 5);
      doc.text(String(item.cantidad), pageWidth - 30, y + 5);
      // linea
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y + 8, pageWidth - 14, y + 8);
      y += 9;
      totalCantidad += item.cantidad;
    });

    // Total
    y += 2;
    doc.setFont("helvetica", "bold");
    doc.text("Total unidades:", 14, y + 5);
    doc.text(String(totalCantidad), pageWidth - 30, y + 5);

    // Pie
    const footerY = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Documento generado automaticamente por InventarioApp", 14, footerY);

    doc.save("movimiento_" + tipo + "_" + fecha + ".pdf");

    alert("Movimiento registrado y PDF generado.");
    limpiar();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Registrar movimiento</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Tipo</label>
            <select className="border rounded px-3 py-2" value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
              <option value="entrada">Entrada (llegada a bodega)</option>
              <option value="salida">Salida (retiro de bodega)</option>
            </select>
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className="block text-sm mb-1">Buscar producto (codigo o nombre)</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                className="border rounded pl-9 pr-3 py-2 w-full"
                placeholder="Escribe codigo o nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {resultados.length > 0 && (
                <div className="absolute z-10 bg-white border rounded shadow w-full mt-1 max-h-48 overflow-auto">
                  {resultados.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => agregarProducto(p)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm flex justify-between"
                    >
                      <span>{p.codigo} - {p.nombre}</span>
                      <span className="text-slate-400">stock: {p.stock}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Motivo</label>
            <input className="border rounded px-3 py-2" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-bold">Detalle del movimiento</h2>
          <button onClick={limpiar} className="text-sm text-red-600 hover:text-red-800">Limpiar campos</button>
        </div>

        <div className="overflow-hidden rounded border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Codigo/SKU</th>
                <th className="text-left p-3">Nombre producto</th>
                <th className="text-right p-3">Cantidad</th>
                <th className="text-right p-3">Accion</th>
              </tr>
            </thead>
            <tbody>
              {carrito.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-400">Sin productos agregados</td>
                </tr>
              )}
              {carrito.map((item) => (
                <tr key={item.producto.id} className="border-t">
                  <td className="p-3">{item.producto.codigo}</td>
                  <td className="p-3">{item.producto.nombre}</td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-2 py-1 w-20 text-right"
                      value={item.cantidad}
                      onChange={(e) => actualizarCantidad(item.producto.id, Number(e.target.value))}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => quitar(item.producto.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            onClick={confirmar}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
          >
            <FileDown className="w-4 h-4" /> Confirmar y generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
