import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

interface OrderData {
  product: { label: string; price: number; weight: string };
  address: string;
  trackingId: string;
}

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const Confirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("gogaz_order");
    if (data) setOrder(JSON.parse(data));
    else navigate("/");
  }, [navigate]);

  if (!order) return null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col items-center bg-background px-6 pb-8 pt-16">
        <motion.div
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(39,174,96,0.2)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <CheckCircle size={64} style={{ color: "#27AE60" }} />
        </motion.div>

        <div className="mb-8 text-center">
          <h1 className="mb-1 text-2xl font-bold" style={{ color: "#27AE60" }}>Commande confirmée !</h1>
          <p className="text-muted-foreground">Votre gaz est en route</p>
        </div>

        <div className="mb-8 w-full max-w-sm rounded-2xl border-2 bg-card p-5" style={{ borderColor: "#27AE60" }}>
          <div className="mb-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Numéro de suivi</p>
            <span className="inline-block mt-1 rounded-full px-3 py-1 text-sm font-bold text-white" style={{ backgroundColor: "#27AE60" }}>
              {order.trackingId}
            </span>
          </div>
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div><p className="text-sm font-medium text-foreground">{order.product.label}</p><p className="text-sm text-muted-foreground">{formatPrice(order.product.price)}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-foreground">{order.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-foreground">Livraison estimée : 30-45 min</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex w-full max-w-sm flex-col gap-3">
          <Button onClick={() => navigate("/tracking")} className="h-14 w-full rounded-2xl text-lg font-semibold">
            Suivre ma commande
          </Button>
          <Button onClick={() => { localStorage.removeItem("gogaz_order"); navigate("/"); }} variant="outline" className="h-14 w-full rounded-2xl text-lg font-semibold">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Confirmation;
