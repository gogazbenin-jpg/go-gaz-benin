import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Truck } from "lucide-react";
import { motion } from "framer-motion";
import GasBottle from "@/components/GasBottle";
import { Bouteille, BrandData, formatPrice } from "@/data/bouteilles";

interface BottleCarouselProps {
  brand: BrandData;
}

const BottleCard = ({
  bottle,
  brand,
  isActive,
}: {
  bottle: Bouteille;
  brand: BrandData;
  isActive: boolean;
}) => {
  const navigate = useNavigate();

  const handleOrder = () => {
    const product = { id: bottle.size, label: bottle.label, price: bottle.price, weight: bottle.weight, size: bottle.size };
    localStorage.setItem("gogaz_order", JSON.stringify({ product, address: "", brand: brand.id }));
    navigate("/order", { state: { brandId: brand.id, bottleId: bottle.id } });
  };

  return (
    <motion.div
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{
        width: "85%",
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        transform: isActive ? "scale(1)" : "scale(0.95)",
        transition: "transform 0.3s ease-out",
      }}
    >
      {/* Bottle illustration */}
      <div className="flex items-center justify-center py-5" style={{ minHeight: 180 }}>
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <GasBottle brandId={brand.id} size={bottle.size} className="drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: brand.color }}
          >
            {bottle.weight}
          </span>
          {bottle.inStock && (
            <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ backgroundColor: "#27AE60" }}>
              <CheckCircle size={11} />
              En stock
            </span>
          )}
          {bottle.badge && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
              style={{ backgroundColor: bottle.badge.color }}
            >
              {bottle.badge.label}
            </span>
          )}
        </div>

        <p className="font-bold text-lg" style={{ color: "#1A1A1A" }}>{bottle.label}</p>
        <p className="text-[13px] font-medium" style={{ color: brand.color }}>{brand.name}</p>
        <p className="text-[13px] mt-1" style={{ color: "#666666" }}>{bottle.description}</p>

        {/* Price */}
        <p className="text-[22px] font-bold mt-3" style={{ color: "#27AE60" }}>
          {formatPrice(bottle.price)}
        </p>
        <p className="text-[11px] font-medium" style={{ color: "#27AE60" }}>
          Recharge + Livraison incluse
        </p>

        {/* Delivery */}
        <div className="flex items-center gap-1.5 mt-2">
          <Clock size={14} style={{ color: "#999999" }} />
          <span className="text-[12px]" style={{ color: "#999999" }}>Livraison en 15 à 30 min</span>
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleOrder}
          className="flex w-full items-center justify-center gap-2 mt-4 font-bold text-white"
          style={{
            backgroundColor: "#FF6B00",
            borderRadius: 12,
            height: 50,
            fontSize: 15,
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          <Truck size={18} />
          Commander cette bouteille
        </motion.button>
      </div>
    </motion.div>
  );
};

const BottleCarousel = ({ brand }: BottleCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const bottles = brand.bouteilles;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / bottles.length;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, bottles.length - 1));
  }, [bottles.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 pt-2"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          paddingLeft: "7.5%",
          paddingRight: 20,
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {bottles.map((bottle, i) => (
          <div key={bottle.id} style={{ scrollSnapAlign: "start" }}>
            <BottleCard bottle={bottle} brand={brand} isActive={i === activeIndex} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-2 pb-4">
        {bottles.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 20 : 8,
              height: 8,
              backgroundColor: i === activeIndex ? "#FF6B00" : "#E0E0E0",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BottleCarousel;
