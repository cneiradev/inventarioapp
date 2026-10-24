import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ChangePasswordModal() {
  const { mustChangePassword, changePassword, logout } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  if (!mustChangePassword) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass !== confirm) return setError("Las contraseñas no coinciden");
    if (newPass.length < 4) return setError("La nueva contraseña es muy corta");
    const ok = changePassword(oldPass, newPass);
    if (!ok) setError("La contraseña actual no es correcta");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <Lock className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-bold">Cambiar contraseña</h2>
        </div>
        <p className="text-sm text-slate-500 text-center">Primer ingreso: debes cambiar tu contraseña para continuar.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input className="w-full border rounded px-3 py-2 pr-10" type={showOld ? "text" : "password"} placeholder="Contraseña actual" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-2 top-2 text-slate-400">
              {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <input className="w-full border rounded px-3 py-2 pr-10" type={showNew ? "text" : "password"} placeholder="Nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength={4} />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-2 text-slate-400">
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <input className="w-full border rounded px-3 py-2 pr-10" type={showConfirm ? "text" : "password"} placeholder="Confirmar nueva contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={4} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2 text-slate-400">
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">Actualizar contraseña</button>
          <button type="button" onClick={logout} className="w-full text-sm text-slate-500 hover:text-slate-700">Cerrar sesión</button>
        </form>
      </div>
    </div>
  );
}