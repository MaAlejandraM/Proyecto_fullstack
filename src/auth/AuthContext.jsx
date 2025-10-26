import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USERS_KEY = 'usuarios';
const SESSION_KEY = 'usuarioLogeado';

const usuarioAdmin = {
    nombre: "gabriel grobier",
    correoElectronico: "admin@bienestar.com",
    password: "gabo123ñ"
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (raw) {
                try {
                    setUser(JSON.parse(raw));
                } catch (e) {
                    console.error("No se pudo cargar la sesión", e);
                    localStorage.removeItem(SESSION_KEY);
                }
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsers = () => {
        const raw = localStorage.getItem(USERS_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("Error al leer usuarios de localStorage", e); 
            return []; 
        }
    };

    const saveUsers = (list) => {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(list));
            return true;
        } catch (e) {
            console.error("Error al guardar usuarios en localStorage", e); 
            throw e;
        }
    };

    const saveSession = (sessionObj) => {
        try {
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
            return true;
        } catch (e) {
            console.error('Error al guardar sesión en localStorage', e); 
            throw e;
        }
    };

    const removeSession = () => {
        try {
            localStorage.removeItem(SESSION_KEY);
            return true;
        } catch (e) {
            console.error('Error al eliminar sesión de localStorage', e); 
            return false;
        }
    };

    const register = ({ nombreCompleto, correoElectronico, password }) => {
        return new Promise((resolve, reject) => {
            const users = getUsers();
            const exists = users.some(u => u.correoElectronico === correoElectronico);

            if (exists) {
                reject(new Error("El correo ingresado ya está registrado"));
                return;
            }

            users.push({ nombreCompleto, correoElectronico, password1: password });
            saveUsers(users);

            const sessionUser = {
                nombre: nombreCompleto,
                correo: correoElectronico,
                estado: true
            };
            try {
                saveSession(sessionUser);
                setUser(sessionUser);
                resolve(sessionUser);
            } catch (e) {
                 console.error("Error al guardar sesión post-registro", e); 
                 reject(new Error("Error al guardar la sesión. Intenta iniciar sesión manualmente."));
            }
        });
    };


    const login = ({ email, password }) => {
        return new Promise((resolve, reject) => {
            if (email === usuarioAdmin.correoElectronico && password === usuarioAdmin.password) {
                const sessionUser = {
                    nombre: usuarioAdmin.nombre,
                    correo: usuarioAdmin.correoElectronico,
                    estado: true,
                    isAdmin: true
                };
              try {
                saveSession(sessionUser);
                setUser(sessionUser);
                resolve(sessionUser);
             } catch (e) {
                 console.error("Error al guardar sesión admin", e); 
                 reject(new Error("Error al guardar la sesión del administrador."));
             }
                return;
            }

            const users = getUsers();
            const match = users.find(u => u.correoElectronico === email && u.password1 === password);

            if (!match) {
                reject(new Error("Correo o contraseña incorrectos"));
                return;
            }

            const sessionUser = {
                nombre: match.nombreCompleto,
                correo: match.correoElectronico,
                estado: true
            };
            try {
                saveSession(sessionUser);
                setUser(sessionUser);
                resolve(sessionUser);
            } catch (e) {
                 console.error("Error al guardar sesión usuario", e); 
                 reject(new Error("Error al guardar la sesión."));
            }
        });
    };

    const logout = () => {
        const ok = removeSession();
        if (!ok) {
            console.warn('No se pudo eliminar la sesión del almacenamiento local'); 
        }
        setUser(null);
    };

    const updateProfile = ({ nombreCompleto, correoElectronico, password }) => {
        return new Promise((resolve, reject) => {
            if (!user) {
                reject(new Error('Usuario no autenticado'));
                return;
            }

            if (user.isAdmin) {
                const updatedAdmin = {
                    ...user,
                    nombre: nombreCompleto ?? user.nombre,
                    correo: correoElectronico ?? user.correo
                };
                try {
                    saveSession(updatedAdmin);
                    setUser(updatedAdmin);
                    resolve(updatedAdmin);
                } catch (e) {
                    console.error('Error al actualizar sesión admin', e); 
                    reject(new Error('No se pudo actualizar el perfil del administrador'));
                }
                return;
            }

            const users = getUsers();
            const idx = users.findIndex(u => u.correoElectronico === user.correo);
            if (idx === -1) {
                reject(new Error('Usuario no encontrado en la base local'));
                return;
            }

            if (correoElectronico && correoElectronico !== users[idx].correoElectronico) {
                const exists = users.some((u, i) => i !== idx && u.correoElectronico === correoElectronico);
                if (exists) {
                    reject(new Error('El correo ingresado ya está en uso'));
                    return;
                }
            }

            if (nombreCompleto) users[idx].nombreCompleto = nombreCompleto;
            if (correoElectronico) users[idx].correoElectronico = correoElectronico;
            if (password) users[idx].password1 = password;

            try {
                saveUsers(users);
            } catch (e) {
                console.error('Error al guardar usuarios actualizados', e); 
                reject(new Error('No se pudo guardar los cambios en el usuario'));
                return;
            }

            const sessionUser = {
                nombre: users[idx].nombreCompleto,
                correo: users[idx].correoElectronico,
                estado: true
            };
            try {
                saveSession(sessionUser);
                setUser(sessionUser);
                resolve(sessionUser);
            } catch (e) {
                console.error('Error al actualizar sesión después de editar perfil', e); 
                reject(new Error('No se pudo actualizar la sesión del usuario'));
            }
        });
    };

    const value = { user, loading, register, login, logout, updateProfile };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}