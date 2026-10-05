import Link from 'next/link';
import { Compass, Home, Search, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-5rem)] flex items-center justify-center pt-20 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 bg-white/5 border border-white/10 text-gray-400">
          <Compass className="w-3.5 h-3.5" />
          Lost in the chain
        </div>

        <div className="relative mb-8 select-none">
          <div className="font-display font-black text-[9rem] sm:text-[11rem] lg:text-[13rem] leading-none tracking-tighter">
            <span className="text-white">4</span>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>0</span>
            <span className="text-white">4</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl flex items-center justify-center mt-2">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-10">
          The page you are looking for does not exist or has been moved. Check the address or return to a known location.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[15px] w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/connect"
            className="btn-ghost inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-medium text-[15px] w-full sm:w-auto text-white"
          >
            <ShieldCheck className="w-4 h-4" />
            Connect Wallet
          </Link>
        </div>

        <div className="glass glass-border rounded-2xl p-6 text-left">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Try these instead</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Connect', href: '/connect', desc: 'Link your wallet' },
              { label: 'Support', href: '/support', desc: 'Get help' },
              { label: 'Protocol', href: '/protocol', desc: 'How it works' },
              { label: 'Security', href: '/security', desc: 'Stay safe' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 p-4 transition"
              >
                <div className="font-medium text-white text-sm group-hover:text-white transition">
                  {item.label} <span className="text-gray-500 group-hover:text-gray-300 transition inline-block group-hover:translate-x-1">→</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-8 font-mono">
          Error code: 404 · The requested resource was not found on this server.
        </p>
      </div>
    </main>
  );
}
