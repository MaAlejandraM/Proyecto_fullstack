import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Form, Button, Alert, Spinner } from 'react-bootstrap'; 

export default function Perfil() {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({ nombre: '', correo: '', password: '', passwordConfirm: '' });
    const [isEditing, setIsEditing] = useState(false); 
    const [message, setMessage] = useState('');
    const [messageVariant, setMessageVariant] = useState('success');
    const [saving, setSaving] = useState(false);
    const [bio, setBio] = useState('');
    const [historial, setHistorial] = useState([]);
    

    useEffect(() => {
        if (user) {
            setForm({
                nombre: user.nombre || '',
                correo: user.correo || '',
                password: '',
                passwordConfirm: ''
            });
            setMessage('');
            setMessageVariant('success');
            setSaving(false);
            setIsEditing(false);
            
            try {
                const sessionRaw = localStorage.getItem('usuarioLogeado');
                const sessionObj = sessionRaw ? JSON.parse(sessionRaw) : null;
                const mensajePredilecto = "Bienvenido a tu espacio de bienestar. Aquí puedes reflexionar sobre tus emociones y crecer cada día.";
                setBio(sessionObj?.biografia && sessionObj.biografia.trim() !== '' ? sessionObj.biografia : mensajePredilecto);

                const keyHistorial = `historialEmociones_${user.correo}`;
                const hist = JSON.parse(localStorage.getItem(keyHistorial)) || [];
                setHistorial(hist);

            } catch (e) {
                console.error('Error cargando datos adicionales del perfil', e);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!form.nombre || !form.correo) {
            setMessageVariant('danger');
            setMessage('Nombre y correo son obligatorios');
            return;
        }

        if (form.password && form.password.length > 0) {
            if (form.password.length < 6) {
                setMessageVariant('danger');
                setMessage('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            if (form.password !== form.passwordConfirm) {
                setMessageVariant('danger');
                setMessage('Las contraseñas no coinciden');
                return;
            }
        }

        setSaving(true);
        
        updateProfile({
            nombreCompleto: form.nombre,
            correoElectronico: form.correo,
            password: form.password || undefined
        }).then((updated) => {
            setMessageVariant('success');
            setMessage('Perfil actualizado correctamente');
            setIsEditing(false);
            setSaving(false);
            
            setTimeout(() => setMessage(''), 3000);
        }).catch((err) => {
            setMessageVariant('danger');
            setMessage(err?.message || 'Error al guardar cambios');
            setSaving(false);
        });
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
                <h2>Mi Perfil</h2>
                {user && <div className="small-muted">Iniciaste sesión como <strong>{user.nombre}</strong></div>}

                {message && <Alert variant={messageVariant} className="mt-3">{message}</Alert>}
                <Form className="mt-3" onSubmit={handleSave}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{fontWeight: 600}}>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            className="input" 
                            value={form.nombre}
                            onChange={handleChange}
                            readOnly={!isEditing} 
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{fontWeight: 600}}>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            className="input"
                            value={form.correo}
                            onChange={handleChange}
                            readOnly={!isEditing} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{fontWeight: 600}}>Nueva contraseña (opcional)</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            className="input"
                            value={form.password}
                            onChange={handleChange}
                            readOnly={!isEditing}
                            placeholder="Dejar vacío para mantener la contraseña actual"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{fontWeight: 600}}>Confirmar nueva contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="passwordConfirm"
                            className="input"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />
                    </Form.Group>

                    
                    {isEditing ? (
                        <div className="d-flex gap-2">
                            <Button type="submit" className="btn" disabled={saving}>
                                {saving ? (
                                    <><Spinner animation="border" size="sm" /> Guardando...</>
                                ) : 'Guardar Cambios'}
                            </Button>
                            <Button variant="secondary" onClick={() => setIsEditing(false)} className="btn ghost">Cancelar</Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsEditing(true)} className="btn ghost">Editar Perfil</Button>
                    )}
                </Form>

                

                
                <div className="mt-4">
                    <h5>Historial de emociones</h5>
                    <div id="historialEmociones">
                        {historial.length === 0 ? (
                            <p className="small-muted">No hay emociones registradas</p>
                        ) : (
                            historial.map((item, idx) => {
                                
                                const emotion = item.emotion || item.emotionName || '';
                                let emoji = '';
                                let nombreEm = '';
                                let color = '#ddd';
                                if (typeof emotion === 'string') {
                                    
                                    const parts = emotion.split(' ');
                                    emoji = parts[0] || '';
                                    nombreEm = parts.slice(1).join(' ');
                                } else if (typeof emotion === 'object') {
                                    emoji = emotion.emoji || '';
                                    nombreEm = emotion.nombre || '';
                                    color = emotion.color || color;
                                }
                                const thoughts = item.thoughts ?? item.text ?? item.memo ?? '(Sin mensaje)';
                                return (
                                    <div key={idx} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
                                        <span title={nombreEm} style={{ fontSize: '2rem', marginRight: '0.5rem', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', backgroundColor: color, display: 'inline-block' }}>{emoji}</span>
                                        <span style={{ fontSize: '1rem', color: '#333' }}>{thoughts}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}