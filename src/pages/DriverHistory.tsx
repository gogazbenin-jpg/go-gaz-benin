import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import DriverNav from "@/components/DriverNav";

const formatPrice = (price: number) => price.toLocaleString("fr-FR") + " FCFA";

const summaryData = {
  today: { count: 3, earnings: 3500 },
  month: { count: 47, earnings: 58500 },
};

const deliveries = [
  { id: 1, product: "Oryx 12kg", area: "Akpakpa", client: "Koffi M.", amount: 11000, gain: 1500, time: "Aujourd'hui 14h32" },
  { id: 2, product: "Puma 6kg", area: "Fidjrossè", client: "Aïcha S.", amount: 5500, gain: 800, time: "Aujourd'hui 11h15" },
  { id: 3, product: "Bénin Pétro 25kg", area: "Cadjèhoun", client: "Serge D.", amount: 22000, gain: 1200, time: "Aujourd'hui 09h00" },
  { id: 4, product: "Oryx 12kg", area: "Ganhi", client: "Patrick A.", amount: 11000, gain: 1500, time: "Hier 17h45" },
  { id: 5, product: "ProGaz 6kg", area: "Akpakpa", client: "Mariam B.", amount: 6000, gain: 900, time: "Hier 14h10" },
];

const DriverHistory = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-4 pb-5 pt-8 rounded-b-3xl" style={{ background: "linear-gradient(135deg, #FF6B00, #E65C00)" }}>
        <h1 className="text-xl font-bold text-white font-[Poppins]">Mes livraisons</h1>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Aujourd'hui", count: summaryData.today.count, earnings: summaryData.today.earnings },
            { label: "Ce mois", count: summaryData.month.count, earnings: summaryData.month.earnings },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.count} livraisons</p>
              <p className="text-sm font-semibold text-primary">{formatPrice(s.earnings)}</p>
            </motion.div>
          ))}
        </div>

        {/* Delivery list */}
        <div className="flex flex-col">
          {deliveries.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex gap-3 p-4 border-b border-border"
              style={{ backgroundColor: i % 2 === 1 ? "#F8F8F8" : "transparent" }}
            >
              <CheckCircle size={20} className="text-[#27AE60] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {d.product} — {d.area}
                </p>
                <p className="text-sm text-muted-foreground">
                  {d.client} — {formatPrice(d.amount)}
                </p>
                <p className="text-sm font-semibold text-primary">Gains : {formatPrice(d.gain)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
          <p className="text-sm font-bold text-primary">
            Total aujourd'hui : {formatPrice(summaryData.today.earnings)}
          </p>
          <p className="text-sm font-bold text-primary">
            Total ce mois : {formatPrice(summaryData.month.earnings)}
          </p>
        </div>
      </div>

      <DriverNav />
    </div>
  );
};

export default DriverHistory;
