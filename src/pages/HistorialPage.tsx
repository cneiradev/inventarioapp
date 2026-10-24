import { getMovimientos } from "../lib/movimientosStore";

export default function HistorialPage() {
  const movimientos = getMovimientos();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Historial de movimientos</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-right p-3">Cantidad</th>
              <th className="text-left p-3">Usuario</th>
              <th className="text-left p-3">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.fecha}</td>
                <td className="p-3">{m.productoNombre}</td>
                <td className="p-3">{m.tipo}</td>
                <td className="p-3 text-right">{m.cantidad}</td>
                <td className="p-3">{m.usuario}</td>
                <td className="p-3">{m.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

