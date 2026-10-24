import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Package, LogOut, LayoutDashboard, Boxes, ArrowLeftRight, History, AlertTriangle, FileText, Users } from "lucide-react";
import ChangePasswordModal from "../ChangePasswordModal";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Boxes },
  { to: "/movimientos", label: "Movimientos", icon: ArrowLeftRight },
  { to: "/alertas", label: "Alertas Stock", icon: AlertTriangle },
  { to: "/reportes", label: "Reportes", icon: FileText },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user?.rol === "admin" ? [...nav, { to: "/historial", label: "Historial", icon: History }, { to: "/usuarios", label: "Usuarios", icon: Users }] : nav;
  return (
    <>
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-slate-700">
          <Package className="w-6 h-6 text-emerald-400" />
          <span className="font-bold text-lg">InventarioApp</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {items.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? "bg-emerald-600" : "hover:bg-slate-800"}`
              }
            >
              <n.icon className="w-4 h-4" /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">{user?.nombre} ({user?.rol})</div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
    <ChangePasswordModal />
    </>
  );
}
