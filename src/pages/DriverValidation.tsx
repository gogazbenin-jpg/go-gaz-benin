import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, Phone, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const CORRECT_CODE = "1234";
const MAX_ATTEMPTS = 3;

const DriverValidation = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "blocked">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setStatus("idle");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleValidate = () => {
    const entered = code.join("");
    if (entered.length < 4) return;

    if (entered === CORRECT_CODE) {
      setStatus("success");
      if (navigator.vibrate) navigator.vibrate(100);
      setTimeout(() => navigate("/driver/home"), 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus(newAttempts >= MAX_ATTEMPTS ? "blocked" : "error");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setCode(["", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const getBorderColor = (index: number) => {
    if (status === "success") return "#27AE60";
    if (status === "error" || status === "blocked") return "hsl(var(--destructive))";
    if (code[index]) return "#FF6B00";
    return "#E0E0E0";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="px-4 pb-4 pt-8 rounded-b-3xl" style={{ backgroundColor: "#27AE60" }}>
        <h1 className="text-lg font-bold text-white text-center font-[Poppins]">Validation livraison</h1>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-10">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 mt-10"
            >
              <CheckCircle size={64} className="text-[#27AE60]" />
              <p className="text-xl font-bold text-[#27AE60] font-[Poppins]">Livraison confirmée !</p>
              <p className="text-sm text-primary font-medium">+ 1 500 FCFA ajoutés à vos gains</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full"
            >
              <Lock size={48} className="text-primary mb-4" />
              <p className="text-lg font-bold text-foreground text-center font-[Poppins] mb-1">
                Demandez le code au client
              </p>
              <p className="text-[13px] text-muted-foreground text-center mb-8">
                Le client voit ce code dans son application
              </p>

              {/* OTP Inputs */}
              <div className="flex gap-3 mb-6">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-[70px] w-[60px] rounded-xl border-2 bg-card text-center text-[28px] font-bold text-foreground outline-none transition-colors"
                    style={{ borderColor: getBorderColor(i) }}
                  />
                ))}
              </div>

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-1 mb-4"
                >
                  <p className="text-sm text-destructive font-medium">Code incorrect — Réessayez</p>
                  <p className="text-xs text-muted-foreground">
                    {MAX_ATTEMPTS - attempts} tentative{MAX_ATTEMPTS - attempts > 1 ? "s" : ""} restante{MAX_ATTEMPTS - attempts > 1 ? "s" : ""}
                  </p>
                </motion.div>
              )}

              {status === "blocked" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 mb-4"
                >
                  <AlertTriangle size={24} className="text-destructive" />
                  <p className="text-sm text-destructive font-medium text-center">
                    Contactez le support GoGaz
                  </p>
                  <a
                    href="tel:+22900000000"
                    className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
                  >
                    <Phone size={18} /> Appeler le support
                  </a>
                </motion.div>
              )}

              {status !== "blocked" && (
                <Button
                  onClick={handleValidate}
                  disabled={code.some((d) => !d)}
                  className="h-[54px] w-[90%] rounded-[14px] text-base font-bold text-white"
                  style={{ backgroundColor: "#27AE60" }}
                >
                  Valider la livraison
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverValidation;
