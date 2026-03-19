import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gogazLogoDark from "@/assets/gogaz-logo-dark.jpg";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "admin@gogaz.com";
const ADMIN_PASSWORD = "123456";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || password.length < 4) return;
    setLoading(true);

    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("gogaz_admin", JSON.stringify({ email, role: "admin" }));
        toast({ title: "Bienvenue, Administrateur", description: "Connexion réussie." });
        navigate("/admin/dashboard", { replace: true });
      } else {
        // Not admin → redirect to client app
        toast({ title: "Connexion client", description: "Redirection vers l'application." });
        navigate("/home", { replace: true });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(213,40%,12%)] px-6">
      <div className="flex flex-col items-center gap-3 mb-8">
        <img src={gogazLogoDark} alt="GoGaz" className="w-[160px] object-contain mb-2" />
        <span className="text-lg font-semibold text-[hsl(213,15%,65%)]">Connexion</span>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(213,15%,70%)]">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(213,15%,45%)]" />
            <Input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl pl-12 border-[hsl(213,20%,25%)] bg-[hsl(213,30%,18%)] text-white placeholder:text-[hsl(213,15%,45%)]"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(213,15%,70%)]">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(213,15%,45%)]" />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl pl-12 border-[hsl(213,20%,25%)] bg-[hsl(213,30%,18%)] text-white placeholder:text-[hsl(213,15%,45%)]"
            />
          </div>
        </div>
        <Button
          onClick={handleLogin}
          disabled={!email.trim() || password.length < 4 || loading}
          className="h-14 w-full rounded-2xl text-lg font-semibold"
        >
          {loading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Connexion...</> : "Se connecter"}
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
