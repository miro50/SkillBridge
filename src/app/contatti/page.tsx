'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function ContattiPage() {
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Brescia');
  const [role, setRole] = useState('Direttore di Stabilimento / Plant Manager');
  const [roleNeeded, setRoleNeeded] = useState('Supply Chain & Operations Specialist');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: contactName,
          company_name: companyName,
          email,
          phone: phone || undefined,
          province,
          role,
          role_needed: roleNeeded,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Errore durante l\'invio della richiesta. Riprova tra poco.');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Si è verificato un errore di connessione.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans selection:bg-[#1F4FD8] selection:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-20 border-b border-[#E5E8EE] bg-[#F7F8FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1F4FD8] font-semibold">
            Programma Pilota &quot;Linea Aperta&quot;
          </span>
          <h1 className="h1-hero mt-3">
            Richiedi 3 Profili Pre-Validati a Rischio Zero.
          </h1>
          <p className="body-large mt-4 max-w-2xl mx-auto">
            Ricevi entro 7 giorni lavorativi 3 ingegneri gestionali testati su fermi linea reali con Scorecard A4. Zero anticipi e fattura al 90° giorno solo se confermati.
          </p>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-20 border-b border-[#E5E8EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 card-frame p-6 sm:p-10">
              {submitSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#12805C] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0B1220]">
                    Richiesta Registrata con Successo
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B6475] leading-relaxed max-w-md mx-auto">
                    Grazie, <strong>{contactName}</strong>. Un nostro Ingegnere Gestionale ti contatterà telefonicamente entro 4 ore lavorative per calibrare i vincoli specifici del tuo impianto.
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/scorecard/33333333-3333-4333-8333-333333333333"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-[8px] bg-[#F7F8FA] border border-[#E5E8EE] text-xs font-semibold text-[#1F4FD8] hover:bg-[#E5E8EE]"
                    >
                      <span>Nel frattempo, visualizza una Scorecard Esempio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Nome e Cognome Referente *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Es. Ing. Mario Rossi"
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Ruolo in Azienda *
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      >
                        <option value="Direttore di Stabilimento / Plant Manager">Direttore di Stabilimento / Plant Manager</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Supply Chain Director">Supply Chain Director</option>
                        <option value="HR / Talent Acquisition">Responsabile Risorse Umane / HR</option>
                        <option value="Titolare / Amministratore Delegato">Titolare / Amministratore Delegato</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Ragione Sociale Azienda *
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Es. Meccanica Lombarda S.p.A."
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Provincia Stabilimento *
                      </label>
                      <input
                        type="text"
                        required
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        placeholder="Es. Brescia, Bergamo, Bologna..."
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Email Lavorativa *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Es. m.rossi@azienda.it"
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0B1220] mb-1">
                        Telefono Diretto / Cellulare
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Es. +39 335 1234567"
                        className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0B1220] mb-1">
                      Profilo Tecnico Ricercato *
                    </label>
                    <select
                      value={roleNeeded}
                      onChange={(e) => setRoleNeeded(e.target.value)}
                      className="w-full h-10 px-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                    >
                      <option value="Supply Chain & Operations Specialist (Modulo V-104)">
                        Supply Chain &amp; Operations Specialist (Modulo V-104)
                      </option>
                      <option value="Pianificatore della Produzione & MRP Specialist (Modulo P-200)">
                        Pianificatore della Produzione &amp; MRP Specialist (Modulo P-200)
                      </option>
                      <option value="Buyer Tecnico & Procurement Specialist (Modulo E-501)">
                        Buyer Tecnico &amp; Procurement Specialist (Modulo E-501)
                      </option>
                      <option value="Junior Process & Continuous Improvement Engineer (Modulo M-300)">
                        Junior Process &amp; Continuous Improvement Engineer (Modulo M-300)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0B1220] mb-1">
                      Note o Vincoli di Stabilimento (Opzionale)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Es. Linea ad alta cadenza, richiesta conoscenza base ERP, disponibilità a brevi trasferte..."
                      className="w-full p-3 rounded-[8px] border border-[#E5E8EE] text-xs text-[#0B1220] placeholder-[#5B6475]/60 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 focus:border-[#1F4FD8]"
                    />
                  </div>

                  {submitError && (
                    <div className="p-2.5 rounded-[8px] bg-red-50 text-red-700 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <span>{isSubmitting ? 'Registrazione in corso...' : 'Invia Richiesta Pilota (Zero Anticipi)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Direct Info & Guarantees */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-frame p-6 sm:p-8 bg-[#F7F8FA] space-y-5">
                <h3 className="text-sm font-semibold text-[#0B1220] pb-2 border-b border-[#E5E8EE]">
                  Canali Diretti &amp; Recapiti
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-[#1F4FD8] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0B1220] block">Email Ufficio Pilota</span>
                      <a href="mailto:pilota@skillbridge.it" className="text-[#1F4FD8] underline">
                        pilota@skillbridge.it
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#1F4FD8] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0B1220] block">Presidio Territoriale</span>
                      <span className="text-[#5B6475]">
                        Cluster Meccanico &amp; Manifatturiero: Brescia, Bergamo, Modena, Bologna, Vicenza.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-[#12805C] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0B1220] block">Tempo di Risposta</span>
                      <span className="text-[#5B6475]">
                        Entro 4 ore lavorative dal lunedì al venerdì (08:30 – 19:00).
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E8EE] space-y-2 text-[11px] text-[#5B6475]">
                  <div className="flex items-center space-x-1.5 text-[#12805C] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Garanzia 100% Soddisfatti o Rimborsati a 90 Giorni</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#12805C] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Nessun vincolo di esclusiva contrattuale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
