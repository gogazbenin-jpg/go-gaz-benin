import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gogazLogoDark from "@/assets/gogaz-logo-dark.jpg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() && password.length >= 4) {
      localStorage.setItem("gogaz_admin", JSON.stringify({ email }));
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[hsl(213,40%,12%)] px-6">
      <div className="flex flex-col items-center gap-3 mb-8">
        <img src={gogazLogoDark} alt="GoGaz Admin" className="w-[180px] object-contain mb-2" />
        <span className="text-lg font-medium text-[hsl(213,15%,60%)]">Administration</span>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(213,15%,70%)]">Email</label>
          <Input type="email" placeholder="admin@gogaz.bj" value={email} onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl border-[hsl(213,20%,25%)] bg-[hsl(213,30%,18%)] text-white placeholder:text-[hsl(213,15%,45%)]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[hsl(213,15%,70%)]">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[hsl(213,15%,45%)]" />
            <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl pl-12 border-[hsl(213,20%,25%)] bg-[hsl(213,30%,18%)] text-white placeholder:text-[hsl(213,15%,45%)]" />
          </div>
        </div>
        <Button onClick={handleLogin} disabled={!email.trim() || password.length < 4} className="h-14 w-full rounded-2xl text-lg font-semibold">
          Se connecter
        </Button>
        <p className="text-center text-xs text-[hsl(213,15%,50%)]">
          Mot de passe oublié ? <button className="font-semibold text-accent">Réinitialiser</button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
