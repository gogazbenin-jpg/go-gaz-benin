import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { getBrand, formatPrice } from "@/data/bouteilles";
import { brandColorMap } from "@/components/GasBottle";
import GasBottle from "@/components/GasBottle";
import PageTransition from "@/components/PageTransition";
import oryxLogo from "@/assets/logos/oryx-logo.png";
import beninPetroLogo from "@/assets/logos/benin-petro-logo.png";
import pumaLogo from "@/assets/logos/puma-logo.png";
import progazLogo from "@/assets/logos/progaz-logo.png";

const brandLogos: Record<string, string> = {
  oryx: oryxLogo,
  "benin-petro": beninPetroLogo,
  puma: pumaLogo,
  progaz: progazLogo,
};

const BrandDetail = () => {
  const navigate = useNavigate();
  const { brandId } = useParams<{ brandId: string }>();
  const brand = getBrand(brandId || "oryx");
  const colors = brandColorMap[brand.id] || brandColorMap.oryx;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = brand.bouteilles[selectedIdx];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#F5F5F5] pb-24">
        {/* Header */}
        <div
          className="relative rounded-b-3xl px-5 pb-6 pt-10"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-10 p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex flex-col items-center pt-4">
            <motion.div
              className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white/20 mb-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={brandLogos[brand.id] || oryxLogo} alt={brand.name} className="h-10 w-10 object-contain" />
            </motion.div>
            <h1 className="text-xl font-bold text-white">{brand.name}</h1>
            <p className="text-[13px] text-white/75">
              {brand.bouteilles.length} bouteilles disponibles
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-5 flex flex-col items-center gap-[10px] px-[4%]">
          {brand.bouteilles.map((b, i) => {
            const isSelected = i === selectedIdx;
            return (
              <motion.button
                key={b.id}
                onClick={() => setSelectedIdx(i)}
                className="flex w-full overflow-hidden text-left"
                style={{
                  height: 90,
                  borderRadius: 14,
                  background: isSelected ? "rgba(255,107,0,0.04)" : "#FFFFFF",
                  border: isSelected ? "2px solid #FF6B00" : "1px solid #F0F0F0",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {/* Left info */}
                <div className="flex flex-1 flex-col justify-center px-[14px]">
                  <span className="text-[15px] font-bold" style={{ color: "#1A1A1A" }}>
                    {brand.name} {b.weight}
                  </span>
                  <span className="text-[17px] font-bold mt-0.5" style={{ color: "#FF6B00" }}>
                    {formatPrice(b.price)}
                  </span>
                  <span className="text-[11px] mt-0.5" style={{ color: "#888888" }}>
                    Recharge + Livraison
                  </span>
                </div>

                {/* Separator */}
                <div className="w-px self-stretch" style={{ background: "#F0F0F0" }} />

                {/* Right photo */}
                <div
                  className="flex w-[40%] items-center justify-center"
                  style={{
                    background: "#F8F8F8",
                    borderRadius: "0 14px 14px 0",
                  }}
                >
                  <GasBottle brandId={brand.id} size={b.size} className="h-[75px] w-auto" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Fixed bottom button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 px-[4%] pb-5 pt-3 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5] to-transparent">
          <button
            onClick={() => navigate("/order", { state: { bottle: selected } })}
            className="flex h-[54px] w-full items-center justify-center rounded-[14px] font-bold text-[16px] text-white active:scale-[0.97] transition-transform"
            style={{ background: "#FF6B00" }}
          >
            Commander maintenant
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default BrandDetail;
