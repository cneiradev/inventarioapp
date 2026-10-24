import { productosMock, movimientosMock } from "../lib/mockData";

export default function DashboardPage() {
  const totalProductos = productosMock.length;
  const stockTotal = productosMock.reduce((a, p) => a + p.stock, 0);
  const alertas = productosMock.filter((p) => p.stock <= p.stockMinimo).length;
  const movHoy = movimientosMock.length;

  const cards = [
    { label: "Productos", value: totalProductos },
    { label: "Stock total", value: stockTotal },
    { label: "Alertas stock", value: alertas },
    { label: "Movimientos", value: movHoy },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow p-6">
            <div className="text-slate-500 text-sm">{c.label}</div>
            <div className="text-3xl font-bold mt-2">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-bold mb-3">Últimos movimientos</h2>
        <ul className="divide-y">
          {movimientosMock.map((m) => (
            <li key={m.id} className="py-2 flex justify-between text-sm">
              <span>{m.productoNombre} - {m.tipo}</span>
              <span className="text-slate-500">{m.fecha} ({m.cantidad})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
