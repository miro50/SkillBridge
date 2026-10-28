'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SCENARIO_CATALOG, ScenarioCatalogItem } from '@/lib/assessment/parametric';
import {
  Search,
  Filter,
  Factory,
  Boxes,
  Cpu,
  Zap,
  ArrowRight,
  Clock,
  AlertTriangle,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function ScenariCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredScenarios = useMemo(() => {
    return SCENARIO_CATALOG.filter((sc) => {
      const matchesCategory =
        selectedCategory === 'all' || sc.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sc.title.toLowerCase().includes(q) ||
        sc.summary.toLowerCase().includes(q) ||
        sc.partNumber.toLowerCase().includes(q) ||
        sc.role.toLowerCase().includes(q) ||
        sc.productionLine.toLowerCase().includes(q) ||
        sc.id.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
              Catalogo Tecnico
            </span>
            <h1 className="h1-hero mt-3">
              I 20 Scenari Industriali di Simulazione.
            </h1>
            <p className="body-large mt-3">
              Ogni test misura decisioni reali di stabilimento in 25 minuti. Parametri matematici dinamici a 32-bit, vincoli di lotto minimo e costi orari di fermo linea.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="mt-8 pt-6 border-t border-[#E5E8EE] flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5B6475] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca per codice (es. V-104), componente, reparto o parola chiave..."
                className="w-full h-11 pl-10 pr-4 rounded-[8px] border border-[#E5E8EE] bg-white text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`h-11 px-3.5 rounded-[8px] text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
                }`}
              >
                Tutti (20)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('supply_chain')}
                className={`h-11 px-3.5 rounded-[8px] text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  selectedCategory === 'supply_chain'
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
                }`}
              >
                Supply Chain (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('production_planning')}
                className={`h-11 px-3.5 rounded-[8px] text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  selectedCategory === 'production_planning'
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
                }`}
              >
                MRP &amp; MPS (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('procurement')}
                className={`h-11 px-3.5 rounded-[8px] text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  selectedCategory === 'procurement'
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
                }`}
              >
                Buyer (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('lean_process')}
                className={`h-11 px-3.5 rounded-[8px] text-xs font-mono font-semibold transition-colors border cursor-pointer ${
                  selectedCategory === 'lean_process'
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'bg-white text-[#5B6475] border-[#E5E8EE] hover:bg-[#F7F8FA]'
                }`}
              >
                Lean &amp; Process (5)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8 text-xs font-mono text-[#5B6475]">
            <span>
              Visualizzati <strong>{filteredScenarios.length}</strong> di 20 scenari
            </span>
            <span>Tutti i test includono Video Proctoring &amp; Anti-Cheat</span>
          </div>

          {filteredScenarios.length === 0 ? (
            <div className="p-12 text-center card-frame space-y-3">
              <AlertTriangle className="w-8 h-8 text-[#B7791F] mx-auto" />
              <h3 className="text-base font-semibold text-[#0B1220]">
                Nessuno scenario trovato per &quot;{searchQuery}&quot;
              </h3>
              <p className="text-xs text-[#5B6475]">
                Prova a cercare per codice componente (es. V-104, P-200), fornitore o ruolo.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-semibold text-[#1F4FD8] underline"
              >
                Azzera filtri di ricerca
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map((sc) => {
                const code = sc.id.split('-')[1]?.toUpperCase() || 'V104';
                return (
                  <div
                    key={sc.id}
                    className="card-frame p-6 flex flex-col justify-between hover:border-[#1F4FD8]/60 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-[#1F4FD8] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E8EE]">
                          SKB-{code}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F7F8FA] text-[#5B6475] border border-[#E5E8EE]">
                          {sc.difficulty} &bull; 25 MIN
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#0B1220] mb-1 leading-snug">
                        {sc.title}
                      </h3>
                      <div className="text-[11px] text-[#1F4FD8] font-medium mb-3">
                        {sc.role}
                      </div>

                      <p className="text-xs text-[#5B6475] leading-relaxed mb-4">
                        {sc.summary}
                      </p>

                      <div className="space-y-1.5 py-3 border-t border-[#E5E8EE] text-xs font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-[#5B6475]">Componente:</span>
                          <span className="font-semibold text-[#0B1220]">{sc.partNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#5B6475]">Reparto:</span>
                          <span className="text-[#0B1220] truncate max-w-[170px]">{sc.productionLine}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#5B6475]">Danno Fermo Linea:</span>
                          <span className="font-bold text-red-600">
                            {sc.downtimeCostPerHour.toLocaleString('it-IT')} € / ora
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E8EE] mt-3">
                      <Link
                        href={`/assessment/demo-${sc.id}`}
                        className="w-full h-10 rounded-[8px] bg-[#F7F8FA] hover:bg-[#E5E8EE] text-[#0B1220] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>Test-Drive Simulazione</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* District Callout Banner */}
      <section className="py-16 bg-[#F7F8FA] border-t border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-2xl">
          <h2 className="h2-section">Hai bisogno di uno scenario specifico per la tua linea?</h2>
          <p className="body-large mt-3">
            Includiamo la calibrazione personalizzata dei parametri per le prime 5 aziende manifatturiere del programma pilota.
          </p>
          <div className="mt-6">
            <Link
              href="/contatti"
              className="h-11 px-6 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold inline-flex items-center justify-center space-x-2 transition-all shadow-xs"
            >
              <span>Richiedi il pilota per il tuo stabilimento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
