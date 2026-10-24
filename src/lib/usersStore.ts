import type { Usuario } from "../types";

interface StoredUser extends Usuario {
  password: string;
  mustChangePassword?: boolean;
}

const KEY = "inventario_users";

const defaultUsers: StoredUser[] = [
  { id: "1", nombre: "Administrador", email: "admin@inventario.com", rol: "admin", password: "admin123", mustChangePassword: false },
  { id: "2", nombre: "Operador", email: "operador@inventario.com", rol: "operador", password: "op123", mustChangePassword: true },
];

export function getUsers(): StoredUser[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(raw);
}

export function saveUsers(users: StoredUser[]) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function findUser(email: string, password: string): StoredUser | undefined {
  return getUsers().find((u) => u.email === email && u.password === password);
}

export function changePassword(email: string, oldPassword: string, newPassword: string): boolean {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email === email && u.password === oldPassword);
  if (idx === -1) return false;
  users[idx].password = newPassword;
  users[idx].mustChangePassword = false;
  saveUsers(users);
  return true;
}

export type { StoredUser };