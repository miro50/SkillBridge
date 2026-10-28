import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E5E8EE] pt-16 pb-12 text-[#5B6475] text-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Colonna 1: Prodotto */}
          <div>
            <h4 className="font-semibold text-sm text-[#0B1220] mb-4">Prodotto</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/come-funziona" className="hover:text-[#0B1220] transition-colors">
                  Come Funziona
                </Link>
              </li>
              <li>
                <Link href="/scenari" className="hover:text-[#0B1220] transition-colors">
                  I 20 Scenari Industriali
                </Link>
              </li>
              <li>
                <Link href="/prezzi" className="hover:text-[#0B1220] transition-colors">
                  Prezzi & Modello a Successo
                </Link>
              </li>
              <li>
                <Link
                  href="/scorecard/33333333-3333-4333-8333-333333333333"
                  className="hover:text-[#0B1220] transition-colors"
                >
                  Scorecard Esempio (88/100)
                </Link>
              </li>
              <li>
                <Link href="/per-i-candidati" className="hover:text-[#0B1220] transition-colors">
                  Per i Candidati
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 2: Ruoli & Fabbrica */}
          <div>
            <h4 className="font-semibold text-sm text-[#0B1220] mb-4">Ruoli Manifatturieri</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/scenari?cat=supply_chain" className="hover:text-[#0B1220] transition-colors">
                  Supply Chain & Operations
                </Link>
              </li>
              <li>
                <Link href="/scenari?cat=production_planning" className="hover:text-[#0B1220] transition-colors">
                  Pianificatore MRP & MPS
                </Link>
              </li>
              <li>
                <Link href="/scenari?cat=procurement" className="hover:text-[#0B1220] transition-colors">
                  Buyer Tecnico & Procurement
                </Link>
              </li>
              <li>
                <Link href="/scenari?cat=lean_process" className="hover:text-[#0B1220] transition-colors">
                  Process & Lean Engineering
                </Link>
              </li>
              <li>
                <span className="text-[#5B6475]/80">
                  Distretti: Brescia, Bergamo, Bologna, Modena, Vicenza
                </span>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Sicurezza & Legale */}
          <div>
            <h4 className="font-semibold text-sm text-[#0B1220] mb-4">Integrità & Privacy</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/sicurezza-e-integrita" className="hover:text-[#0B1220] transition-colors">
                  Protocollo Anti-Cheat
                </Link>
              </li>
              <li>
                <Link href="/sicurezza-e-integrita#privacy" className="hover:text-[#0B1220] transition-colors">
                  Informativa Webcam & Consenso
                </Link>
              </li>
              <li>
                <Link href="/sicurezza-e-integrita#ai-act" className="hover:text-[#0B1220] transition-colors">
                  Conformità AI Act & Spiegabilità
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0B1220] transition-colors">
                  Privacy Policy (GDPR)
                </Link>
              </li>
              <li>
                <Link href="/termini" className="hover:text-[#0B1220] transition-colors">
                  Termini di Servizio
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonna 4: Contatti & Azienda */}
          <div>
            <h4 className="font-semibold text-sm text-[#0B1220] mb-4">Contatti & Supporto</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contatti" className="hover:text-[#0B1220] transition-colors">
                  Richiedi il Pilota Aziendale
                </Link>
              </li>
              <li>
                <a href="mailto:pilota@skillbridge.it" className="hover:text-[#0B1220] transition-colors">
                  pilota@skillbridge.it
                </a>
              </li>
              <li>
                <span className="text-[#5B6475]/80">
                  Presidio Operativo: Milano, Brescia, Bologna
                </span>
              </li>
              <li>
                <Link href="/admin" className="text-[#5B6475]/60 hover:text-[#0B1220] transition-colors font-mono text-[11px]">
                  Console Amministrazione &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E8EE] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5B6475] gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[#0B1220]">SkillBridge</span>
            <span>&bull;</span>
            <span>Tecnologie di Validazione Competenze Tecniche per la Manifattura</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span>P.IVA IT 09483920194</span>
            <Link href="/privacy" className="hover:text-[#0B1220]">Privacy</Link>
            <Link href="/termini" className="hover:text-[#0B1220]">Termini</Link>
            <span>&copy; 2026 SkillBridge. Tutti i diritti riservati.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
