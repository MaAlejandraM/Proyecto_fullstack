import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API = "http://3.239.97.16:8080";

// --- Configuración Gemini ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Clave para guardar en LocalStorage
const makeStorageKey = (email) => `chat_history_v2_${email}`;

export default function Chat() {
  const { user, token } = useAuth();
  const email = user?.email;
  const isGuest = user?.isGuest;

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]); // 👈 UNA SOLA LISTA PARA TODO
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  // =================================================
  // 1. CARGAR HISTORIAL (BACKEND + LOCAL)
  // =================================================
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      let combinedMessages = [];

      // A) Cargar mensajes locales (IA)
      const localData = localStorage.getItem(makeStorageKey(email));
      if (localData) {
        combinedMessages = JSON.parse(localData);
      }

      // B) Cargar mensajes del Backend (Si es usuario registrado)
      if (!isGuest && email) {
        try {
          const resp = await fetch(`${API}/api/chats`, {
            headers: { "Authorization": `Bearer ${token}`, "X-User-Email": email }
          });
  
          if (resp.ok) {
            const list = await resp.json();
            let backendMsgs = [];
  
            if (list.length > 0) {
              setChatId(list[0].id);
              backendMsgs = list[0].mensajes;
            } else {
              // Crear chat si no existe
              const newChat = await fetch(`${API}/api/chats`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`, "X-User-Email": email }
              });
              const data = await newChat.json();
              setChatId(data.id);
            }
  
            // Formatear mensajes del backend para que coincidan con los locales
            const formattedBackend = backendMsgs.map(m => ({
              id: `be-${m.id}`,
              text: m.contenido,
              sender: m.emisorId === user.id ? user.nombre : "Serenamente", // Fallback
              isUser: m.emisorId === user.id,
              date: new Date(m.fechaEnvio).getTime()
            }));
  
            // Unir y ordenar por fecha para que no se mezclen mal
            combinedMessages = [...combinedMessages, ...formattedBackend];
            
            // Eliminar duplicados (opcional, por si acaso) y ordenar
            combinedMessages.sort((a, b) => a.date - b.date);
          }
        } catch (error) {
          console.error("Error cargando chat backend", error);
        }
      }

      // Si está vacío, mensaje de bienvenida
      if (combinedMessages.length === 0) {
        combinedMessages.push({
          id: 'welcome',
          text: "¡Hola! Soy Serenamente, ¿cómo te sientes hoy?",
          sender: "Serenamente",
          isUser: false,
          date: Date.now()
        });
      }

      setMessages(combinedMessages);
    };

    loadData();
  }, [user, isGuest, email, token]);

  // =================================================
  // 2. SCROLL AL FONDO AUTOMÁTICO
  // =================================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // =================================================
  // 3. ENVIAR MENSAJE
  // =================================================
  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // 1. Agregar mensaje del USUARIO visualmente YA MISMO (Optimistic UI)
    const newUserMsg = {
      id: `local-${Date.now()}`,
      text: text,
      sender: user.nombre,
      isUser: true,
      date: Date.now()
    };
    
    // Aquí está la clave: Lo agregamos al FINAL de la lista existente
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput("");

    // 2. Guardar en Backend (si no es invitado)
    if (!isGuest && chatId) {
      fetch(`${API}/api/chats/${chatId}/mensajes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-User-Email": email
        },
        body: JSON.stringify({ contenido: text })
      }).catch(err => console.error("Error guardando mensaje", err));
    }

    // 3. Llamar a la IA
    const aiResponse = await callGemini(updatedMessages, text);
    
    // 4. Agregar respuesta de la IA al FINAL
    const newAiMsg = {
      id: `ai-${Date.now()}`,
      text: aiResponse.text,
      sender: "Serenamente",
      isUser: false,
      date: Date.now()
    };

    const finalMessages = [...updatedMessages, newAiMsg];
    setMessages(finalMessages);

    // 5. Guardar mensajes locales (IA) en localStorage para no perderlos
    // Filtramos solo los que NO son del backend para no duplicar en la próxima carga
    const localOnly = finalMessages.filter(m => m.id.startsWith('local-') || m.id.startsWith('ai-') || m.id === 'welcome');
    localStorage.setItem(makeStorageKey(email), JSON.stringify(localOnly));
  };

  // =================================================
  // 4. LLAMADA A GEMINI
  // =================================================
  const callGemini = async (historial, ultimoMensaje) => {
    setIsLoading(true);
    try {
      const nombreUsuario = user?.nombre || "Usuario";
      const prompt = `
        ACTÚA COMO: "Serenamente", IA de bienestar.
        TONO: Empático, cálido (Latino).
        REGLAS: Valida emociones, sé breve (3-4 líneas), termina con pregunta.
        SEGURIDAD: Si hay riesgo, deriva a emergencia.
        CONTEXTO: ${historial.slice(-10).map(m => `${m.sender}: ${m.text}`).join("\n")}
        USUARIO: "${ultimoMensaje}"
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { sender: "Serenamente", text: response.text() };
    } catch (e) {
      return { sender: "Serenamente", text: "Lo siento, tuve un error de conexión." };
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ 
      id: 'welcome', 
      text: "¡Hola! Soy Serenamente.", 
      sender: "Serenamente", 
      isUser: false, 
      date: Date.now() 
    }]);
    localStorage.removeItem(makeStorageKey(email));
  };

  return (
    <div className="container page-container">
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 mb-0">Chat con Serenamente</h2>
            <Button variant="outline-danger" size="sm" onClick={handleClear}>Borrar</Button>
        </div>

        {/* CHAT BOX */}
        <div className="chat-box">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${msg.isUser ? "msg-right" : "msg-left"}`}
            >
              <div className={`msg-bubble ${msg.isUser ? "msg-user" : "msg-ai"}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="msg-row msg-left">
              <div className="msg-bubble msg-ai fst-italic text-muted">Escribiendo...</div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        <Form onSubmit={handleSend} className="d-flex gap-2 mt-3">
            <Form.Control
              type="text"
              placeholder="Escribe aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderRadius: "20px" }}
            />
          <Button type="submit" style={{ borderRadius: "20px", padding: "0 20px" }}>Enviar</Button>
        </Form>
      </div>
    </div>
  );
}