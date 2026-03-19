import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LOCKOUT_MS = 5 * 60 * 1000;

const Login = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [failures, setFailures] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const locked = lockUntil > Date.now();

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      const rem = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
      setCountdown(rem);
      if (rem <= 0) { setLockUntil(0); setFailures(0); }
    }, 1000);
    return () => clearInterval(id);
  }, [lockUntil, locked]);

  const handleLogin = () => {
    if (locked) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      const emailLower = contact.trim().toLowerCase();

      // Admin role
      if (emailLower === "admin@gogaz.com" && password === "123456") {
        localStorage.setItem("gogaz_admin", JSON.stringify({ email: emailLower, role: "admin" }));
        setLoading(false);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Driver role
      if (emailLower === "livreur@gogaz.com" && password === "123456") {
        localStorage.setItem("gogaz_driver", JSON.stringify({ email: emailLower, role: "livreur" }));
        setLoading(false);
        navigate("/driver/home", { replace: true });
        return;
      }

      // Client role
      const stored = localStorage.getItem("gogaz_user");
      if (!stored) { handleFailure(); return; }
      const user = JSON.parse(stored);
      const match = user.contact === contact ||
        user.contact === `+229${contact}` ||
        (user.contact && contact.includes("@") && user.contact === contact);

      if (!match) { handleFailure(); return; }

      localStorage.setItem("gogaz_session", JSON.stringify({ expires: Date.now() + 30 * 86400000 }));
      setLoading(false);
      navigate("/home", { replace: true });
    }, 800);
  };

  const handleFailure = () => {
    const newF = failures + 1;
    setFailures(newF);
    setLoading(false);
    if (newF >= 3) {
      setLockUntil(Date.now() + LOCKOUT_MS);
      setError("Trop de tentatives. Réessayez dans 5 minutes.");
    } else {
      setError("Email/téléphone ou mot de passe incorrect.");
    }
  };

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-muted-foreground">
        <ArrowLeft size={20} />
        <span className="text-sm">Retour</span>
      </button>

      <div className="flex flex-1 flex-col">
        <h1 className="text-xl font-bold text-foreground">Connexion</h1>
        <p className="mb-8 text-sm text-muted-foreground">Heureux de vous revoir !</p>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Email ou numéro de téléphone" value={contact} onChange={e => setContact(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type={showPw ? "text" : "password"} placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl pl-10 pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={() => navigate("/forgot-password")} className="self-end text-sm font-medium text-accent">
            Mot de passe oublié ?
          </button>

          {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {locked && countdown > 0 && (
            <p className="text-center text-sm font-medium text-muted-foreground">Réessayer dans {formatCountdown(countdown)}</p>
          )}

          <Button onClick={handleLogin} disabled={!contact || !password || loading || locked} className="mt-2 h-14 w-full rounded-2xl text-base font-semibold">
            {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Connexion...</> : "Se connecter"}
          </Button>
        </div>

        <button
          onClick={() => navigate("/driver/home")}
          className="mt-8 self-center text-xs text-muted-foreground underline underline-offset-2"
        >
          Espace livreur
        </button>
      </div>
    </div>
  );
};

export default Login;
