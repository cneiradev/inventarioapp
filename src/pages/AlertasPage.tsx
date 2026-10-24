import { productosMock } from "../lib/mockData";

export default function AlertasPage() {
  const alertas = productosMock.filter((p) => p.stock <= p.stockMinimo);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Alertas de stock mínimo</h1>
      {alertas.length === 0 ? (
        <p className="text-slate-500">Sin alertas.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Producto</th>
                <th className="text-right p-3">Stock actual</th>
                <th className="text-right p-3">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.codigo}</td>
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3 text-right text-red-600 font-bold">{p.stock}</td>
                  <td className="p-3 text-right">{p.stockMinimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
