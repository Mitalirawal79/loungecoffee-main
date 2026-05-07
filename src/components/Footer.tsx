export const Footer = () => (
  <footer id="contact" className="bg-espresso text-cream py-16">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-10 items-start">
        <div>
          <h3 className="font-display text-3xl mb-3">Lounge Coffee</h3>
          <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
            Premium roasts, crafted daily. A cinematic experience in every cup.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          {["Shop", "Story", "Cafés", "Journal", "Contact", "Wholesale"].map((l) => (
            <a key={l} href="#" className="text-cream/70 hover:text-accent transition-colors">
              {l}
            </a>
          ))}
        </div>
        <div className="text-sm">
          <p className="text-cream/60 mb-3 uppercase tracking-[0.3em] text-xs">Follow</p>
          <div className="flex gap-4">
            {["Instagram", "TikTok", "X"].map((s) => (
              <a key={s} href="#" className="text-cream/70 hover:text-accent transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-14 pt-6 border-t border-cream/10 text-xs text-cream/40 flex flex-col md:flex-row justify-between gap-3">
        <span>© {new Date().getFullYear()} Lounge Coffee. All rights reserved.</span>
        <span>Brewed with care.</span>
      </div>
    </div>
  </footer>
);
