import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import gogazLogoLight from "@/assets/gogaz-logo-light.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = () => { if (phone.length >= 8) setStep("otp"); };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    if (value.length === 4) {
      localStorage.setItem("gogaz_user", JSON.stringify({ phone }));
      navigate("/order");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-12">
      {step === "otp" && (
        <button onClick={() => setStep("phone")} className="mb-6 flex items-center gap-1 text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Retour</span>
        </button>
      )}

      {step === "phone" ? (
        <div className="flex flex-1 flex-col">
          <div className="flex justify-center mb-6">
            <img src={gogazLogoLight} alt="GoGaz" className="w-[180px] object-contain" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Connexion</h1>
          <p className="mb-8 text-muted-foreground">Entrez votre numéro de téléphone pour continuer</p>
          <div className="relative mb-6">
            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input type="tel" placeholder="+229 XX XX XX XX" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl pl-12 text-lg" />
          </div>
          <Button onClick={handlePhoneSubmit} disabled={phone.length < 8} className="h-14 w-full rounded-2xl text-lg font-semibold">
            Continuer
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Mot de passe oublié ? <button className="font-semibold text-accent">Réinitialiser</button>
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Vérification</h1>
          <p className="mb-8 text-muted-foreground">Entrez le code envoyé au {phone}</p>
          <div className="mb-8 flex justify-center">
            <InputOTP maxLength={4} value={otp} onChange={handleOtpComplete}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-14 w-14 rounded-xl text-xl" />
                <InputOTPSlot index={1} className="h-14 w-14 rounded-xl text-xl" />
                <InputOTPSlot index={2} className="h-14 w-14 rounded-xl text-xl" />
                <InputOTPSlot index={3} className="h-14 w-14 rounded-xl text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Vous n'avez pas reçu de code ? <button className="font-semibold text-accent">Renvoyer</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
