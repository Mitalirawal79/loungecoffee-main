import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Coffee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import coffeeBean from "@/assets/coffee-bean.png";

const beans = Array.from({ length: 38 }).map((_, i) => {
  const layer = i % 3;
  const sizeBase = layer === 0 ? 14 : layer === 1 ? 26 : 44;
  const sizeVar = layer === 0 ? 14 : layer === 1 ? 22 : 36;
  return {
    id: i,
    layer,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: sizeBase + Math.random() * sizeVar,
    duration: 18 + Math.random() * 26,
    delay: Math.random() * 10,
    rotate: Math.random() * 360,
    drift: 30 + Math.random() * 80,
    sway: 20 + Math.random() * 60,
    opacity: layer === 0 ? 0.06 + Math.random() * 0.08 : layer === 1 ? 0.12 + Math.random() * 0.12 : 0.2 + Math.random() * 0.15,
    blur: layer === 0 ? 2.5 : layer === 1 ? 1 : 0,
  };
});

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
        navigate("/");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-warm text-cream">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-glow blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-52 -right-40 h-[620px] w-[620px] rounded-full bg-gradient-glow blur-3xl opacity-50" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {beans.map((b) => (
          <motion.img
            key={b.id}
            src={coffeeBean}
            alt=""
            className="absolute select-none will-change-transform"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.size,
              height: b.size,
              opacity: b.opacity,
              filter: `drop-shadow(0 8px 18px rgba(0,0,0,0.55)) blur(${b.blur}px)`,
              zIndex: b.layer,
            }}
            animate={{
              y: [0, -b.drift, 0, b.drift * 0.5, 0],
              x: [0, b.sway, 0, -b.sway * 0.6, 0],
              rotate: [b.rotate, b.rotate + 360],
            }}
            transition={{
              y: { duration: b.duration, repeat: Infinity, ease: "easeInOut", delay: b.delay },
              x: { duration: b.duration * 1.2, repeat: Infinity, ease: "easeInOut", delay: b.delay },
              rotate: { duration: b.duration * (b.layer === 2 ? 2.5 : b.layer === 1 ? 3.5 : 5), repeat: Infinity, ease: "linear" },
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative w-full max-w-md"
        >
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[hsl(34_70%_55%/0.5)] via-transparent to-[hsl(34_70%_55%/0.2)] opacity-80 blur-[1px]" />

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative rounded-3xl border border-[hsl(34_50%_64%/0.25)] bg-[hsl(22_45%_8%/0.55)] p-8 shadow-warm backdrop-blur-2xl sm:p-10"
            style={{ boxShadow: "0 30px 80px -20px hsl(22 60% 3% / 0.8), inset 0 1px 0 hsl(34 60% 70% / 0.15)" }}
          >
            <motion.div variants={item} className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[hsl(34_70%_55%)] to-[hsl(22_50%_18%)] text-cream shadow-glow">
                  <Coffee className="h-5 w-5" />
                </div>
                <div className="text-left leading-tight">
                  <div className="font-display text-xl tracking-wide text-cream">Lounge</div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-[hsl(34_50%_70%)]">Coffee</div>
                </div>
              </div>
              <h1 className="font-display text-3xl text-cream sm:text-4xl">
                {mode === "login" ? "Welcome Back" : "Join the Lounge"}
              </h1>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-[hsl(32_30%_78%/0.8)]">
                {mode === "login"
                  ? "Sign in to continue your premium coffee journey."
                  : "Create your account and start brewing."}
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <motion.div variants={item} className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-[0.2em] text-[hsl(32_30%_78%/0.85)]">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="h-12 rounded-xl border-[hsl(34_50%_64%/0.25)] bg-[hsl(22_40%_10%/0.55)] px-4 text-cream placeholder:text-[hsl(32_20%_60%/0.55)]"
                  />
                </motion.div>
              )}

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[hsl(32_30%_78%/0.85)]">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(34_50%_70%)]" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@lounge.coffee"
                    className="h-12 rounded-xl border-[hsl(34_50%_64%/0.25)] bg-[hsl(22_40%_10%/0.55)] pl-10 text-cream placeholder:text-[hsl(32_20%_60%/0.55)]"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-[hsl(32_30%_78%/0.85)]">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(34_50%_70%)]" />
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-[hsl(34_50%_64%/0.25)] bg-[hsl(22_40%_10%/0.55)] px-10 text-cream placeholder:text-[hsl(32_20%_60%/0.55)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(34_50%_70%)] transition hover:text-cream"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <Button
                  type="submit"
                  disabled={busy}
                  className="group relative h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[hsl(30_50%_30%)] via-[hsl(34_70%_55%)] to-[hsl(30_50%_30%)] text-cream shadow-glow transition-transform duration-300 hover:scale-[1.01] disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="relative z-10 tracking-[0.18em] uppercase text-sm font-medium">
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </span>
                  )}
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Button>
              </motion.div>

              <motion.div variants={item} className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(34_50%_64%/0.4)] to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[hsl(32_30%_78%/0.6)]">or</span>
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[hsl(34_50%_64%/0.4)] to-transparent" />
              </motion.div>

              <motion.div variants={item}>
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={busy}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[hsl(34_50%_64%/0.25)] bg-[hsl(22_40%_10%/0.55)] text-sm text-cream backdrop-blur transition hover:bg-[hsl(22_40%_14%/0.7)] hover:border-[hsl(34_70%_55%/0.5)] disabled:opacity-60"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
                  </svg>
                  Continue with Google
                </button>
              </motion.div>

              <motion.p variants={item} className="pt-2 text-center text-xs text-[hsl(32_30%_78%/0.7)]">
                {mode === "login" ? "New to Lounge?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-[hsl(34_60%_72%)] underline-offset-4 hover:underline"
                >
                  {mode === "login" ? "Create an account" : "Sign in"}
                </button>
                {" · "}
                <Link to="/" className="text-[hsl(34_60%_72%)] underline-offset-4 hover:underline">Back home</Link>
              </motion.p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
