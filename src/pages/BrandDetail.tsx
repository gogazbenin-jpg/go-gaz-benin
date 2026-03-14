import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BottleCarousel from "@/components/BottleCarousel";
import { getBrand } from "@/data/bouteilles";
import { brandColorMap } from "@/components/GasBottle";
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

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-8">
        <div
          className="relative rounded-b-3xl px-5 pb-6 pt-10"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` }}
        >
          <button onClick={() => navigate(-1)} className="absolute left-4 top-10 p-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
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

        <div className="mt-5">
          <BottleCarousel brand={brand} />
        </div>
      </div>
    </PageTransition>
  );
};

export default BrandDetail;
