import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Power, Package, DollarSign, Star, MapPin, Navigation, Clock, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import DriverNav from "@/components/DriverNav";
import gogazLogoLight from "@/assets/gogaz-logo-light.jpg";

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const driverData = {
  firstName: "Aymar",
  deliveriesToday: 3,
  earningsToday: 3500,
  rating: 4.8,
};

const pendingOrder = {
  id: "CMD-00123",
  client: "Koffi Mensah",
  phone: "+229 96 00 00 00",
  product: "Oryx 12kg",
  address: "Akpakpa, rue 145",
  amount: 11000,
  distance: 2.3,
  gain: 1500,
  timeAgo: 2,
};

const DriverHome = () => {
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);
  const [hasOrder, setHasOrder] = useState(true);
  const [orderAccepted, setOrderAccepted] = useState(false);

  const handleAccept = () => {
    setOrderAccepted(true);
    localStorage.setItem("gogaz_driver_order", JSON.stringify(pendingOrder));
    navigate("/driver/delivery");
  };

  const handleRefuse = () => {
    setHasOrder(false);
    setTimeout(() => setHasOrder(true), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-4 pb-5 pt-8 rounded-b-3xl" style={{ background: "linear-gradient(135deg, #FF6B00, #E65C00)" }}>
        <div className="flex items-center justify-between mb-3">
          <img src={gogazLogoLight} alt="GoGaz" className="h-[35px] object-contain" />
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
            <Bell size={22} />
          </button>
        </div>
        <h1 className="text-xl font-bold text-white font-[Poppins]">
          Bonjour {driverData.firstName} !
        </h1>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Availability Switch */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-2xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <Power size={20} className={available ? "text-[#27AE60]" : "text-destructive"} />
            <span className="text-sm font-semibold text-foreground">
              {available ? "Je suis disponible" : "Je suis indisponible"}
            </span>
          </div>
          <Switch
            checked={available}
            onCheckedChange={setAvailable}
            className="data-[state=checked]:bg-[#27AE60] data-[state=unchecked]:bg-destructive"
          />
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Package, value: String(driverData.deliveriesToday), label: "Livraisons du jour" },
            { icon: DollarSign, value: formatPrice(driverData.earningsToday), label: "Gains du jour" },
            { icon: Star, value: String(driverData.rating), label: "Note moyenne" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-3 text-center"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <stat.icon size={24} className="text-primary" />
              </div>
              <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Orders Section */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Commandes
        </h2>

        {!available ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 py-10"
          >
            <Power size={48} className="text-muted-foreground" />
            <p className="text-base font-bold text-muted-foreground">Vous êtes indisponible</p>
            <p className="text-[13px] text-muted-foreground text-center">
              Activez votre disponibilité pour recevoir des commandes
            </p>
          </motion.div>
        ) : !hasOrder ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2 py-10"
          >
            <Package size={48} className="text-muted-foreground" />
            <p className="text-base font-bold text-muted-foreground">En attente de commandes...</p>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Nouvelle commande</span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                NOUVEAU
              </span>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{pendingOrder.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{pendingOrder.product}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{formatPrice(pendingOrder.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground">{pendingOrder.distance} km de vous</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">Commandé il y a {pendingOrder.timeAgo} min</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-primary mb-4">
              Gains estimés : {formatPrice(pendingOrder.gain)}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefuse}
                className="flex-1 h-12 rounded-xl gap-2 border-border text-muted-foreground"
              >
                <X size={18} /> Refuser
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 h-12 rounded-xl gap-2 text-white font-semibold"
                style={{ backgroundColor: "#27AE60" }}
              >
                <Check size={18} /> Accepter
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <DriverNav />
    </div>
  );
};

export default DriverHome;
