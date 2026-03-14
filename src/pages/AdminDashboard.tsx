import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package, TrendingUp, TrendingDown, Bike, LogOut, MapPin, Phone, ShoppingCart, DollarSign, CheckCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import gogazLogoDark from "@/assets/gogaz-logo-dark.jpg";

const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const orders = [
  { id: "CMD-101", client: "Aïcha Soulé", phone: "+229 96 45 67 89", address: "Akpakpa, Rue 123", product: "12kg", amount: 11000, status: "En cours" },
  { id: "CMD-102", client: "Patrick Agossou", phone: "+229 97 88 12 34", address: "Fidjrossè", product: "6kg", amount: 5500, status: "En route" },
  { id: "CMD-103", client: "Mariam Bello", phone: "+229 95 22 33 44", address: "Cadjèhoun", product: "25kg", amount: 22000, status: "Livrée" },
  { id: "CMD-104", client: "Serge Dossou", phone: "+229 66 77 88 99", address: "Ganhi", product: "12kg", amount: 11000, status: "En attente" },
  { id: "CMD-105", client: "Fatou Koné", phone: "+229 91 12 34 56", address: "Gbégamey", product: "6kg", amount: 5500, status: "Livrée" },
  { id: "CMD-106", client: "Awa Diallo", phone: "+229 96 00 11 22", address: "Zogbo", product: "12kg", amount: 11000, status: "Annulée" },
];

const drivers = [
  { name: "Koffi Mensah", phone: "+229 97 12 34 56", deliveries: 5, active: true },
  { name: "Moussa Yao", phone: "+229 96 55 66 77", deliveries: 3, active: true },
  { name: "Jean Hounton", phone: "+229 95 11 22 33", deliveries: 0, active: false },
];

const generateChartData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({ day: `${d.getDate()}/${d.getMonth() + 1}`, commandes: Math.floor(Math.random() * 25) + 5 });
  }
  return data;
};

const chartData = generateChartData();
const stats = {
  jour: { commandes: 12, ca: 96000, trend: "up" as const },
  semaine: { commandes: 78, ca: 624000, trend: "up" as const },
  mois: { commandes: 312, ca: 2496000, trend: "down" as const },
};
type Period = "jour" | "semaine" | "mois";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("jour");

  useEffect(() => { if (!localStorage.getItem("gogaz_admin")) navigate("/admin"); }, [navigate]);

  const s = stats[period];

  return (
    <div className="min-h-screen bg-[hsl(213,40%,12%)] text-white">
      <div className="flex items-center justify-between px-5 pt-8 pb-4">
        <img src={gogazLogoDark} alt="GoGaz Admin" className="w-[100px] object-contain" />
        <button onClick={() => { localStorage.removeItem("gogaz_admin"); navigate("/admin"); }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(213,30%,18%)] text-[hsl(213,15%,60%)]">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pb-10 space-y-5">
        <div className="flex gap-2">
          {(["jour", "semaine", "mois"] as Period[]).map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                period === p ? "text-white" : "bg-[hsl(213,30%,18%)] text-[hsl(213,15%,60%)]"
              }`}
              style={period === p ? { backgroundColor: "#FF6B00" } : {}}>{p}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<ShoppingCart className="h-5 w-5" />} value={s.commandes.toString()} label="Commandes" trend={s.trend} />
          <StatCard icon={<DollarSign className="h-5 w-5" />} value={formatPrice(s.ca)} label="Chiffre d'affaires" trend={s.trend} />
          <StatCard icon={<Bike className="h-5 w-5" />} value={drivers.filter(d => d.active).length.toString()} label="Livreurs actifs" />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} value={formatPrice(Math.round(s.ca / Math.max(s.commandes, 1)))} label="Panier moyen" />
        </div>

        <div className="rounded-2xl border border-[hsl(213,20%,20%)] bg-[hsl(213,30%,15%)] p-4">
          <h2 className="mb-3 text-sm font-semibold text-[hsl(213,15%,60%)]">Commandes — 30 derniers jours</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(213,20%,22%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(213,15%,50%)", fontSize: 10 }} interval={4} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(213,15%,50%)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "hsl(213,30%,18%)", border: "1px solid hsl(213,20%,25%)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="commandes" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[hsl(213,15%,60%)]">Commandes récentes</h2>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-[hsl(213,20%,20%)] bg-[hsl(213,30%,15%)] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: "#FF6B00" }}>{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-[hsl(213,15%,75%)]"><Package className="h-3.5 w-3.5" /><span>{o.product} — <span className="font-semibold" style={{ color: "#FF6B00" }}>{formatPrice(o.amount)}</span></span></div>
                  <div className="flex items-center gap-2 text-[hsl(213,15%,65%)]"><MapPin className="h-3.5 w-3.5" /><span>{o.address}</span></div>
                  <div className="flex items-center gap-2 text-[hsl(213,15%,65%)]"><Phone className="h-3.5 w-3.5" /><span>{o.client} · {o.phone}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[hsl(213,15%,60%)]">Livreurs</h2>
          <div className="space-y-2">
            {drivers.map((d) => (
              <div key={d.name} className="flex items-center gap-3 rounded-xl border border-[hsl(213,20%,20%)] bg-[hsl(213,30%,15%)] p-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full`}
                  style={{ backgroundColor: d.active ? "rgba(255,107,0,0.2)" : "hsl(213,20%,22%)", color: d.active ? "#FF6B00" : "hsl(213,15%,45%)" }}>
                  <Bike className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{d.name}</p>
                  <p className="text-xs text-[hsl(213,15%,55%)]">{d.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#FF6B00" }}>{d.deliveries}</p>
                  <p className="text-xs text-[hsl(213,15%,50%)]">livraisons</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.active ? "#27AE60" : "hsl(213,15%,35%)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, value, label, trend }: { icon: React.ReactNode; value: string; label: string; trend?: "up" | "down" }) => (
  <div className="rounded-2xl border border-[hsl(213,20%,20%)] bg-[hsl(213,30%,15%)] p-4">
    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(255,107,0,0.15)", color: "#FF6B00" }}>{icon}</div>
    <p className="text-lg font-bold leading-tight">{value}</p>
    <div className="flex items-center gap-1">
      <p className="text-xs text-[hsl(213,15%,55%)]">{label}</p>
      {trend === "up" && <TrendingUp className="h-3 w-3" style={{ color: "#27AE60" }} />}
      {trend === "down" && <TrendingDown className="h-3 w-3" style={{ color: "#E74C3C" }} />}
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    "Livrée": { bg: "rgba(39,174,96,0.15)", text: "#27AE60" },
    "En cours": { bg: "rgba(255,107,0,0.15)", text: "#FF6B00" },
    "En route": { bg: "rgba(255,107,0,0.15)", text: "#FF6B00" },
    "En attente": { bg: "rgba(243,156,18,0.15)", text: "#F39C12" },
    "Annulée": { bg: "rgba(231,76,60,0.15)", text: "#E74C3C" },
  };
  const s = styles[status] ?? styles["En attente"];
  return (
    <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: s.bg, color: s.text }}>
      {status === "Livrée" && <CheckCircle className="h-3 w-3" />}
      {status}
    </span>
  );
};

export default AdminDashboard;
