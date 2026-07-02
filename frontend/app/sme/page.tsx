"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API } from "../../lib/config";
import { Building2, CheckCircle2, IndianRupee, Percent, ShieldCheck } from "lucide-react";

export default function SmePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(API.base + "/api/sme/products").then((r) => r.json()).then((d) => setProducts(d.products));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">SME Banking</h1>
      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">Business banking products and services</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Business types", value: "5+", icon: Building2, color: "text-blue-600 bg-blue-50 dark:bg-sbi-blue/20" },
          { label: "Loan range", value: "₹50L+", icon: IndianRupee, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/20" },
          { label: "Interest rate", value: "9.5%", icon: Percent, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/20" },
          { label: "Coverage", value: "All India", icon: ShieldCheck, color: "text-purple-600 bg-purple-50 dark:bg-purple-500/20" }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-card">
              <div className={`inline-flex rounded-lg ${stat.color} p-2.5`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4">
        {products.map((product) => (
          <motion.div key={product.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">{product.name}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{product.id}</p>
              </div>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-sbi-blue dark:bg-sbi-blue/20">
                {product.rate}
              </span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {(product.features || []).map((f: string) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
