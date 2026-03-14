import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GasBottle from "@/components/GasBottle";
import { brands } from "@/components/BrandGrid";
import { brandColorMap } from "@/components/GasBottle";
import PageTransition from "@/components/PageTransition";

const products = [
  { id: "6kg", label: "Bouteille 6kg", price: 5500, weight: "6 kg", size: "6kg" as const, inStock: true },
  { id: "12kg", label: "Bouteille 12kg", price: 11000, weight: "12 kg", size: "12kg" as const, inStock: true },
  { id: "25kg", label: "Bouteille 25kg", price: 22000, weight: "25 kg", size: "25kg" as const, inStock: true },
];

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const Order = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState<string>("oryx");
  const [selected, setSelected] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const currentBrand = brands.find((b) => b.id === selectedBrand) || brands[0];
  const brandColors = brandColorMap[selectedBrand] || brandColorMap.oryx;

  const handleOrder = () => {
    if (!selected || !address.trim()) return;
    const product = products.find((p) => p.id === selected)!;
    localStorage.setItem("gogaz_order", JSON.stringify({ product, address, brand: selectedBrand }));
    navigate("/payment");
  };

  return (
    <PageTransition variant="slideLeft">
      <div className="flex min-h-screen flex-col bg-background pb-8">
        <div className="px-6 pb-5 pt-12 rounded-b-3xl"
          style={{ background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.primaryDark})` }}>
          <h1 className="mb-1 text-2xl font-bold text-white">Nouvelle Commande</h1>
          <p className="text-white/70 text-sm">Choisissez votre bouteille de gaz</p>
        </div>

        <div className="px-6 mt-5">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
            {brands.map((brand) => (
              <button key={brand.id} onClick={() => setSelectedBrand(brand.id)}
                className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedBrand === brand.id ? "text-white shadow-sm" : "bg-muted text-muted-foreground"
                }`}
                style={selectedBrand === brand.id ? { backgroundColor: brand.color } : {}}>
                {brand.name}
              </button>
            ))}
          </div>

          <div className="mb-6 flex flex-col gap-3">
            {products.map((product, i) => (
              <motion.button
                key={product.id}
                onClick={() => setSelected(product.id)}
                className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  selected === product.id ? "shadow-sm" : "border-border bg-card"
                }`}
                style={selected === product.id ? { borderColor: currentBrand.color, backgroundColor: currentBrand.colorLight } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 * i }}
                whileTap={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GasBottle brandId={selectedBrand} size={product.size} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: brandColors.primary }}>{product.weight}</span>
                    {product.inStock ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#27AE60" }}>
                        <CheckCircle size={12} /> En stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-[10px] font-medium" style={{ color: "#E74C3C" }}>
                        Indisponible
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground">{product.label}</p>
                  <p className="text-sm text-muted-foreground">{currentBrand.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold" style={{ color: currentBrand.color }}>{formatPrice(product.price)}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Adresse de livraison</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Ex : Quartier Akpakpa, Cotonou" value={address} onChange={(e) => setAddress(e.target.value)} className="h-14 rounded-2xl pl-12 text-base" />
            </div>
          </div>

          <div className="mt-auto">
            <Button onClick={handleOrder} disabled={!selected || !address.trim()}
              className="h-14 w-full rounded-2xl text-lg font-semibold text-white"
              style={{ backgroundColor: !selected || !address.trim() ? undefined : currentBrand.color }}>
              Commander maintenant
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Order;
