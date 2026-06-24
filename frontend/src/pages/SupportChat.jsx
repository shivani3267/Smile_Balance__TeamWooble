import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance.js"
;
export default function SupportChat() {
  const nav = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.API_URL || "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return nav("/login");

    const loadSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat/session`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setMessages(data.session.messages || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadSession();
  }, [nav, token]);

  const send = async () => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: userMsg.text }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMsg = { role: "bot", text: data.reply, time: new Date() };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070711] text-white p-6">
      <div className="max-w-[800px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Support Chat 💬</h1>
          <button
            onClick={() => nav("/dashboard")}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/15"
          >
            ← Back
          </button>
        </div>

        <div className="mt-6 bg-white/10 border border-white/15 rounded-2xl p-4 h-[450px] overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                  m.role === "user"
                    ? "bg-yellow-300 text-black"
                    : "bg-black/40 border border-white/15"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 text-sm mt-2">Bot is typing...</p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-black/30 border border-white/15 rounded-2xl px-4 py-3 outline-none"
            placeholder="Type here..."
          />
          <button
            onClick={send}
            className="px-6 rounded-2xl bg-white text-black font-bold"
          >
            Send
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Chat is saved temporarily and auto-deletes after 6 hours ✅
        </p>
      </div>
    </div>
  );
}
