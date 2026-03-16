import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Lock, CreditCard, Star, MapPin, Phone, Mail, ArrowRight, Smartphone, Truck, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import stepsImg from "@/assets/onboarding-steps.png";
import gogazLogo from "@/assets/gogaz-logo-new.png";

const TOTAL_SLIDES = 4;

const Onboarding = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const finish = useCallback(() => {
    localStorage.setItem("gogaz_onboarding_done", "true");
    navigate("/auth");
  }, [navigate]);

  const next = () => {
    if (current === TOTAL_SLIDES - 1) return finish();
    setCurrent((p) => p + 1);
  };

  const goTo = (i: number) => setCurrent(i);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : (current > 0 && setCurrent(p => p - 1));
    }
    setTouchStart(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {current < TOTAL_SLIDES - 1 && (
        <button onClick={finish} className="absolute right-4 top-4 z-20 text-sm font-medium text-muted-foreground">Passer</button>
      )}

      <div className="flex-1 flex flex-col">
        {current === 0 && <Slide1 />}
        {current === 1 && <Slide2 />}
        {current === 2 && <Slide3 />}
        {current === 3 && <Slide4 onStart={finish} />}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 px-6 pb-8">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : "w-2.5 bg-border"}`} />
          ))}
        </div>
        {current < TOTAL_SLIDES - 1 && (
          <Button onClick={next} className="h-14 w-full max-w-xs rounded-2xl text-lg font-semibold gap-2">
            Suivant <ArrowRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

const Slide1 = () => (
  <div className="flex flex-1 flex-col items-center px-6 text-center bg-white">
    <div className="flex w-full justify-center pt-20 pb-10">
      <img src={gogazLogo} alt="GoGaz" className="w-[200px] h-auto object-contain block" />
    </div>
    <h1 className="mb-2 text-[28px] font-extrabold" style={{ color: "#1A1A1A" }}>
      Bienvenue sur <span className="text-primary">GoGaz</span>
    </h1>
    <p className="max-w-xs text-base" style={{ color: "#666666" }}>Le gaz livré chez vous en 15 à 30 minutes à Cotonou</p>
  </div>
);

const Slide2 = () => {
  const steps = [
    { icon: Smartphone, text: "Je commande sur l'app" },
    { icon: Truck, text: "Mon livreur prépare ma commande" },
    { icon: HomeIcon, text: "Je reçois mon gaz à domicile" },
  ];
  return (
    <div className="flex flex-1 flex-col items-center px-6 text-center bg-white">
      <div className="flex w-full justify-center pt-[60px] pb-6">
        <img src={gogazLogo} alt="GoGaz" className="w-[160px] h-auto object-contain block" />
      </div>
      <h2 className="mb-6 text-2xl font-extrabold" style={{ color: "#1A1A1A" }}>Simple comme bonjour</h2>
      <div className="flex flex-col gap-4 text-left w-full max-w-sm">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold" style={{ color: "#1A1A1A" }}>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Slide3 = () => {
  const features = [
    { icon: Zap, text: "Livraison express 30 min" },
    { icon: Lock, text: "Bouteilles certifiées et sécurisées" },
    { icon: CreditCard, text: "MTN Money, Moov Money ou cash" },
    { icon: Star, text: "Service disponible 7j/7" },
    { icon: MapPin, text: "Livraison partout à Cotonou" },
  ];
  return (
    <div className="flex flex-1 flex-col items-center px-6 bg-white">
      <div className="flex w-full justify-center pt-[60px] pb-6">
        <img src={gogazLogo} alt="GoGaz" className="w-[160px] h-auto object-contain block" />
      </div>
      <h2 className="mb-8 text-center text-2xl font-extrabold" style={{ color: "#1A1A1A" }}>
        Pourquoi choisir <span className="text-primary">GoGaz</span> ?
      </h2>
      <div className="flex w-full max-w-sm flex-col gap-3">
        {features.map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Slide4 = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-1 flex-col items-center px-6 text-center bg-white">
    <div className="flex w-full justify-center pt-[60px] pb-4">
      <img src={gogazLogo} alt="GoGaz" className="w-[180px] h-auto object-contain block" />
    </div>
    <p className="mb-6 max-w-xs text-sm" style={{ color: "#666666" }}>
      GoGaz est une startup béninoise fondée à Cotonou, dédiée à rendre l'accès au gaz domestique simple, rapide et sécurisé pour chaque foyer et chaque entreprise.
    </p>
    <div className="mb-8 flex flex-col items-start gap-2 text-sm" style={{ color: "#666666" }}>
      {[
        { icon: Phone, text: "+229 01 52422654" },
        { icon: Mail, text: "contact@gogaz.bj" },
        { icon: MapPin, text: "Cotonou, Bénin" },
      ].map(({ icon: Icon, text }, i) => (
        <div key={i} className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span>{text}</span>
        </div>
      ))}
      <p className="mt-1 text-xs">Facebook / Instagram / WhatsApp : <span className="font-semibold text-primary">@GoGazBenin</span></p>
    </div>
    <Button onClick={onStart} className="h-14 w-full max-w-xs rounded-2xl text-lg font-semibold">
      Commencer maintenant
    </Button>
  </div>
);

export default Onboarding;
