'use client';
import Link from 'next/link';
import { Menu, Wallet, X } from 'lucide-react';
import { useState } from 'react';

const links = [
  { label: 'Connect', href: '/connect' },
  { label: 'Support', href: '/support' },
  { label: 'Protocol', href: '/protocol' },
  { label: 'Security', href: '/security' },
  { label: 'Docs', href: '/docs' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <>
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg blur-md opacity-60" />
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-500 via-violet-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">R</span>
              </div>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">Resolves</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(l => <Link key={l.href} href={l.href} className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">{l.label}</Link>)}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full disconnected-pulse" />
              <span className="text-xs text-red-300 font-medium whitespace-nowrap">Not Connected</span>
            </div>

            {/* Desktop only - mobile goes inside hamburger */}
            <Link href="/connect" className="hidden lg:inline-flex btn-primary px-4 py-2 rounded-lg text-sm font-semibold items-center gap-2 whitespace-nowrap">
              <Wallet className="w-4 h-4" />Connect Wallet
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 -mr-1 text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>

    {open && (
      <div className="fixed inset-0 z-[60] lg:hidden">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] glass-strong p-6 overflow-y-auto border-l border-white/10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="font-display font-bold text-lg">Menu</span>
            <button onClick={() => setOpen(false)} className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 mb-6 md:hidden">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full disconnected-pulse" />
            <span className="text-xs text-red-300 font-medium">Not Connected</span>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-white/5 text-gray-200 font-medium transition"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <Link
              href="/connect"
              onClick={() => setOpen(false)}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-[15px]"
            >
              <Wallet className="w-5 h-5" />Connect Wallet
            </Link>
            <p className="text-xs text-center text-gray-500 mt-3">Secure • Non-custodial • Encrypted</p>
          </div>
        </div>
      </div>
    )}
  </>;
}
