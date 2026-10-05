import Link from 'next/link';

export function Footer() {
  return <footer className="relative border-t border-white/5 pt-20 pb-10 mt-20"><div className="max-w-7xl mx-auto px-6 lg:px-8"><div className="grid lg:grid-cols-12 gap-12 mb-16">
    <div className="lg:col-span-4"><Link href="/" className="flex items-center gap-3 mb-6"><div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 via-violet-500 to-cyan-400 flex items-center justify-center font-bold">R</div><span className="font-display font-bold text-xl">Resolves</span></Link><p className="text-sm text-gray-400 max-w-sm leading-relaxed">Open protocol to communicate securely between wallets and dApps. Encrypted bridge. Non-custodial. Always.</p></div>
    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">{[
      ['Protocol', [['Connect','/connect'],['Validation','/support'],['Bridge Server','/protocol'],['Security','/security'],['Audits','/security']]],
      ['Support', [['Issue Tracker','/support'],['Assets Recovery','/support'],['Migration Help','/support'],['Live Chat','/support'],['FAQ','/support']]],
      ['Developers', [['Documentation','/docs'],['SDK','/docs'],['API Reference','/docs'],['GitHub','/docs'],['Bug Bounty','/security']]],
      ['Legal', [['Privacy','/docs'],['Terms','/docs'],['Security','/security'],['Cookies','/docs']]]
    ].map(([title, items]) => <div key={String(title)}><div className="text-xs uppercase tracking-wider text-gray-500 mb-4">{String(title)}</div><ul className="space-y-3 text-sm">{(items as string[][]).map(([label, href]) => <li key={label}><Link href={href} className="text-gray-300 hover:text-white transition">{label}</Link></li>)}</ul></div>)}
    </div>
  </div><div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-gray-500"><span>© 2026 Resolves Protocol. Open source.</span><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot"/>Bridge server operational</span></div></div></footer>;
}
