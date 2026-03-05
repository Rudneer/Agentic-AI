import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAgent = async () => {
    if (!prompt.trim()) return;

    const updated = [...messages, { role: "user", content: prompt }];
    setMessages(updated);
    setLoading(true);

    try {
      // Replace with "const res = await fetch("http://localhost:8000/run-agent", {" for local
      const res = await fetch("https://agentic-ai-backend-i4uy.onrender.com/run-agent", {
      // const res = await fetch("http://localhost:8000/run-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_prompt: prompt }),
      });

      const data = await res.json();

      setMessages([
        ...updated,
        { role: "assistant", content: "App generated successfully 🚀" },
      ]);

      setPreviewUrl(data.preview_url);
    } catch (err) {
      setMessages([
        ...updated,
        { role: "assistant", content: "Something went wrong." },
      ]);
    }

    setPrompt("");
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex overflow-hidden">

      {/* LEFT PANEL */}
      <div className="w-1/3 h-full backdrop-blur-xl bg-white/5 border-r border-white/10 flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <Sparkles className="text-blue-400" />
          <div>
            <h1 className="font-semibold text-lg">Agentic AI Builder</h1>
            <p className="text-xs text-zinc-400">
              Describe the app. Watch it build.
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
          {messages.length === 0 && (
            <div className="text-zinc-500 text-sm">
              Try: "Build a modern todo app with colourful UI"
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-lg ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600"
                  : "bg-zinc-800 border border-white/10"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="bg-zinc-800 px-4 py-4 rounded-2xl text-sm border border-white/10 animate-pulse flex flex-col gap-1">
              <span className="font-medium">✨ Hang tight! We're building your app...</span>
              <span className="text-zinc-400 text-xs">
                It usually takes a minute or two. Feel free to sit back while the magic happens.
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center bg-zinc-900 rounded-xl px-3 py-2 border border-white/10 focus-within:border-blue-500 transition">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your app idea..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-zinc-500"
              onKeyDown={(e) => e.key === "Enter" && runAgent()}
            />
            <button
              onClick={runAgent}
              disabled={loading}
              className="ml-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="w-2/3 h-full bg-zinc-100 relative">

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-200 flex items-center px-4 gap-2 shadow-sm z-10">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="ml-4 text-xs text-zinc-600 truncate">
            {previewUrl || "No app loaded"}
          </div>
        </div>

        {/* Iframe */}
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Preview"
            className="w-full h-full pt-10 border-none"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-400">
            Your generated app will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
