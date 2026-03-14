import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Step = "contact" | "otp" | "newpw" | "success";

const strengthLabel = (pw: string) => {
  if (pw.length < 6) return { text: "Faible", color: "#EF4444", pct: 33 };
  if (!/\d/.test(pw)) return { text: "Moyen", color: "#F59E0B", pct: 66 };
  return { text: "Fort", color: "#4CAF50", pct: 100 };
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [codeTimer, setCodeTimer] = useState(299); // 4:59
  const [resendTimer, setResendTimer] = useState(60);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = strengthLabel(password);

  // Code expiry countdown
  useEffect(() => {
    if (step !== "otp") return;
    const id = setInterval(() => {
      setCodeTimer(t => {
        if (t <= 0) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  // Resend countdown
  useEffect(() => {
    if (step !== "otp" || resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [step, resendTimer]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSendCode = () => {
    setStep("otp");
    setCodeTimer(299);
    setResendTimer(60);
    setOtpAttempts(0);
  };

  const handleResend = () => {
    setResendTimer(60);
    setCodeTimer(299);
    setOtp("");
  };

  const handleOtpComplete = (val: string) => {
    setOtp(val);
    if (val.length === 4) {
      if (otpAttempts >= 2) return; // max 3 attempts
      // Simulated verification
      if (val === "1234") {
        setStep("newpw");
      } else {
        setOtpAttempts(a => a + 1);
      }
    }
  };

  const handleReset = () => {
    // Update stored user password (simulated)
    setStep("success");
  };

  const back = () => {
    if (step === "contact") navigate(-1);
    else if (step === "otp") setStep("contact");
    else if (step === "newpw") setStep("otp");
  };

  if (step === "success") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <CheckCircle size={48} style={{ color: "#4CAF50" }} />
        <h1 className="mt-4 text-xl font-bold text-foreground">Mot de passe modifié !</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe
        </p>
        <Button onClick={() => navigate("/login", { replace: true })} className="mt-6 h-12 rounded-2xl px-8 text-base font-semibold" style={{ backgroundColor: "#4CAF50" }}>
          Se connecter maintenant
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pt-6">
      <button onClick={back} className="mb-4 flex items-center gap-1 text-muted-foreground">
        <ArrowLeft size={20} />
        <span className="text-sm">Retour</span>
      </button>

      <h1 className="text-xl font-bold text-foreground">Mot de passe oublié</h1>
      <p className="mb-6 text-sm text-muted-foreground">Pas de panique, on vous aide !</p>

      <AnimatePresence mode="wait">
        {step === "contact" && (
          <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Entrez votre email ou numéro de téléphone pour recevoir un code de réinitialisation
            </p>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Email ou numéro de téléphone" value={contact} onChange={e => setContact(e.target.value)} className="h-12 rounded-xl pl-10" />
            </div>
            <Button onClick={handleSendCode} disabled={!contact} className="mt-4 h-14 w-full rounded-2xl text-base font-semibold" style={{ backgroundColor: "#4CAF50" }}>
              Recevoir le code
            </Button>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col items-center gap-6">
            <p className="text-sm text-muted-foreground">Un code a été envoyé à {contact}</p>

            <InputOTP maxLength={4} value={otp} onChange={handleOtpComplete}>
              <InputOTPGroup>
                {[0, 1, 2, 3].map(i => (
                  <InputOTPSlot key={i} index={i} className="h-14 w-14 rounded-xl text-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {otpAttempts >= 3 && (
              <p className="text-sm text-destructive">Trop de tentatives. Renvoyez un nouveau code.</p>
            )}

            <p className={`text-sm font-medium ${codeTimer < 60 ? "text-destructive" : "text-muted-foreground"}`}>
              Code expire dans {fmt(codeTimer)}
            </p>

            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className={`text-sm font-medium ${resendTimer > 0 ? "text-muted-foreground/50" : ""}`}
              style={resendTimer <= 0 ? { color: "#1565C0" } : undefined}
            >
              {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : "Renvoyer le code"}
            </button>
          </motion.div>
        )}

        {step === "newpw" && (
          <motion.div key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col gap-4">
            <h2 className="text-lg font-bold text-foreground">Nouveau mot de passe</h2>

            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type={showPw ? "text" : "password"} placeholder="Nouveau mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl pl-10 pr-10" />
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
              <Input type={showConfirm ? "text" : "password"} placeholder="Confirmer le mot de passe" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={`h-12 rounded-xl pl-10 pr-10 ${confirmPw.length > 0 && confirmPw !== password ? "border-destructive" : ""}`} />
              <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPw.length > 0 && confirmPw !== password && (
              <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
            )}

            <Button onClick={handleReset} disabled={password.length < 6 || password !== confirmPw} className="mt-4 h-14 w-full rounded-2xl text-base font-semibold" style={{ backgroundColor: "#4CAF50" }}>
              Réinitialiser mon mot de passe
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
