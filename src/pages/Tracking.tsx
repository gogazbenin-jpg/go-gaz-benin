import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, Phone, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

const steps = [
  { label: "Commande reçue", icon: CheckCircle },
  { label: "Préparation en cours", icon: Package },
  { label: "Livreur en route", icon: Truck },
  { label: "Livraison effectuée", icon: CheckCircle },
];

const driver = { name: "Koffi Mensah", phone: "+229 97 12 34 56" };

const Tracking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState<{ trackingId: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("gogaz_order");
    if (data) setOrder(JSON.parse(data));
    else { navigate("/"); return; }

    const timers = [
      setTimeout(() => setCurrentStep(1), 3000),
      setTimeout(() => setCurrentStep(2), 7000),
      setTimeout(() => setCurrentStep(3), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  if (!order) return null;

  return (
    <PageTransition variant="slideUp">
      <div className="flex min-h-screen flex-col bg-background px-6 pb-8 pt-12">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Suivi de commande</h1>
        <p className="mb-2 text-sm text-muted-foreground">
          N° <span className="font-semibold" style={{ color: "#FF6B00" }}>{order.trackingId}</span>
        </p>

        {/* Driver card */}
        <div className="mb-8 mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(255,107,0,0.15)" }}>
            <User className="h-6 w-6" style={{ color: "#FF6B00" }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{driver.name}</p>
            <p className="text-sm text-muted-foreground">Livreur assigné</p>
          </div>
          <a href={`tel:${driver.phone.replace(/\s/g, "")}`} className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: "#FF6B00" }}>
            <Phone className="h-5 w-5" />
          </a>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#E0E0E0" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: currentStep === 3 ? "#27AE60" : "#27AE60" }}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
          {currentStep < 3 && (
            <motion.div
              className="h-full rounded-full -mt-2"
              style={{ backgroundColor: "#FF6B00", width: "5%" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>

        {/* Steps */}
        <div className="relative mb-8 flex flex-col gap-0">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive = i === currentStep;
            const isPending = i > currentStep;
            const Icon = step.icon;

            const iconColor = isCompleted || (i === 3 && isActive) ? "#27AE60" : isActive ? "#FF6B00" : "#9E9E9E";
            const textColor = isCompleted || (i === 3 && isActive) ? "#27AE60" : isActive ? "#FF6B00" : "#9E9E9E";
            const bgColor = isCompleted || (i === 3 && isActive) ? "#27AE60" : isActive ? "#FF6B00" : "#E0E0E0";
            const iconSize = i === 3 && isActive ? 32 : 24;

            return (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="flex items-center justify-center rounded-full transition-colors duration-500"
                    style={{
                      width: 40, height: 40,
                      backgroundColor: isPending ? "#E0E0E0" : bgColor,
                    }}
                    animate={isActive && i < 3 ? { scale: [1, 1.1, 1] } : {}}
                    transition={isActive ? { duration: 2, repeat: Infinity } : {}}
                  >
                    <Icon size={iconSize} className="text-white" />
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="my-1 h-10 w-0.5 transition-colors duration-500" style={{ backgroundColor: i < currentStep ? "#27AE60" : "#E0E0E0" }} />
                  )}
                </div>
                <div className="pt-2">
                  <p className="font-medium transition-colors duration-500" style={{ color: textColor, fontWeight: isActive ? 700 : 500 }}>
                    {i === 3 && isActive ? "Livré !" : step.label}
                  </p>
                  {isActive && i < 3 && <p className="text-xs" style={{ color: "#FF6B00" }}>En cours...</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Téléphone du livreur</p>
          <a href={`tel:${driver.phone.replace(/\s/g, "")}`} className="text-lg font-bold" style={{ color: "#FF6B00" }}>{driver.phone}</a>
        </div>

        <div className="mt-auto">
          <Button onClick={() => { localStorage.removeItem("gogaz_order"); navigate("/"); }} variant="outline" className="h-14 w-full rounded-2xl text-lg font-semibold">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Tracking;
