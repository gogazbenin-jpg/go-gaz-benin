import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Bike, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { label: "Commande reçue", icon: CheckCircle },
  { label: "Livreur en route", icon: Bike },
  { label: "Livraison en cours", icon: MapPin },
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
    <div className="flex min-h-screen flex-col bg-background px-6 pb-8 pt-12">
      <h1 className="mb-1 text-2xl font-bold text-foreground">Suivi de commande</h1>
      <p className="mb-2 text-sm text-muted-foreground">
        N° <span className="font-semibold text-primary">{order.trackingId}</span>
      </p>

      <div className="mb-8 mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{driver.name}</p>
          <p className="text-sm text-muted-foreground">Livreur assigné</p>
        </div>
        <a href={`tel:${driver.phone.replace(/\s/g, "")}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
          <Phone className="h-5 w-5" />
        </a>
      </div>

      <div className="relative mb-8 flex flex-col gap-0">
        {steps.map((step, i) => {
          const isActive = i <= currentStep;
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 ${
                  isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                {i < steps.length - 1 && (
                  <div className={`my-1 h-10 w-0.5 transition-colors duration-500 ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
              <div className="pt-2">
                <p className={`font-medium transition-colors duration-500 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
                {i === currentStep && <p className="text-xs text-primary">En cours...</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Téléphone du livreur</p>
        <a href={`tel:${driver.phone.replace(/\s/g, "")}`} className="text-lg font-bold text-primary">{driver.phone}</a>
      </div>

      <div className="mt-auto">
        <Button onClick={() => { localStorage.removeItem("gogaz_order"); navigate("/"); }} variant="outline" className="h-14 w-full rounded-2xl text-lg font-semibold">
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default Tracking;
