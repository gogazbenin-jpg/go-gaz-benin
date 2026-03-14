import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, MapPin, Package, Phone, CheckCircle, TrendingUp, LogOut, Navigation, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import gogazLogoLight from "@/assets/gogaz-logo-light.jpg";

interface Order {
  id: string; client: string; phone: string; address: string; product: string; amount: number; status: "pending" | "en_route" | "delivered";
}

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const initialOrders: Order[] = [
  { id: "CMD-001", client: "Aïcha Soulé", phone: "+229 96 45 67 89", address: "Quartier Akpakpa, Rue 123", product: "Bouteille 12kg", amount: 11000, status: "pending" },
  { id: "CMD-002", client: "Patrick Agossou", phone: "+229 97 88 12 34", address: "Fidjrossè, près du marché", product: "Bouteille 6kg", amount: 5500, status: "pending" },
  { id: "CMD-003", client: "Mariam Bello", phone: "+229 95 22 33 44", address: "Cadjèhoun, carrefour Erevan", product: "Bouteille 25kg", amount: 22000, status: "pending" },
  { id: "CMD-004", client: "Serge Dossou", phone: "+229 66 77 88 99", address: "Cotonou centre, Ganhi", product: "Bouteille 12kg", amount: 11000, status: "pending" },
];

const statusLabels: Record<Order["status"], string> = { pending: "En attente", en_route: "En route", delivered: "Livrée" };

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => { if (!localStorage.getItem("gogaz_driver")) navigate("/driver"); }, [navigate]);

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const earnings = orders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.amount * 0.1, 0);

  const updateStatus = (id: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  const handleLogout = () => { localStorage.removeItem("gogaz_driver"); navigate("/driver"); };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-6">
      <div className="px-4 pb-4 pt-8 rounded-b-3xl" style={{ background: "linear-gradient(135deg, #FF6B00, #E65C00)" }}>
        <div className="flex items-center justify-between mb-3">
          <img src={gogazLogoLight} alt="GoGaz" className="h-[35px] object-contain" />
          <button onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <h1 className="text-xl font-bold text-white">Tableau de bord</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-white/70">Livreur GoGaz</p>
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: "#27AE60" }}>
            <Shield className="h-3 w-3" /> Certifié
          </span>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,107,0,0.15)" }}>
              <Bike className="h-5 w-5" style={{ color: "#FF6B00" }} />
            </div>
            <p className="text-2xl font-bold text-foreground">{deliveredCount}</p>
            <p className="text-xs text-muted-foreground">Livraisons du jour</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,107,0,0.15)" }}>
              <TrendingUp className="h-5 w-5" style={{ color: "#FF6B00" }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: "#FF6B00" }}>{formatPrice(earnings)}</p>
            <p className="text-xs text-muted-foreground">Gains du jour</p>
          </div>
        </div>

        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Commandes du jour ({orders.length})</h2>

        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: "#FF6B00" }}>{order.id}</span>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium`}
                  style={{
                    backgroundColor: order.status === "delivered" ? "rgba(39,174,96,0.15)" : order.status === "en_route" ? "rgba(255,107,0,0.15)" : "rgba(158,158,158,0.15)",
                    color: order.status === "delivered" ? "#27AE60" : order.status === "en_route" ? "#FF6B00" : "#9E9E9E",
                  }}>
                  {order.status === "delivered" && <CheckCircle className="h-3 w-3" />}
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-foreground">{order.product} — <span className="font-semibold" style={{ color: "#FF6B00" }}>{formatPrice(order.amount)}</span></p></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-foreground">{order.address}</p></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><a href={`tel:${order.phone.replace(/\s/g, "")}`} className="text-sm font-medium" style={{ color: "#E65C00" }}>{order.client} · {order.phone}</a></div>
              </div>
              {order.status === "pending" && (
                <Button onClick={() => updateStatus(order.id, "en_route")} className="h-11 w-full rounded-xl text-sm font-semibold gap-2" style={{ backgroundColor: "#FF6B00" }}>
                  <Navigation className="h-4 w-4" /> Je suis en route
                </Button>
              )}
              {order.status === "en_route" && (
                <Button onClick={() => updateStatus(order.id, "delivered")} variant="outline" className="h-11 w-full rounded-xl text-sm font-semibold gap-2" style={{ borderColor: "#FF6B00", color: "#FF6B00" }}>
                  <CheckCircle className="h-4 w-4" /> Livraison effectuée
                </Button>
              )}
              {order.status === "delivered" && (
                <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium" style={{ backgroundColor: "rgba(39,174,96,0.1)", color: "#27AE60" }}>
                  <CheckCircle className="h-4 w-4" /> Livrée
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
