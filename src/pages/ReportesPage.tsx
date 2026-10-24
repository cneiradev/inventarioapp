import { productosMock, movimientosMock } from "../lib/mockData";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default function ReportesPage() {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Inventario", 10, 10);
    let y = 20;
    productosMock.forEach((p) => {
      doc.text(`${p.codigo} - ${p.nombre}: ${p.stock}`, 10, y);
      y += 8;
    });
    doc.save("inventario.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productosMock);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, "inventario.xlsx");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reportes</h1>
      <div className="flex gap-4">
        <button onClick={exportPDF} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          <FileDown className="w-4 h-4" /> Exportar PDF
        </button>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <FileDown className="w-4 h-4" /> Exportar Excel
        </button>
      </div>
      <p className="text-slate-500 text-sm">Productos: {productosMock.length} | Movimientos: {movimientosMock.length}</p>
    </div>
  );
}
