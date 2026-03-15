import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon, ShoppingCart, User, MapPin,
  Zap, Truck, Bell, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import BrandGrid from "@/components/BrandGrid";
import gogazLogoNew from "@/assets/gogaz-logo-new.png";
import { useWeatherGradient } from "@/hooks/useWeatherGradient";
import PageTransition from "@/components/PageTransition";

function getGreeting(firstName?: string) {
  const h = new Date().getHours();
  const name = firstName || "";
  if (h >= 5 && h < 12) return {
    msg: name ? `Bonjour ${name} !` : "Bienvenue sur GoGaz !",
    sub: name ? "Préparez votre petit-déjeuner avec GoGaz" : "Livraison de gaz à domicile",
  };
  if (h >= 12 && h < 18) return {
    msg: name ? `Bonne après-midi ${name} !` : "Bienvenue sur GoGaz !",
    sub: name ? "L'heure de cuisiner a sonné !" : "Livraison de gaz à domicile",
  };
  if (h >= 18 && h < 22) return {
    msg: name ? `Bonsoir ${name} !` : "Bienvenue sur GoGaz !",
    sub: name ? "Votre dîner mérite le meilleur gaz" : "Livraison de gaz à domicile",
  };
  return {
    msg: name ? `Bonne nuit ${name} !` : "Bienvenue sur GoGaz !",
    sub: name ? "Commandez maintenant, livré demain matin" : "Livraison de gaz à domicile",
  };
}

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [time, setTime] = useState(new Date());
  const { cssGradient, isDark } = useWeatherGradient();

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(iv);
  }, []);

  let firstName = "";
  try {
    const u = JSON.parse(localStorage.getItem("gogaz_user") || "null");
    if (u?.firstName) firstName = u.firstName;
  } catch {}

  const greeting = getGreeting(firstName);

  const tabs = [
    { id: "home", icon: HomeIcon, label: "Accueil" },
    { id: "order", icon: ShoppingCart, label: "Commander" },
    { id: "track", icon: MapPin, label: "Suivi" },
    { id: "profile", icon: User, label: "Profil" },
  ];

  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col bg-[#F5F5F5] pb-20">
        {/* Header with dynamic gradient */}
        <header
          className="relative z-10 overflow-hidden rounded-b-3xl px-5 pb-5 pt-8"
          style={{ background: cssGradient, transition: "background 3s ease" }}
        >
          <div className="flex justify-center mb-4">
            <img
              src={gogazLogoNew}
              alt="GoGaz"
              className="h-[45px] object-contain"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[22px] font-bold text-white leading-tight">{greeting.msg}</p>
            <button className="relative p-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.15)" }}>
              <Bell className="h-[22px] w-[22px] text-white" />
            </button>
          </div>
          <p className="text-sm text-white/75 mt-0.5">{greeting.sub}</p>

          <p className="mt-2 text-[13px] flex items-center gap-1 text-white/85">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Il est {time.getHours()}h{String(time.getMinutes()).padStart(2, "0")} à Cotonou
            </span>
          </p>
        </header>

        {/* Banner */}
        <motion.div
          className="relative z-10 mx-6 mt-4 overflow-hidden rounded-2xl p-6"
          style={{ background: "#FF6B00", minHeight: 100 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-white" />
            <Truck className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-white">Votre gaz en 30 min</p>
          <p className="mt-1 text-sm text-white/80">
            Livraison rapide partout à Cotonou
          </p>
        </motion.div>

        <BrandGrid />

        <motion.div
          className="relative z-10 mt-6 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Button
            onClick={() => navigate("/order")}
            className="h-14 w-full rounded-2xl text-lg font-semibold"
          >
            Commander maintenant
          </Button>
        </motion.div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white">
          <div className="mx-auto flex max-w-md items-center justify-around py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "home") navigate("/home");
                    if (tab.id === "order") navigate("/order");
                    if (tab.id === "track") navigate("/tracking");
                    if (tab.id === "profile") navigate("/profile");
                  }}
                  className="relative flex flex-col items-center gap-0.5 px-4 py-1"
                >
                  <tab.icon
                    className="h-5 w-5"
                    style={{ color: isActive ? "#FF6B00" : "#9E9E9E" }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color: isActive ? "#FF6B00" : "#9E9E9E",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div
                      className="absolute -bottom-2 h-0.5 w-8 rounded-full"
                      style={{ background: "#FF6B00" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
