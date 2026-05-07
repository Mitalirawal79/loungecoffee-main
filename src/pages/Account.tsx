import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Heart, Loader2, Package, Settings as SettingsIcon, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

type OrderItem = {
  id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price_cents: number;
};

type Order = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: OrderItem[];
};

const TABS = [
  { id: "profile", label: "Account Settings", icon: SettingsIcon },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
] as const;

type TabId = (typeof TABS)[number]["id"];

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const Account = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialTab = (params.get("tab") as TabId) || "profile";
  const [tab, setTab] = useState<TabId>(initialTab);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { items: wishlist, remove: removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    setParams({ tab }, { replace: true });
  }, [tab, setParams]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [{ data: prof }, { data: ords }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("orders")
          .select("id, status, total_cents, created_at, order_items(id, product_name, product_sku, quantity, unit_price_cents)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      if (prof) {
        setProfile(prof as Profile);
        setDisplayName(prof.display_name || "");
        setPhone(prof.phone || "");
      }
      if (ords) setOrders(ords as Order[]);
      setLoading(false);
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
  };

  const updatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    setNewPassword("");
  };

  const onUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) {
      toast.error(upErr.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("user_id", user.id);
    setUploading(false);
    if (updErr) {
      toast.error(updErr.message);
      return;
    }
    setProfile((p) => (p ? { ...p, avatar_url: url } : p));
    toast.success("Profile picture updated");
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background grid place-items-center">
        <Loader2 className="animate-spin text-accent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container py-12 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70 hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-[280px_1fr] gap-10"
        >
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-secondary border border-primary/10 p-6 shadow-warm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-cream ring-2 ring-accent/40 grid place-items-center text-3xl font-display text-primary">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (displayName || user?.email || "U").charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-warm hover:scale-105 transition-transform disabled:opacity-60"
                    aria-label="Change profile picture"
                  >
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onUploadAvatar}
                  />
                </div>
                <p className="mt-4 font-display text-lg text-primary">
                  {displayName || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-primary/80 hover:bg-accent/15"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div>
            {tab === "profile" && (
              <div className="space-y-8">
                <div>
                  <h1 className="font-display text-3xl text-primary">Account Settings</h1>
                  <p className="text-muted-foreground mt-1">Manage your profile and login credentials.</p>
                </div>

                <div className="rounded-2xl bg-secondary border border-primary/10 p-6 md:p-8 space-y-5">
                  <h2 className="font-display text-xl text-primary">Personal information</h2>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
                      Display name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-cream/60 border border-primary/15 text-primary outline-none focus:border-accent/60 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
                      Email
                    </label>
                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full h-12 px-4 rounded-xl bg-cream/30 border border-primary/10 text-primary/60 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-primary/70 mb-2">
                      Phone
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555 0100"
                      className="w-full h-12 px-4 rounded-xl bg-cream/60 border border-primary/15 text-primary outline-none focus:border-accent/60 transition"
                    />
                  </div>

                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="h-11 px-6 rounded-full bg-primary text-primary-foreground text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {saving && <Loader2 className="animate-spin" size={14} />}
                    Save changes
                  </button>
                </div>

                <div className="rounded-2xl bg-secondary border border-primary/10 p-6 md:p-8 space-y-5">
                  <h2 className="font-display text-xl text-primary">Change password</h2>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 characters)"
                    className="w-full h-12 px-4 rounded-xl bg-cream/60 border border-primary/15 text-primary outline-none focus:border-accent/60 transition"
                  />
                  <button
                    onClick={updatePassword}
                    className="h-11 px-6 rounded-full border border-accent/40 text-primary text-sm uppercase tracking-[0.2em] hover:bg-accent/15 transition"
                  >
                    Update password
                  </button>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl text-primary">My Orders</h1>
                  <p className="text-muted-foreground mt-1">Your past purchases and their status.</p>
                </div>
                {orders.length === 0 ? (
                  <div className="rounded-2xl bg-secondary border border-primary/10 p-10 text-center">
                    <Package className="mx-auto text-accent mb-3" />
                    <p className="text-primary/80">You don't have any orders yet.</p>
                    <Link
                      to="/"
                      className="inline-block mt-4 text-accent underline-offset-4 hover:underline"
                    >
                      Start exploring
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o.id}
                        className="rounded-2xl bg-secondary border border-primary/10 p-6 shadow-warm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-primary/60">
                              Order · {o.id.slice(0, 8)}
                            </p>
                            <p className="text-primary mt-1">
                              {new Date(o.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs uppercase tracking-[0.2em]">
                              {o.status}
                            </span>
                            <p className="font-display text-xl text-primary mt-1">
                              {formatPrice(o.total_cents)}
                            </p>
                          </div>
                        </div>
                        <div className="border-t border-primary/10 pt-4 space-y-2">
                          {o.order_items?.map((it) => (
                            <div key={it.id} className="flex justify-between text-sm">
                              <span className="text-primary/85">
                                {it.product_sku && (
                                  <span className="font-mono text-[10px] tracking-wider mr-2 text-accent">{it.product_sku}</span>
                                )}
                                {it.product_name} × {it.quantity}
                              </span>
                              <span className="text-primary/70">
                                {formatPrice(it.unit_price_cents * it.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "wishlist" && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-3xl text-primary">Wishlist</h1>
                  <p className="text-muted-foreground mt-1">Saved items just for you.</p>
                </div>
                {wishlist.length === 0 ? (
                  <div className="rounded-2xl bg-secondary border border-primary/10 p-10 text-center">
                    <Heart className="mx-auto text-accent mb-3" />
                    <p className="text-primary/80">Your wishlist is empty.</p>
                    <Link
                      to="/"
                      className="inline-block mt-4 text-accent underline-offset-4 hover:underline"
                    >
                      Browse the menu
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((it) => (
                      <div
                        key={it.id}
                        className="group rounded-2xl bg-secondary border border-primary/10 overflow-hidden shadow-warm"
                      >
                        <Link to={it.category_slug ? `/category/${it.category_slug}` : "/"}>
                          <div className="aspect-square bg-cream overflow-hidden">
                            {it.product_image && (
                              <img
                                src={it.product_image}
                                alt={it.product_name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            )}
                          </div>
                        </Link>
                        <div className="p-4 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-display text-lg text-primary truncate">
                              {it.product_name}
                            </p>
                            {it.product_price && (
                              <p className="text-accent text-sm">{it.product_price}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromWishlist(it.product_key)}
                            className="w-9 h-9 rounded-full grid place-items-center text-primary/70 hover:text-destructive hover:bg-destructive/10 transition"
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
};

export default Account;
