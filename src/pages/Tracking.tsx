import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck, CheckCircle, Phone, MapPin, Package,
  Home as HomeIcon, ShoppingCart, User, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

/* ── Brand background colors (low opacity) ── */
const brandBgMap: Record<string, string> = {
  oryx: "hsla(0, 70%, 55%, 0.08)",
  "benin-petro": "hsla(145, 63%, 42%, 0.08)",
  puma: "hsla(210, 80%, 50%, 0.08)",
  progaz: "hsla(270, 50%, 55%, 0.08)",
};

const brandAccentMap: Record<string, string> = {
  oryx: "hsl(0, 70%, 55%)",
  "benin-petro": "hsl(145, 63%, 42%)",
  puma: "hsl(210, 80%, 50%)",
  progaz: "hsl(270, 50%, 55%)",
};

const brandLogoMap: Record<string, string> = {
  oryx: "/src/assets/logos/oryx-logo.png",
  "benin-petro": "/src/assets/logos/benin-petro-logo.png",
  puma: "/src/assets/logos/puma-logo.png",
  progaz: "/src/assets/logos/progaz-logo.png",
};

interface OrderData {
  product: { label: string; price: number; weight: string };
  address: string;
  brand: string;
  trackingId?: string;
}

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

/* ── Timeline steps ── */
type StepStatus = "done" | "active" | "pending";

const getSteps = (delivered: boolean) => [
  { label: "Commande reçue", status: "done" as StepStatus },
  { label: "En cours de livraison", status: delivered ? ("done" as StepStatus) : ("active" as StepStatus) },
  { label: "Livré", status: delivered ? ("done" as StepStatus) : ("pending" as StepStatus) },
];

const stepColor = (s: StepStatus) =>
  s === "done" ? "#2AA052" : s === "active" ? "#FFA500" : "#BDBDBD";

/* ── Empty state ── */
const EmptyState = ({ onOrder }: { onOrder: () => void }) => (
  <motion.div
    className="flex flex-1 flex-col items-center justify-center px-6 text-center gap-5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <Package size={52} className="text-muted-foreground" />
    <p className="text-lg font-bold text-foreground">Aucune commande en cours</p>
    <p className="text-sm text-muted-foreground max-w-[260px]">
      Passez une commande pour suivre votre livraison en temps réel
    </p>
    <Button
      onClick={onOrder}
      className="h-12 rounded-2xl px-8 text-base font-semibold bg-primary text-primary-foreground"
    >
      Commander maintenant
    </Button>
  </motion.div>
);

/* ── Bottom Nav ── */
const navTabs = [
  { id: "home", icon: HomeIcon, label: "Accueil", path: "/home" },
  { id: "order", icon: ShoppingCart, label: "Commander", path: "/order" },
  { id: "track", icon: MapPin, label: "Suivi", path: "/tracking" },
  { id: "profile", icon: User, label: "Profil", path: "/profile" },
];

