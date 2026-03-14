import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Home as HomeIcon,
  Map, Navigation, Lock, Eye, EyeOff, Gift, CheckCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

type Step = 1 | 2 | 3 | "success";

const PHONE_PREFIXES = ["96", "97", "64", "61"];

const strengthLabel = (pw: string) => {
  if (pw.length < 6) return { text: "Faible", color: "#EF4444", pct: 33 };
  if (!/\d/.test(pw)) return { text: "Moyen", color: "#F59E0B", pct: 66 };
  return { text: "Fort", color: "#27AE60", pct: 100 };
};

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactMode, setContactMode] = useState<"email" | "phone">("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [quartier, setQuartier] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("Cotonou");

  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [referral, setReferral] = useState("");

  const phoneValid = phone.length === 8 && PHONE_PREFIXES.some(p => phone.startsWith(p));
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const step1Valid = firstName.length >= 2 && lastName.length >= 2 && (contactMode === "email" ? emailValid : phoneValid);
  const step2Valid = quartier.length >= 2;
  const step3Valid = password.length >= 6 && password === confirmPw;

  const strength = strengthLabel(password);

  const handleGeo = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(() => { setQuartier("Position détectée"); });
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      const user = {
        firstName, lastName,
        contact: contactMode === "email" ? email : `+229${phone}`,
        quartier, adresse, ville, referral, createdAt: Date.now()
      };
      localStorage.setItem("gogaz_user", JSON.stringify(user));
      localStorage.setItem("gogaz_session", JSON.stringify({ expires: Date.now() + 30 * 86400000 }));
      setLoading(false);
      setStep("success");
      setTimeout(() => navigate("/home", { replace: true }), 2000);
    }, 1500);
  };

  const back = () => {
    if (step === 1) navigate(-1);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  if (step === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <CheckCircle size={64} className="text-[#27AE60]" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Compte créé avec succès !</h1>
        <p className="mt-2 text-muted-foreground">Bienvenue sur GoGaz, {firstName} !</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-6 pb-8">
      <div className="mb-6">
        <button onClick={back} className="mb-4 flex items-center gap-1 text-muted-foreground">
          <ArrowLeft size={20} />
          <span className="text-sm">Retour</span>
        </button>
        <h1 className="text-xl font-bold text-foreground">
          {step === 1 && "Créer mon compte"}
          {step === 2 && "Mon adresse"}
          {step === 3 && "Sécuriser mon compte"}
        </h1>
        <Progress value={step === 1 ? 33 : step === 2 ? 66 : 100} className="mt-3 h-2" />
        <p className="mt-1 text-xs text-muted-foreground">Étape {step as number} sur 3</p>
      </div>

      {step === 1 && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>

          {contactMode === "phone" ? (
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground">+229</span>
              <Input type="tel" placeholder="96 XX XX XX" value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 8))}
                className="h-12 rounded-xl pl-[5.5rem]" />
              {phone.length > 0 && !phoneValid && (
                <p className="mt-1 text-xs text-destructive">Numéro invalide. Ex: 96 00 00 00</p>
              )}
            </div>
          ) : (
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl pl-10" />
            </div>
          )}

          <button onClick={() => setContactMode(contactMode === "phone" ? "email" : "phone")} className="text-center text-xs text-muted-foreground">
            -- ou utiliser {contactMode === "phone" ? "un email" : "un téléphone"} --
          </button>

          <div className="mt-auto">
            <Button onClick={() => setStep(2)} disabled={!step1Valid} className="h-14 w-full rounded-2xl text-base font-semibold">
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative">
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Ex: Akpakpa, Cadjehoun" value={quartier} onChange={e => setQuartier(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>
          <div className="relative">
            <HomeIcon size={18} className="absolute left-3 top-4 text-muted-foreground" />
            <Textarea placeholder="Ex: Près de la pharmacie, maison bleue portail noir" value={adresse} onChange={e => setAdresse(e.target.value.slice(0, 150))} className="min-h-[80px] rounded-xl pl-10" />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">{adresse.length}/150</span>
          </div>
          <div className="relative">
            <Map size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
            <Select value={ville} onValueChange={setVille}>
              <SelectTrigger className="h-12 rounded-xl pl-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cotonou">Cotonou</SelectItem>
                <SelectItem value="Abomey-Calavi">Abomey-Calavi</SelectItem>
                <SelectItem value="Sème-Podji">Sème-Podji</SelectItem>
                <SelectItem value="Porto-Novo">Porto-Novo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button onClick={handleGeo} className="flex items-center gap-2 text-sm text-accent">
            <Navigation size={18} /> Utiliser ma position
          </button>
          <div className="mt-auto">
            <Button onClick={() => setStep(3)} disabled={!step2Valid} className="h-14 w-full rounded-2xl text-base font-semibold">
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-1 flex-col gap-4">
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type={showPw ? "text" : "password"} placeholder="Créer un mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl pl-10 pr-10" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted">
                <div className="h-full rounded-full transition-all" style={{ width: `${strength.pct}%`, backgroundColor: strength.color }} />
              </div>
              <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.text}</span>
            </div>
          )}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type={showConfirm ? "text" : "password"} placeholder="Répétez le mot de passe" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              className={`h-12 rounded-xl pl-10 pr-10 ${confirmPw.length > 0 && confirmPw !== password ? "border-destructive" : ""}`} />
            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPw.length > 0 && confirmPw !== password && (
            <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
          )}
          <div className="relative">
            <Gift size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Code d'un ami GoGaz" value={referral} onChange={e => setReferral(e.target.value)} className="h-12 rounded-xl pl-10" />
          </div>
          <p className="text-xs text-muted-foreground">Optionnel - Réduction sur votre 1ère commande</p>
          <div className="mt-auto">
            <Button onClick={handleSubmit} disabled={!step3Valid || loading} className="h-14 w-full rounded-2xl text-base font-semibold">
              {loading ? <><Loader2 size={18} className="mr-2 animate-spin" /> Création...</> : "Créer mon compte"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
