import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Banknote, MapPin, Package, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";

type PaymentMethod = "mtn" | "moov" | "cash";

interface OrderData {
  product: { label: string; price: number; weight: string };
  address: string;
}

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const paymentOptions = [
  { id: "mtn" as PaymentMethod, label: "MTN Mobile Money", color: "bg-[hsl(48,95%,50%)]", textColor: "text-[hsl(48,95%,10%)]", hasPhone: true },
  { id: "moov" as PaymentMethod, label: "Moov Money", color: "bg-[hsl(210,90%,45%)]", textColor: "text-white", hasPhone: true },
  { id: "cash" as PaymentMethod, label: "Espèces à la livraison", color: "bg-muted", textColor: "text-muted-foreground", hasPhone: false },
];

const Payment = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("gogaz_order");
    if (data) setOrder(JSON.parse(data));
    else navigate("/order");
  }, [navigate]);

  const selectedOption = paymentOptions.find((o) => o.id === method);
  const canConfirm = method === "cash" || (method && phone.replace(/\s/g, "").length >= 8);

  const handleConfirm = () => {
    if (!canConfirm || !order) return;
    setConfirmed(true);
    const trackingId = "GOGAZ-" + Math.floor(10000 + Math.random() * 90000);
    localStorage.setItem("gogaz_order", JSON.stringify({ ...order, trackingId, payment: { method, phone: method !== "cash" ? phone : undefined } }));
    setTimeout(() => navigate("/confirmation"), 1500);
  };

  if (!order) return null;

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <CheckCircle size={48} style={{ color: "#27AE60" }} />
        <h1 className="mt-4 text-xl font-bold" style={{ color: "#27AE60" }}>Paiement confirmé !</h1>
        <span className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold text-white" style={{ backgroundColor: "#27AE60" }}>
          {formatPrice(order.product.price)}
        </span>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background px-6 pb-8 pt-12">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Paiement</h1>
        <p className="mb-6 text-muted-foreground">Choisissez votre mode de paiement</p>

        <div className="mb-6 flex flex-col gap-3">
          {paymentOptions.map((option) => (
            <button key={option.id}
              onClick={() => { setMethod(option.id); if (!option.hasPhone) setPhone(""); }}
              className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                method === option.id ? "border-primary bg-secondary shadow-sm" : "border-border bg-card"
              }`}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${option.color} ${option.textColor}`}>
                {option.hasPhone ? <Smartphone className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
              </div>
              <p className="flex-1 font-semibold text-foreground">{option.label}</p>
              <div className={`h-5 w-5 rounded-full border-2 transition-colors ${method === option.id ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                {method === option.id && <div className="flex h-full w-full items-center justify-center"><div className="h-2 w-2 rounded-full bg-white" /></div>}
              </div>
            </button>
          ))}
        </div>

        {selectedOption?.hasPhone && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-foreground">Numéro {selectedOption.label}</label>
            <Input type="tel" placeholder="Ex : 97 12 34 56" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-2xl text-base" />
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Récapitulatif</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3"><Package className="h-5 w-5 text-muted-foreground" /><div className="flex-1"><p className="text-sm text-muted-foreground">Produit</p><p className="font-medium text-foreground">{order.product.label}</p></div></div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-muted-foreground" /><div className="flex-1"><p className="text-sm text-muted-foreground">Adresse</p><p className="font-medium text-foreground">{order.address}</p></div></div>
            <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-muted-foreground" /><div className="flex-1"><p className="text-sm text-muted-foreground">Paiement</p><p className="font-medium text-foreground">{selectedOption?.label ?? "Non sélectionné"}</p></div></div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">Total</p>
                <p className="text-xl font-bold" style={{ color: "#27AE60" }}>{formatPrice(order.product.price)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Button onClick={handleConfirm} disabled={!canConfirm} className="h-14 w-full rounded-2xl text-lg font-semibold">
            Confirmer et payer
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Payment;
