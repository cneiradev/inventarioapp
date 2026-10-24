import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [changeMode, setChangeMode] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const { login, mustChangePassword, changePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      if (mustChangePassword) setChangeMode(true);
      else navigate("/");
    } else setError("Credenciales inválidas");
  };

  const handleChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPass !== confirm) return setError("Las contraseñas no coinciden");
    if (newPass.length < 4) return setError("La nueva contraseña es muy corta");
    const ok = changePassword(oldPass, newPass);
    if (ok) navigate("/");
    else setError("La contraseña actual no es correcta");
  };

  if (changeMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <form onSubmit={handleChange} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Package className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold">Cambiar contraseña</h1>
          </div>
          <p className="text-sm text-slate-500 text-center">Primer ingreso: debes cambiar tu contraseña.</p>
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Contraseña actual" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Nueva contraseña" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <input className="w-full border rounded px-3 py-2" type="password" placeholder="Confirmar nueva contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">Actualizar contraseña</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 space-y-4">
        <div className="flex items-center gap-2 justify-center mb-4">
          <Package className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold">InventarioApp</h1>
        </div>
        <p className="text-sm text-slate-500 text-center">admin@inventario.com / admin123</p>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input className="w-full border rounded px-3 py-2 pr-10" type={show ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-2 text-slate-400">
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">Ingresar</button>
      </form>
    </div>
  );
}