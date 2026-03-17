import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import allBrands, { formatPrice } from "@/data/bouteilles";
import { brandColorMap } from "@/components/GasBottle";
import GasBottle from "@/components/GasBottle";
import PageTransition from "@/components/PageTransition";

const OrderPage = () => {
  const navigate = useNavigate();
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [selectedBottleIdx, setSelectedBottleIdx] = useState(0);
  const brand = allBrands[activeBrandIdx];
  const colors = brandColorMap[brand.id] || brandColorMap.oryx;
  const selected = brand.bouteilles[selectedBottleIdx];
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleBrandChange = (idx: number) => {
    setActiveBrandIdx(idx);
    setSelectedBottleIdx(0);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setAddressError(false);
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const handleOrder = () => {
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    localStorage.setItem(
      "gogaz_order",
      JSON.stringify({
        product: { label: `${brand.name} ${selected.weight}`, price: selected.price, weight: selected.weight },
        address: address.trim(),
        brand: brand.id,
      })
    );
    navigate("/payment");
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-[#F5F5F5] pb-28">
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

        {/* Bottle cards */}
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
                  <span className="text-[17px] font-bold mt-0.5" style={{ color: "#27AE60" }}>
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
                  <GasBottle brandId={brand.id} size={b.size} className={b.size === "3kg" ? "h-[65px] w-auto" : "h-[75px] w-auto"} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Address field */}
        <div className="mt-5 px-[4%]">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} style={{ color: "#FF6B00" }} />
            <span className="text-[15px] font-bold" style={{ color: "#1A1A1A" }}>Adresse de livraison</span>
          </div>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3" style={{ color: "#AAAAAA" }} />
            <textarea
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (e.target.value.trim()) setAddressError(false);
              }}
              placeholder="Ex: Akpakpa, près de la pharmacie centrale, maison bleue portail noir"
              className="w-full resize-none pl-9 pr-3 py-[14px] text-[14px]"
              style={{
                height: 80,
                borderRadius: 12,
                background: "#FFFFFF",
                border: addressError ? "2px solid #E74C3C" : address.trim() ? "1px solid #27AE60" : "1px solid #E0E0E0",
                outline: "none",
              }}
            />
          </div>
          {addressError && (
            <p className="text-[12px] mt-1 font-medium" style={{ color: "#E74C3C" }}>
              Veuillez entrer votre adresse de livraison
            </p>
          )}
          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full text-[14px] font-medium"
            style={{ color: "#FF6B00", border: "1px solid #FF6B00", background: "transparent" }}
          >
            <Navigation size={16} />
            {geoLoading ? "Localisation..." : "Utiliser ma position actuelle"}
          </button>
        </div>

        {/* Fixed bottom button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 px-[4%] pb-5 pt-3 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5] to-transparent">
          <button
            onClick={handleOrder}
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
