'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import CandidateModal from '@/components/ui/CandidateModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);

  const navLinks = [
    { label: 'Come funziona', href: '/come-funziona' },
    { label: 'Scenari', href: '/scenari' },
    { label: 'Prezzi', href: '/prezzi' },
    { label: 'Sicurezza & Privacy', href: '/sicurezza-e-integrita' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-[#E5E8EE] transition-all">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-[8px] bg-[#0B1220] group-hover:bg-[#1F4FD8] text-white flex items-center justify-center font-mono font-bold text-sm tracking-wider transition-colors">
              SB
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg text-[#0B1220] tracking-tight">
                SkillBridge
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono uppercase px-2 py-0.5 rounded-[6px] bg-[#F7F8FA] text-[#5B6475] border border-[#E5E8EE]">
                Operations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-[#5B6475]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-[#0B1220] ${
                    isActive ? 'text-[#1F4FD8] font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsCandidateModalOpen(true)}
              className="h-10 px-3.5 rounded-[8px] border border-[#E5E8EE] bg-white hover:bg-[#F7F8FA] text-[#0B1220] text-xs font-medium transition-colors inline-flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/20 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#5B6475]" />
              <span>Accedi (Token)</span>
            </button>

            <Link
              href="/contatti"
              className="h-10 px-4 rounded-[8px] bg-[#1F4FD8] hover:bg-[#1840B0] text-white text-xs font-semibold transition-all inline-flex items-center space-x-1.5 shadow-[0_1px_2px_rgba(11,18,32,0.06)] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[#1F4FD8]/40"
            >
              <span>Richiedi il pilota</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsCandidateModalOpen(true)}
              className="p-2 rounded-[8px] border border-[#E5E8EE] text-[#0B1220] text-xs font-medium"
              aria-label="Accedi"
            >
              <KeyRound className="w-4 h-4 text-[#5B6475]" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0B1220] rounded-[8px] hover:bg-[#F7F8FA]"
              aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-b border-[#E5E8EE] px-4 pt-2 pb-5 space-y-3 soft-shadow">
            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2 px-3 rounded-[6px] ${
                    pathname === link.href
                      ? 'bg-[#F7F8FA] text-[#1F4FD8] font-semibold'
                      : 'text-[#5B6475] hover:bg-[#F7F8FA] hover:text-[#0B1220]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/per-i-candidati"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-2 px-3 text-[#5B6475] hover:bg-[#F7F8FA] hover:text-[#0B1220]"
              >
                Per i Candidati
              </Link>
            </div>

            <div className="pt-3 border-t border-[#E5E8EE] flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCandidateModalOpen(true);
                }}
                className="w-full h-10 rounded-[8px] border border-[#E5E8EE] bg-white text-[#0B1220] text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#5B6475]" />
                <span>Accedi con Token</span>
              </button>

              <Link
                href="/contatti"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-[8px] bg-[#1F4FD8] text-white text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <span>Richiedi il pilota</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Candidate Entry Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
      />
    </>
  );
}
