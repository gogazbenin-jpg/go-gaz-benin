import { useNavigate } from "react-router-dom";
import { Star, ChevronRight, Zap, Flag, ShieldCheck, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import oryxLogo from "@/assets/logos/oryx-logo.png";
import beninPetroLogo from "@/assets/logos/benin-petro-logo.png";
import pumaLogo from "@/assets/logos/puma-logo.png";
import progazLogo from "@/assets/logos/progaz-logo.png";

const brands = [
  {
    id: "oryx",
    name: "Oryx Énergie",
    logo: oryxLogo,
    color: "#E74C3C",
    colorLight: "hsl(4, 68%, 95%)",
    rating: 4.8,
    bottles: 3,
    badgeLabel: "Populaire",
    badgeIcon: Zap,
  },
  {
    id: "benin-petro",
    name: "Bénin Pétro",
    logo: beninPetroLogo,
    color: "#27AE60",
    colorLight: "hsl(153, 64%, 94%)",
    rating: 4.6,
    bottles: 3,
    badgeLabel: "Local",
    badgeIcon: Flag,
  },
  {
    id: "puma",
    name: "Puma Énergie",
    logo: pumaLogo,
    color: "#2E86C1",
    colorLight: "hsl(204, 55%, 94%)",
    rating: 4.7,
    bottles: 3,
    badgeLabel: "Certifié",
    badgeIcon: ShieldCheck,
  },
  {
    id: "progaz",
    name: "ProGaz",
    logo: progazLogo,
    color: "#8E44AD",
    colorLight: "hsl(277, 42%, 94%)",
    rating: 4.5,
    bottles: 3,
    badgeLabel: "Pro",
    badgeIcon: Briefcase,
  },
];

export { brands };

const BrandCard = ({ brand, index }: { brand: (typeof brands)[0]; index: number }) => {
  const navigate = useNavigate();
  const BadgeIcon = brand.badgeIcon;

  return (
    <motion.button
      onClick={() => navigate("/order")}
      className="flex flex-col items-center gap-2 rounded-2xl border-2 bg-card p-4 text-center shadow-sm"
      style={{ borderColor: brand.color + "30" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
      whileTap={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
    >
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl" style={{ backgroundColor: brand.colorLight }}>
        <img src={brand.logo} alt={brand.name} className="h-12 w-12 object-contain" />
      </div>
      <p className="text-sm font-bold text-foreground">{brand.name}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3" style={{ fill: "#FF6B00", color: "#FF6B00" }} />
        <span className="font-semibold">{brand.rating}</span>
        <span>·</span>
        <span>{brand.bottles} bouteilles</span>
      </div>
      <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white flex items-center gap-1" style={{ backgroundColor: brand.color }}>
        <BadgeIcon className="h-3 w-3" />
        {brand.badgeLabel}
      </span>
      <div className="flex items-center gap-0.5 text-xs font-medium" style={{ color: brand.color }}>
        Voir les bouteilles
        <ChevronRight className="h-3 w-3" />
      </div>
    </motion.button>
  );
};

const BrandGrid = () => (
  <div className="relative z-10 mt-6 px-6">
    <h2 className="mb-1 text-lg font-bold" style={{ color: "#FF6B00" }}>
      Choisissez votre marque
    </h2>
    <p className="mb-4 text-sm text-muted-foreground">4 marques disponibles à Cotonou</p>
    <div className="grid grid-cols-2 gap-3">
      {brands.map((brand, i) => (
        <BrandCard key={brand.id} brand={brand} index={i} />
      ))}
    </div>
  </div>
);

export default BrandGrid;
