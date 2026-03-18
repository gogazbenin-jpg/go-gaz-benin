import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const orderData = {
  id: "#00123",
  client: "Koffi Mensah",
  phone: "+229 96 00 00 00",
  address: "Akpakpa, près pharmacie centrale, maison bleue portail noir",
  product: "Oryx 12kg",
  amount: 11000,
};

const steps = [
  { label: "Je prépare la commande", type: "orange" as const },
  { label: "Je suis en route", type: "orange" as const },
  { label: "Je suis arrivé", type: "orange" as const },
  { label: "Valider la livraison", type: "green" as const },
];

const DriverDelivery = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleStep = (index: number) => {
    if (index !== currentStep) return;
    if (index === 2) {
      setCurrentStep(3);
      return;
    }
    if (index === 3) {
      navigate("/driver/validation");
      return;
    }
    setCurrentStep(index + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="px-4 pb-4 pt-8 rounded-b-3xl" style={{ background: "linear-gradient(135deg, #FF6B00, #E65C00)" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/driver/home")} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white font-[Poppins]">Livraison en cours</h1>
            <p className="text-sm text-white/70">{orderData.id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4 pb-6">
        {/* Client Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border bg-card p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <span className="text-base font-bold text-foreground">{orderData.client}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <span className="text-sm text-foreground">{orderData.phone}</span>
            </div>
            <a
              href={`tel:${orderData.phone.replace(/\s/g, "")}`}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: "#27AE60" }}
            >
              Appeler
            </a>
          </div>
          <div className="flex items-start gap-2">
            <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{orderData.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary" />
            <span className="text-sm text-foreground">
              {orderData.product} — <span className="font-semibold text-primary">{formatPrice(orderData.amount)}</span>
            </span>
          </div>
        </motion.div>

        {/* Steps */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Étapes de livraison
        </h2>

        <div className="flex flex-col gap-3">
          {steps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleStep(index)}
                  disabled={!active}
                  className={`h-14 w-full rounded-xl text-sm font-semibold gap-2 ${
                    completed
                      ? "bg-muted text-muted-foreground line-through"
                      : active
                        ? "text-white"
                        : "bg-muted text-muted-foreground opacity-50"
                  }`}
                  style={
                    active
                      ? { backgroundColor: step.type === "green" ? "#27AE60" : "#FF6B00" }
                      : completed
                        ? {}
                        : {}
                  }
                >
                  {completed && <CheckCircle size={18} className="text-[#27AE60]" />}
                  {step.label}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DriverDelivery;
