import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, formatPrice, resolveImage, type DbProduct } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, ShieldCheck } from "lucide-react";

type OrderItemRow = {
  id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price_cents: number;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: OrderItemRow[];
  profile?: { display_name: string | null; phone: string | null } | null;
};

const CATEGORY_OPTIONS = [
  { value: "bestseller", label: "Bestseller" },
  { value: "drinks", label: "Drinks" },
  { value: "espresso", label: "Espresso" },
  { value: "merchandise", label: "Merchandise" },
  { value: "home", label: "Coffee At Home" },
];

const emptyForm = {
  slug: "",
  name: "",
  flavor: "",
  price_cents: 0,
  image_url: "",
  origin: "",
  roast: "",
  notes: "",
  ingredients: "",
  active: true,
  sort_order: 0,
  category: "bestseller",
  stock: 0,
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { products, refresh } = useProducts({ includeInactive: true });
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (isAdmin) loadOrders();
  }, [isAdmin]);

  const loadOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("id, user_id, status, total_cents, created_at, order_items(id, product_name, product_sku, quantity, unit_price_cents)")
      .order("created_at", { ascending: false });
    const list = (data as any[]) || [];
    // Fetch profile info per unique user
    const userIds = Array.from(new Set(list.map((o) => o.user_id)));
    let profiles: Record<string, { display_name: string | null; phone: string | null }> = {};
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name, phone")
        .in("user_id", userIds);
      (profs || []).forEach((p: any) => {
        profiles[p.user_id] = { display_name: p.display_name, phone: p.phone };
      });
    }
    setOrders(list.map((o) => ({ ...o, profile: profiles[o.user_id] || null })));
  };

  const claimAdmin = async () => {
    setClaiming(true);
    const { data, error } = await supabase.rpc("claim_first_admin");
    setClaiming(false);
    if (error || !data) {
      toast.error("Admin already exists. Ask an admin to grant you access.");
    } else {
      toast.success("You are now admin! Reloading...");
      setTimeout(() => window.location.reload(), 800);
    }
  };

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6">
        <div className="max-w-md text-center space-y-5">
          <ShieldCheck className="w-12 h-12 mx-auto text-accent" />
          <h1 className="font-display text-3xl text-primary">Admins only</h1>
          <p className="text-muted-foreground">
            You need the admin role to access this panel. If no admin exists yet, you can claim it as the first user.
          </p>
          <Button onClick={claimAdmin} disabled={claiming} className="rounded-full">
            {claiming ? "Claiming..." : "Claim Admin (first user only)"}
          </Button>
          <div>
            <Link to="/" className="text-sm text-accent hover:underline">← Back to site</Link>
          </div>
        </div>
      </div>
    );
  }

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: DbProduct) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      name: p.name,
      flavor: p.flavor || "",
      price_cents: p.price_cents,
      image_url: p.image_url || "",
      origin: p.origin || "",
      roast: p.roast || "",
      notes: p.notes || "",
      ingredients: (p.ingredients || []).join(", "),
      active: p.active,
      sort_order: p.sort_order,
      category: p.category || "bestseller",
      stock: p.stock ?? 0,
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      slug: form.slug,
      name: form.name,
      flavor: form.flavor,
      price_cents: Number(form.price_cents),
      image_url: form.image_url || null,
      origin: form.origin,
      roast: form.roast,
      notes: form.notes,
      ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      active: form.active,
      sort_order: Number(form.sort_order),
      category: form.category,
      stock: Number(form.stock),
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Product updated" : "Product created");
    setOpen(false);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display text-2xl text-primary">Admin Panel</h1>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-accent">Lounge Coffee</span>
        </div>
      </header>

      <main className="container py-10">
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <div className="flex justify-between mb-5">
              <h2 className="font-display text-xl text-primary">Products ({products.length})</h2>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNew} className="rounded-full"><Plus className="w-4 h-4 mr-1" /> New product</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Field label="Slug"><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></Field>
                    <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                    <Field label="Flavor"><Input value={form.flavor} onChange={(e) => setForm({ ...form, flavor: e.target.value })} /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Category">
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Stock"><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></Field>
                    </div>
                    <Field label="Price (cents)"><Input type="number" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: +e.target.value })} /></Field>
                    <Field label="Image URL"><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
                    {editing?.sku && (
                      <div className="text-xs text-muted-foreground">SKU: <span className="font-mono text-primary">{editing.sku}</span> (auto-generated)</div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Origin"><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} /></Field>
                      <Field label="Roast"><Input value={form.roast} onChange={(e) => setForm({ ...form, roast: e.target.value })} /></Field>
                    </div>
                    <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
                    <Field label="Ingredients (comma-separated)"><Input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} /></Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Sort order"><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: +e.target.value })} /></Field>
                      <div className="flex items-end gap-2 pb-2"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Visible</Label></div>
                    </div>
                    <Button onClick={save} className="w-full">{editing ? "Update" : "Create"}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                  <img src={resolveImage(p.image_url)} alt={p.name} className="w-14 h-14 object-contain rounded-lg bg-secondary/40" />
                  <div className="flex-1">
                    <div className="font-display text-lg text-primary flex items-center gap-2 flex-wrap">
                      {p.name}
                      {p.sku && <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-secondary/60 text-muted-foreground">{p.sku}</span>}
                      {!p.active && <span className="text-xs text-muted-foreground">(hidden)</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {p.category}{p.flavor ? ` · ${p.flavor}` : ""} · {formatPrice(p.price_cents)} · Stock: {p.stock ?? 0}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <h2 className="font-display text-xl text-primary mb-5">Orders ({orders.length})</h2>
            <div className="grid gap-3">
              {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</div>
                      <div className="font-display text-lg text-primary">{formatPrice(o.total_cents)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                      {o.profile && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Customer: <span className="text-primary">{o.profile.display_name || "—"}</span>
                          {o.profile.phone ? ` · ${o.profile.phone}` : ""}
                        </div>
                      )}
                    </div>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      {["pending", "processing", "paid", "shipped", "delivered", "cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {o.order_items?.length > 0 && (
                    <div className="border-t border-border pt-2 space-y-1">
                      {o.order_items.map((it) => (
                        <div key={it.id} className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {it.product_sku && <span className="font-mono text-primary mr-2">{it.product_sku}</span>}
                            {it.product_name} × {it.quantity}
                          </span>
                          <span>{formatPrice(it.unit_price_cents * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default Admin;
