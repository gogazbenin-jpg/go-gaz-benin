import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gogazLogoLight from "@/assets/gogaz-logo-light.jpg";

const DriverLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");

  const handleSubmit = () => {
    if (step === "phone" && phone.replace(/\s/g, "").length >= 8) setStep("code");
    else if (step === "code" && code.length === 4) {
      localStorage.setItem("gogaz_driver", JSON.stringify({ phone, name: "Koffi Mensah" }));
      navigate("/driver/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-3 mb-8">
        <img src={gogazLogoLight} alt="GoGaz Livreur" className="w-[100px] object-contain" />
        <span className="text-lg font-medium text-muted-foreground">Espace Livreur</span>
      </div>

      <div className="w-full max-w-sm">
        {step === "phone" ? (
          <>
            <label className="mb-2 block text-sm font-medium text-foreground">Numéro de téléphone</label>
            <div className="relative mb-4">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input type="tel" placeholder="+229 97 XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl pl-12 text-base" />
            </div>
          </>
        ) : (
          <>
            <label className="mb-2 block text-sm font-medium text-foreground">Code de vérification</label>
            <div className="relative mb-2">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input type="text" inputMode="numeric" maxLength={4} placeholder="0000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="h-14 rounded-2xl pl-12 text-center text-2xl tracking-[0.5em] font-bold" />
            </div>
            <p className="mb-4 text-center text-xs text-muted-foreground">Entrez le code reçu par SMS</p>
          </>
        )}
        <Button onClick={handleSubmit} disabled={step === "phone" ? phone.replace(/\s/g, "").length < 8 : code.length < 4} className="h-14 w-full rounded-2xl text-lg font-semibold">
          {step === "phone" ? "Continuer" : "Se connecter"}
        </Button>
      </div>
    </div>
  );
};

export default DriverLogin;
