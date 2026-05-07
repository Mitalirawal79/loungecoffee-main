import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogIn, UserPlus, Settings, Heart, Package, ShoppingBag, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { searchProducts } from "@/lib/searchProducts";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "#top" },
  { label: "Collection", href: "#collection" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const SiteHeader = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { count, setOpen: setCartOpen } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const suggestions = useMemo(() => searchProducts(query, 6), [query]);

  const submitSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    setSearchOpen(false);
    setQuery("");
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 container flex items-center justify-between gap-6 py-6"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="shrink-0"
      >
        <Link
          to="/"
          aria-label="Lounge Coffee — Home"
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center font-display text-lg shadow-warm transition-transform group-hover:scale-105">
            L
          </div>
          <span className="font-display text-lg text-primary leading-none">
            Lounge<br />
            <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Coffee</span>
          </span>
        </Link>
      </motion.div>

      {/* Nav */}
      <nav className="hidden lg:flex gap-7 text-xs tracking-[0.2em] uppercase text-primary/80">
        {NAV_LINKS.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            onClick={(e) => {
              e.preventDefault();
              if (l.href === "#top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
            className="relative group hover:text-accent transition-colors cursor-pointer"
          >
            {l.label}
            <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
          </motion.a>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search */}
        <motion.div
          ref={searchRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          <motion.div
            animate={{ width: searchOpen ? 280 : 44 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex items-center h-11 rounded-full overflow-hidden backdrop-blur-md bg-cream/40 border transition-all duration-500 ${
              searchOpen
                ? "border-accent/60 shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)]"
                : "border-primary/15 hover:border-accent/40"
            }`}
          >
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="absolute left-0 top-0 h-11 w-11 grid place-items-center text-primary/80 hover:text-accent transition-colors"
            >
              <motion.span
                animate={{ rotate: searchOpen ? 90 : 0, scale: searchOpen ? 1.1 : 1 }}
                transition={{ duration: 0.4 }}
                className="grid place-items-center"
              >
                <Search size={18} strokeWidth={1.8} />
              </motion.span>
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitSearch(query);
                }
              }}
              placeholder="Search premium blends..."
              className={`w-full h-full pl-11 pr-4 bg-transparent outline-none text-sm text-primary placeholder:text-muted-foreground/80 transition-opacity duration-300 ${
                searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          </motion.div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 w-[320px] rounded-2xl backdrop-blur-xl bg-cream/95 border border-accent/20 shadow-warm overflow-hidden"
              >
                <div className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground border-b border-primary/10 flex items-center justify-between">
                  <span>{query.trim() ? "Matches" : "Start typing to search"}</span>
                  {query.trim() && (
                    <button
                      onClick={() => submitSearch(query)}
                      className="text-accent hover:text-primary transition-colors normal-case tracking-normal"
                    >
                      View all →
                    </button>
                  )}
                </div>
                <ul className="py-1 max-h-80 overflow-auto">
                  {!query.trim() ? (
                    <li className="px-4 py-3 text-sm text-muted-foreground">
                      Try “latte”, “arabica”, “mug”…
                    </li>
                  ) : suggestions.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-muted-foreground">No matches</li>
                  ) : (
                    suggestions.map((s, i) => (
                      <motion.li
                        key={s.key}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <button
                          onClick={() => {
                            setSearchOpen(false);
                            setQuery("");
                            navigate(`/category/${s.categorySlug}`);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-primary hover:bg-accent/15 transition-colors text-left group"
                        >
                          <img
                            src={s.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block truncate">{s.name}</span>
                            <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              {s.categoryLabel} · {s.price}
                            </span>
                          </span>
                        </button>
                      </motion.li>
                    ))
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Profile */}
        <motion.div
          ref={profileRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Profile"
            className="relative h-11 w-11 rounded-full grid place-items-center bg-gradient-to-br from-cream to-secondary border border-accent/40 text-primary shadow-[0_4px_20px_-6px_hsl(var(--accent)/0.5)] hover:shadow-[0_6px_28px_-4px_hsl(var(--accent)/0.7)] transition-shadow overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
            <User size={18} strokeWidth={1.8} />
            <span className="absolute -inset-1 rounded-full bg-accent/20 blur-md -z-10 opacity-60" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 mt-3 w-64 rounded-2xl backdrop-blur-xl bg-gradient-to-b from-cream/95 to-secondary/90 border border-accent/30 shadow-warm overflow-hidden"
              >
                <div className="px-5 pt-5 pb-3">
                  <div className="font-display text-lg text-primary leading-tight">
                    {user ? `Hi, ${user.email?.split("@")[0]}` : "Welcome"}
                  </div>
                  <div className="text-xs text-muted-foreground tracking-wide">
                    {user ? user.email : "Sign in to your coffee journey"}
                  </div>
                </div>
                {!user ? (
                  <div className="px-3 pb-3 space-y-1">
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors group relative overflow-hidden"
                    >
                      <LogIn size={16} />
                      <span>Login</span>
                      <span className="ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-accent/40 text-primary text-sm font-medium hover:bg-accent/15 transition-colors"
                    >
                      <UserPlus size={16} />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                ) : (
                  <div className="px-3 pb-3 space-y-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-accent/40 text-primary text-sm font-medium hover:bg-accent/15 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
                {user && (
                  <div className="border-t border-primary/10 py-1">
                    {[
                      { icon: Package, label: "My Orders", tab: "orders" },
                      { icon: Heart, label: "Wishlist", tab: "wishlist" },
                      { icon: Settings, label: "Account Settings", tab: "profile" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={`/account?tab=${item.tab}`}
                        onClick={() => setProfileOpen(false)}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-primary/85 hover:bg-accent/10 hover:text-primary transition-colors text-left"
                      >
                        <item.icon size={15} className="text-accent" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cart */}
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setCartOpen(true)}
          className="hidden sm:flex items-center gap-2 h-11 px-4 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/15 text-primary text-xs tracking-[0.2em] uppercase transition-colors"
        >
          <ShoppingBag size={15} />
          <span>Cart ({count})</span>
        </motion.button>
      </div>
    </motion.header>
  );
};