const BottomNav = ({ navigate }: { navigate: (p: string) => void }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card">
    <div className="mx-auto flex max-w-md items-center justify-around py-2">
      {navTabs.map((tab) => {
        const isActive = tab.id === "track";
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="relative flex flex-col items-center gap-0.5 px-4 py-1"
          >
            <tab.icon
              className="h-5 w-5"
              style={{ color: isActive ? "hsl(var(--primary))" : "#9E9E9E" }}
            />
            <span
              className="text-xs"
              style={{
                color: isActive ? "hsl(var(--primary))" : "#9E9E9E",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-2 h-0.5 w-8 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  </div>
);

/* ── Main Page ── */
const Tracking = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("gogaz_order");
    if (data) {
      setOrder(JSON.parse(data));
    }
  }, []);

  // Simulate delivery after 60s for demo
  useEffect(() => {
    if (!order) return;
    const t = setTimeout(() => setDelivered(true), 60000);
    return () => clearTimeout(t);
  }, [order]);

  const brandId = order?.brand || "oryx";
  const bgTint = brandBgMap[brandId] || brandBgMap.oryx;
  const accent = brandAccentMap[brandId] || brandAccentMap.oryx;
  const logo = brandLogoMap[brandId] || brandLogoMap.oryx;
  const steps = order ? getSteps(delivered) : [];

  const handleCall = () => {
    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);
    window.location.href = "tel:+22997123456";
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-20">
        {/* ── Header ── */}
        <motion.header
          className="px-5 pb-5 pt-12 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#000000", fontFamily: "'Poppins', 'Montserrat', 'Roboto', sans-serif" }}
          >
            Suivi de votre commande
          </h1>
        </motion.header>

        {!order ? (
          <EmptyState onOrder={() => navigate("/order")} />
        ) : (
          <div className="flex flex-1 flex-col items-center px-5 gap-5">
            {/* ── Order Recap Card ── */}
            <motion.div
              className="w-full max-w-sm rounded-2xl p-5"
              style={{
                backgroundColor: bgTint,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  alt={brandId}
                  className="h-10 w-10 rounded-lg object-contain bg-card p-1"
                />
                <div className="flex-1">
                  <p className="font-bold text-foreground text-base">{order.product.label}</p>
                  <p className="text-xs text-muted-foreground">{order.product.weight}</p>
                </div>
                <p className="text-[17px] font-bold" style={{ color: "#27AE60" }}>
                  {formatPrice(order.product.price)}
                </p>
              </div>

              <div className="flex items-start gap-2 pt-3 border-t border-border/40">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
                <p className="text-sm text-foreground">{order.address}</p>
              </div>

              {order.trackingId && (
                <div className="mt-3 text-center">
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {order.trackingId}
                  </span>
                </div>
              )}
            </motion.div>

            {/* ── Delivery Status ── */}
            <motion.div
              className="w-full max-w-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {delivered ? (
                  <CheckCircle size={24} style={{ color: "#2AA052" }} />
                ) : (
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <Truck size={24} style={{ color: "#FFA500" }} />
                  </motion.div>
                )}
                <span
                  className="text-lg font-bold"
                  style={{
                    color: delivered ? "#2AA052" : "#FFA500",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {delivered ? "Livré ✅" : "En cours de livraison"}
                </span>
              </div>
            </motion.div>

            {/* ── ETA ── */}
            {!delivered && (
              <motion.div
                className="w-full max-w-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Clock size={18} style={{ color: "#333333" }} />
                  <p className="text-sm" style={{ color: "#333333" }}>
                    Votre commande arrivera dans <strong>15 à 30 min</strong>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Progress Timeline ── */}
            <motion.div
              className="w-full max-w-sm rounded-2xl bg-card p-5"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: step.status === "pending" ? "#F0F0F0" : stepColor(step.status),
                      }}
                    >
                      {step.status === "done" ? (
                        <CheckCircle size={16} color="#fff" />
                      ) : step.status === "active" ? (
                        <Truck size={14} color="#fff" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#BDBDBD]" />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="w-0.5 my-1"
                        style={{
                          height: 24,
                          backgroundColor: stepColor(step.status),
                        }}
                      />
                    )}
                  </div>
                  <p
                    className="text-sm pt-1"
                    style={{
                      fontWeight: step.status === "active" ? 700 : 500,
                      color: stepColor(step.status),
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* ── Contact Driver Button ── */}
            {!delivered && (
              <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <button
                  onClick={handleCall}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white transition-transform active:scale-[0.97]"
                  style={{ backgroundColor: "#2AA052" }}
                >
                  <Phone size={20} />
                  Contacter le livreur
                </button>
              </motion.div>
            )}

            {/* ── Back home after delivery ── */}
            {delivered && (
              <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => {
                    localStorage.removeItem("gogaz_order");
                    navigate("/home");
                  }}
                  variant="outline"
                  className="w-full h-12 rounded-2xl text-base font-semibold"
                >
                  Retour à l'accueil
                </Button>
              </motion.div>
            )}
          </div>
        )}

        <BottomNav navigate={navigate} />
      </div>
    </PageTransition>
  );
};

export default Tracking;
