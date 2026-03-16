import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import allBrands, { formatPrice } from "@/data/bouteilles";
import { brandColorMap } from "@/components/GasBottle";
import GasBottle from "@/components/GasBottle";
import PageTransition from "@/components/PageTransition";

const brandIds = allBrands.map((b) => b.id);

const OrderPage = () => {
  const navigate = useNavigate();
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [selectedBottleIdx, setSelectedBottleIdx] = useState(0);
  const brand = allBrands[activeBrandIdx];
  const colors = brandColorMap[brand.id] || brandColorMap.oryx;
  const selected = brand.bouteilles[selectedBottleIdx];

  const handleBrandChange = (idx: number) => {
    setActiveBrandIdx(idx);
    setSelectedBottleIdx(0);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#F5F5F5] pb-24">
        {/* Header */}
        <div
          className="relative rounded-b-3xl px-5 pb-4 pt-10 transition-all duration-500"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-10 p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <h1 className="text-center text-xl font-bold text-white pt-4">Commander</h1>
          <p className="text-center text-[13px] text-white/75 mt-0.5">
            Choisissez votre marque et bouteille
          </p>
        </div>

        {/* Brand tabs */}
        <div className="flex overflow-x-auto gap-2 px-4 mt-4 pb-1" style={{ scrollbarWidth: "none" }}>
          <style>{`.brand-tabs::-webkit-scrollbar { display: none; }`}</style>
          {allBrands.map((b, i) => {
            const isActive = i === activeBrandIdx;
            return (
              <button
                key={b.id}
                onClick={() => handleBrandChange(i)}
                className="flex-shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200"
                style={{
                  background: isActive ? "#FF6B00" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#666666",
                  border: isActive ? "none" : "1px solid #E0E0E0",
                }}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {/* Bottle cards — same layout as BrandDetail */}
        <div className="mt-5 flex flex-col items-center gap-[10px] px-[4%]">
          {brand.bouteilles.map((b, i) => {
            const isSelected = i === selectedBottleIdx;
            return (
              <motion.button
                key={b.id}
                onClick={() => setSelectedBottleIdx(i)}
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
                <div className="w-px self-stretch" style={{ background: "#F0F0F0" }} />
                <div
                  className="flex w-[40%] items-center justify-center"
                  style={{ background: "#F8F8F8", borderRadius: "0 14px 14px 0" }}
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
            onClick={() => {
              localStorage.setItem(
                "gogaz_order",
                JSON.stringify({
                  product: { label: `${brand.name} ${selected.weight}`, price: selected.price, weight: selected.weight },
                  address: "",
                  brand: brand.id,
                })
              );
              navigate("/payment");
            }}
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

export default OrderPage;
