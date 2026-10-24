import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, saveUsers, type StoredUser } from "../lib/usersStore";
import { Plus, Trash2, Shield } from "lucide-react";

export default function UsuariosPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<StoredUser[]>(getUsers());
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<"admin" | "operador">("operador");

  if (user?.rol !== "admin") {
    return <p className="text-red-600">Acceso restringido a administradores.</p>;
  }

  const agregar = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: StoredUser = { id: String(Date.now()), nombre, email, rol, password, mustChangePassword: true };
    const updated = [...usuarios, nuevo];
    setUsuarios(updated);
    saveUsers(updated);
    setNombre(""); setEmail(""); setPassword("");
  };

  const eliminar = (id: string) => {
    if (id === user.id) return alert("No puedes eliminarte a ti mismo.");
    const updated = usuarios.filter((u) => u.id !== id);
    setUsuarios(updated);
    saveUsers(updated);
  };

  const cambiarRol = (id: string, nuevoRol: "admin" | "operador") => {
    const updated = usuarios.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u));
    setUsuarios(updated);
    saveUsers(updated);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
      <form onSubmit={agregar} className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input className="border rounded px-3 py-2" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input type="password" className="border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
        </div>
        <div>
          <label className="block text-sm mb-1">Rol</label>
          <select className="border rounded px-3 py-2" value={rol} onChange={(e) => setRol(e.target.value as any)}>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={u.rol}
                    onChange={(e) => cambiarRol(u.id, e.target.value as any)}
                    disabled={u.id === user.id}
                  >
                    <option value="operador">Operador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => eliminar(u.id)}
                    disabled={u.id === user.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Solo administradores. En producción el backend Java debe hashear contraseñas (BCrypt) y no exponerlas.</p>
    </div>
  );
}
