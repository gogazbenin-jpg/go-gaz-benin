import { useNavigate } from "react-router-dom";
import { Star, Package, Calendar, User, Phone, Shield, HelpCircle, LogOut, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DriverNav from "@/components/DriverNav";

const driverProfile = {
  firstName: "Aymar",
  lastName: "Lokossou",
  phone: "+229 97 00 00 00",
  rating: 4.8,
  totalDeliveries: 127,
  memberSince: "Jan 2025",
};

const DriverProfile = () => {
  const navigate = useNavigate();

  const initials = driverProfile.firstName[0] + driverProfile.lastName[0];

  const handleLogout = () => {
    localStorage.removeItem("gogaz_driver");
    navigate("/login");
  };

  const menuItems = [
    { icon: User, label: "Mes informations" },
    { icon: Phone, label: "Mon numéro" },
    { icon: Shield, label: "Sécurité" },
    { icon: HelpCircle, label: "Aide et support" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-4 pb-6 pt-8 rounded-b-3xl flex flex-col items-center" style={{ background: "linear-gradient(135deg, #FF6B00, #E65C00)" }}>
        <div className="relative mb-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/80 text-2xl font-bold text-white">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border">
            <Camera size={14} className="text-muted-foreground" />
          </button>
        </div>
        <h1 className="text-xl font-bold text-white font-[Poppins]">
          {driverProfile.firstName} {driverProfile.lastName}
        </h1>
        <p className="text-sm text-white/70">{driverProfile.phone}</p>

        {/* Badge */}
        <div className="mt-3 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1">
          <Shield size={14} className="text-white" />
          <span className="text-xs font-bold text-white">Livreur certifié GoGaz</span>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Star, value: `${driverProfile.rating}/5`, label: "Note" },
            { icon: Package, value: String(driverProfile.totalDeliveries), label: "Livraisons" },
            { icon: Calendar, value: driverProfile.memberSince, label: "Membre" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-3 text-center"
            >
              <stat.icon size={20} className="text-primary mx-auto mb-1" />
              <p className="text-base font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Menu */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
                i < menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <item.icon size={18} className="text-primary" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="h-12 w-full rounded-xl gap-2 border-destructive text-destructive"
        >
          <LogOut size={18} /> Se déconnecter
        </Button>
      </div>

      <DriverNav />
    </div>
  );
};

export default DriverProfile;
