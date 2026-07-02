"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { MessageSquare, Send, Bot } from "lucide-react";

export default function WhatsAppPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [chatIntent, setChatIntent] = useState("support");
  const [chatResponse, setChatResponse] = useState<any>(null);

  useEffect(() => {
    fetch(API.base + "/api/whatsapp/templates").then((r) => r.json()).then((d) => setTemplates(d.templates));
  }, []);

  async function sendTemplate() {
    const res = await fetch(API.base + "/api/whatsapp/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: selectedTemplate, variables })
    });
    const data = await res.json();
    setPreview(data.message);
  }

  async function simulateChat() {
    const res = await fetch(API.base + "/api/whatsapp/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: chatIntent })
    });
    const data = await res.json();
    setChatResponse(data);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">WhatsApp Banking</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Business API integration for conversational banking</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
              <MessageSquare className="h-5 w-5 text-emerald-600" /> Message Templates
            </h2>
            <div className="mt-3 space-y-2">
              {templates.map((t) => (
                <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setVariables({}); setPreview(""); }}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${
                    selectedTemplate === t.id
                      ? "border-sbi-blue bg-blue-50 dark:bg-sbi-blue/20"
                      : "border-[var(--card-border)] hover:border-slate-300"
                  }`}
                >
                  <span className="font-medium text-[var(--text-primary)]">{t.id}</span>
                  <span className="ml-2 text-xs text-[var(--text-muted)]">{t.variables.length > 0 ? `Variables: ${t.variables.join(", ")}` : "No variables"}</span>
                </button>
              ))}
            </div>

            {templates.find((t) => t.id === selectedTemplate)?.variables?.length > 0 && (
              <div className="mt-3 space-y-2">
                {templates.find((t) => t.id === selectedTemplate).variables.map((v: string) => (
                  <input key={v} placeholder={v} value={variables[v] || ""} onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-sbi-blue focus:outline-none" />
                ))}
              </div>
            )}

            <button onClick={sendTemplate} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              <Send className="h-4 w-4" /> Preview message
            </button>

            {preview && (
              <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-500/10 dark:text-green-300">
                {preview}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
              <Bot className="h-5 w-5 text-sbi-cyan" /> Simulate Chat
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["balance", "kyc", "loan", "sip", "support"].map((intent) => (
                <button key={intent} onClick={() => { setChatIntent(intent); simulateChat(); }}
                  className={`rounded-lg border px-3 py-2 text-sm capitalize transition-all ${
                    chatIntent === intent
                      ? "border-sbi-blue bg-blue-50 dark:bg-sbi-blue/20"
                      : "border-[var(--card-border)]"
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>

            {chatResponse && (
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Bot className="mt-0.5 h-5 w-5 shrink-0 text-sbi-cyan" />
                  <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                    {chatResponse.response}
                  </div>
                </div>
                {chatResponse.quickReplies && (
                  <div className="flex flex-wrap gap-2">
                    {chatResponse.quickReplies.map((qr: string) => (
                      <span key={qr} className="rounded-full border border-sbi-blue px-3 py-1 text-xs font-medium text-sbi-blue">
                        {qr}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
