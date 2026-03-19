import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, LogOut, MapPin, Phone, CheckCircle, Truck, Clock, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import gogazLogoDark from "@/assets/gogaz-logo-dark.jpg";
import AdminBottomNav from "@/components/AdminBottomNav";

interface Order {
  id: string;
  client: string;
  phone: string;
  address: string;
  product: string;
  amount: number;
  status: "en_cours" | "livre";
}

const initialOrders: Order[] = [
  { id: "CMD-201", client: "Koffi Mensah", phone: "+229 96 00 00 00", address: "Akpakpa, rue 145", product: "Oryx 12kg", amount: 11000, status: "en_cours" },
  { id: "CMD-202", client: "Aïcha Soulé", phone: "+229 96 45 67 89", address: "Fidjrossè, carrefour Erevan", product: "Bénin Pétro 6kg", amount: 5500, status: "en_cours" },
  { id: "CMD-203", client: "Patrick Agossou", phone: "+229 97 88 12 34", address: "Cadjèhoun, près du stade", product: "Puma 25kg", amount: 22000, status: "livre" },
  { id: "CMD-204", client: "Mariam Bello", phone: "+229 95 22 33 44", address: "Ganhi, rue 302", product: "ProGaz 12kg", amount: 11000, status: "en_cours" },
  { id: "CMD-205", client: "Serge Dossou", phone: "+229 66 77 88 99", address: "Gbégamey, lot 45", product: "Oryx 6kg", amount: 5500, status: "livre" },
];

const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    if (!localStorage.getItem("gogaz_admin")) navigate("/admin", { replace: true });
  }, [navigate]);

  const markDelivered = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "livre" as const } : o))
    );
    toast({ title: "Statut mis à jour", description: `${id} marquée comme livrée.` });
  };

  const contactClient = (phone: string, name: string) => {
    window.open(`tel:${phone.replace(/\s/g, "")}`, "_self");
    toast({ title: "Appel", description: `Appel vers ${name}...` });
  };

  const logout = () => {
    localStorage.removeItem("gogaz_admin");
    navigate("/admin", { replace: true });
  };

  const enCours = orders.filter((o) => o.status === "en_cours").length;
  const livrees = orders.filter((o) => o.status === "livre").length;

  return (
    <div className="min-h-screen bg-[hsl(0,0%,97%)] pb-20">
      {/* Header */}
      <div className="bg-[hsl(213,40%,12%)] px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <img src={gogazLogoDark} alt="GoGaz" className="w-[90px] object-contain" />
        </div>
        <h1 className="text-xl font-bold text-white">Dashboard Admin</h1>
        <p className="text-sm text-[hsl(213,15%,60%)]">Gestion des commandes GoGaz</p>
      </div>

      {/* Stats */}
      <div className="px-5 -mt-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(25,100%,50%,0.12)]">
              <Truck className="h-5 w-5" style={{ color: "#FF6B00" }} />
            </div>
            <p className="text-2xl font-bold text-[hsl(0,0%,10%)]">{enCours}</p>
            <p className="text-xs text-[hsl(0,0%,50%)]">En cours</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(145,50%,50%,0.12)]">
              <CheckCircle className="h-5 w-5" style={{ color: "#27AE60" }} />
            </div>
            <p className="text-2xl font-bold text-[hsl(0,0%,10%)]">{livrees}</p>
            <p className="text-xs text-[hsl(0,0%,50%)]">Livrées</p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="px-5 pt-5 pb-10 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[hsl(0,0%,45%)]">
          Commandes ({orders.length})
        </h2>

        {orders.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold" style={{ color: "#FF6B00" }}>{o.id}</span>
              <span
                className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={
                  o.status === "livre"
                    ? { backgroundColor: "hsl(145,50%,50%,0.12)", color: "#27AE60" }
                    : { backgroundColor: "hsl(25,100%,50%,0.12)", color: "#FF6B00" }
                }
              >
                {o.status === "livre" ? (
                  <><CheckCircle className="h-3 w-3" /> Livrée</>
                ) : (
                  <><Clock className="h-3 w-3" /> En cours</>
                )}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex items-center gap-2 text-[hsl(0,0%,20%)]">
                <User className="h-4 w-4 text-[hsl(0,0%,55%)]" />
                <span className="font-semibold">{o.client}</span>
              </div>
              <div className="flex items-center gap-2 text-[hsl(0,0%,35%)]">
                <Package className="h-4 w-4 text-[hsl(0,0%,55%)]" />
                <span>{o.product} — <span className="font-semibold" style={{ color: "#27AE60" }}>{formatPrice(o.amount)}</span></span>
              </div>
              <div className="flex items-center gap-2 text-[hsl(0,0%,35%)]">
                <MapPin className="h-4 w-4 text-[hsl(0,0%,55%)]" />
                <span>{o.address}</span>
              </div>
              <div className="flex items-center gap-2 text-[hsl(0,0%,35%)]">
                <Phone className="h-4 w-4 text-[hsl(0,0%,55%)]" />
                <span>{o.phone}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {o.status === "en_cours" && (
                <Button
                  onClick={() => markDelivered(o.id)}
                  className="flex-1 h-10 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#27AE60" }}
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Marquer livrée
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => contactClient(o.phone, o.client)}
                className="flex-1 h-10 rounded-xl text-sm font-semibold border-[hsl(0,0%,85%)]"
              >
                <Phone className="mr-1.5 h-4 w-4" />
                Contacter
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
