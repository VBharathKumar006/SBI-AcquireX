"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { Mic, MicOff, Volume2, Command, List, ArrowRight, Bot } from "lucide-react";

export default function VoicePage() {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [commands, setCommands] = useState<any[]>([]);
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState<{ cmd: string; res: string }[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetch(API.base + "/api/voice/commands").then((r) => r.json()).then((d) => setCommands(d.commands));
  }, []);

  async function processCommand(text: string) {
    if (!text.trim()) return;
    setTranscript(text);
    try {
      const res = await fetch(API.base + "/api/voice/process", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text })
      });
      const data = await res.json();
      setResponse(data);
      setHistory((prev) => [{ cmd: text, res: data.response }, ...prev]);
    } catch {}
  }

  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      setTranscript("Speech recognition not available in this browser. Type your command below.");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      processCommand(text);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Voice Banking</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Voice-controlled banking commands</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-card text-center">
            <button onClick={startListening} className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all ${
              listening ? "bg-red-100 scale-110 animate-pulse dark:bg-red-500/20" : "bg-sbi-blue/10 hover:bg-sbi-blue/20 dark:bg-sbi-blue/20"
            }`}>
              {listening ? <MicOff className="h-8 w-8 text-red-500" /> : <Mic className="h-8 w-8 text-sbi-blue" />}
            </button>
            <p className="mt-4 font-medium text-[var(--text-primary)]">
              {listening ? "Listening..." : "Tap to speak"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Say: &quot;check balance&quot;, &quot;send money&quot;, &quot;help&quot;</p>

            <div className="mt-4">
              <div className="flex gap-2">
                <input value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Or type a command..." className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm" />
                <button onClick={() => processCommand(transcript)} className="rounded-lg bg-sbi-blue px-3 py-2 text-white">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {response && (
              <div className="mt-4 rounded-lg bg-cyan-50 p-3 text-left text-sm dark:bg-cyan-500/10">
                <div className="flex items-start gap-2">
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-sbi-cyan" />
                  <span className="text-[var(--text-secondary)]">{response.response}</span>
                </div>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <List className="h-4 w-4 text-sbi-blue" /> History
              </h3>
              <div className="mt-2 space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-2.5 text-sm">
                    <p className="font-medium text-[var(--text-primary)]">You: {h.cmd}</p>
                    <p className="mt-0.5 text-[var(--text-secondary)]">Bot: {h.res}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <Command className="h-5 w-5 text-purple-600" /> Available Commands
          </h2>
          <div className="mt-4 space-y-2">
            {commands.map((cmd) => (
              <div key={cmd.command} className="flex items-start gap-3 rounded-lg border border-[var(--card-border)] bg-[var(--background)] p-3">
                <Bot className="mt-0.5 h-4 w-4 shrink-0 text-sbi-cyan" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{cmd.command}</p>
                  <p className="text-xs text-[var(--text-muted)]">{cmd.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
