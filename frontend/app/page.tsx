"use client";

import { useState, useEffect } from "react";

interface Prompt {
  id: number;
  content: string;
  created_at: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchPrompts = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`${API_URL}/prompts`);
      const data = await res.json();
      setPrompts(data.prompts || []);
    } catch {
      console.error("Fetch error");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: prompt }),
      });
      if (!res.ok) throw new Error();
      setPrompt("");
      setStatus({ type: "success", msg: "Prompt kaydedildi ✓" });
      await fetchPrompts();
    } catch {
      setStatus({ type: "error", msg: "Bir hata oluştu. Tekrar dene." });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-mono">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-500 tracking-[0.2em] uppercase">
              Prompt Vault
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white leading-none mb-3">
            AI Prompt
            <br />
            <span className="text-zinc-600">Kayıt Sistemi</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Promptlarını kaydet, düzenli tut.
          </p>
        </div>

        {/* Input area */}
        <div className="mb-10">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
              placeholder="Promptunu buraya yaz..."
              rows={4}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
            />
            <div className="absolute bottom-3 right-3 text-xs text-zinc-700">
              ⌘↵ kaydet
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            {status ? (
              <span
                className={`text-xs ${
                  status.type === "success" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {status.msg}
              </span>
            ) : (
              <span className="text-xs text-zinc-700">
                {prompt.length} karakter
              </span>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black text-sm font-semibold rounded-lg transition-all duration-150 disabled:cursor-not-allowed"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600 tracking-widest uppercase">
            Kayıtlar
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Prompts list */}
        {fetchLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-zinc-900/40 rounded-xl animate-pulse border border-zinc-800/50"
              />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-30">∅</div>
            <p className="text-zinc-600 text-sm">Henüz prompt yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p, i) => (
              <div
                key={p.id}
                className="group border border-zinc-800/80 rounded-xl px-5 py-4 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-xs text-zinc-700 mt-0.5 font-mono shrink-0">
                      #{String(prompts.length - i).padStart(3, "0")}
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed break-words">
                      {p.content}
                    </p>
                  </div>
                </div>
                <div className="mt-3 ml-8">
                  <span className="text-xs text-zinc-600">
                    {formatDate(p.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {prompts.length > 0 && (
          <div className="mt-8 text-center">
            <span className="text-xs text-zinc-700">
              {prompts.length} prompt kayıtlı
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
