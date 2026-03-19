import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  Download, Package, ShoppingCart, MapPin, Users, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addMonths, subMonths, addYears, subYears } from "date-fns";
import { fr } from "date-fns/locale";
import AdminBottomNav from "@/components/AdminBottomNav";

type Period = "jour" | "semaine" | "mois" | "annee";

const formatPrice = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const DEMO_DATA: Record<Period, {
  ca: number; commandes: number; panier: number;
  comparison: number; compLabel: string;
  chartTitle: string;
  chartData: { label: string; value: number }[];
}> = {
  jour: {
    ca: 87500, commandes: 12, panier: 7291,
    comparison: 15, compLabel: "vs hier",
    chartTitle: "Gains par heure",
    chartData: [
      { label: "8h", value: 5500 }, { label: "10h", value: 11000 },
      { label: "12h", value: 16500 }, { label: "14h", value: 8000 },
      { label: "16h", value: 12000 }, { label: "18h", value: 15000 },
      { label: "20h", value: 11500 }, { label: "22h", value: 8000 },
    ],
  },
  semaine: {
    ca: 450000, commandes: 58, panier: 7758,
    comparison: 12, compLabel: "vs semaine dernière",
    chartTitle: "Gains par jour",
    chartData: [
      { label: "Lun", value: 45000 }, { label: "Mar", value: 52000 },
      { label: "Mer", value: 58000 }, { label: "Jeu", value: 61000 },
      { label: "Ven", value: 72000 }, { label: "Sam", value: 95000 },
      { label: "Dim", value: 67000 },
    ],
  },
  mois: {
    ca: 1750000, commandes: 247, panier: 7085,
    comparison: 8, compLabel: "vs mois dernier",
    chartTitle: "Gains par semaine",
    chartData: [
      { label: "S1", value: 380000 }, { label: "S2", value: 420000 },
      { label: "S3", value: 460000 }, { label: "S4", value: 490000 },
    ],
  },
  annee: {
    ca: 4200000, commandes: 612, panier: 6862,
    comparison: 45, compLabel: "vs an dernier",
    chartTitle: "Gains par mois",
    chartData: [
      { label: "Jan", value: 280000 }, { label: "Fev", value: 310000 },
      { label: "Mar", value: 350000 }, { label: "Avr", value: 320000 },
      { label: "Mai", value: 340000 }, { label: "Jun", value: 360000 },
      { label: "Jul", value: 380000 }, { label: "Aou", value: 370000 },
      { label: "Sep", value: 390000 }, { label: "Oct", value: 350000 },
      { label: "Nov", value: 370000 }, { label: "Dec", value: 380000 },
    ],
  },
};

const brands = [
  { name: "Oryx Energie", pct: 65, color: "hsl(6, 78%, 57%)" },
  { name: "Benin Petro", pct: 20, color: "hsl(145, 63%, 42%)" },
  { name: "Puma Energie", pct: 10, color: "hsl(207, 68%, 47%)" },
  { name: "ProGaz", pct: 5, color: "hsl(283, 39%, 53%)" },
];

const sizes = [
  { label: "3kg", pct: 15 },
  { label: "6kg", pct: 35 },
  { label: "12kg", pct: 35 },
  { label: "25kg", pct: 15 },
];

const drivers = [
  { name: "Aymar L.", deliveries: 5, gains: 8500 },
  { name: "Brice A.", deliveries: 4, gains: 6000 },
  { name: "Codjo S.", deliveries: 3, gains: 4500 },
  { name: "Darius H.", deliveries: 0, gains: 0 },
];

const zones = [
  { name: "Akpakpa", orders: 5, pct: 35 },
  { name: "Cadjehoun", orders: 3, pct: 21 },
  { name: "Abomey-Calavi", orders: 2, pct: 14 },
  { name: "Fidjrosse", orders: 2, pct: 14 },
  { name: "Autres", orders: 2, pct: 14 },
];

const AdminFinances = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("jour");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDate, setWeekDate] = useState<Date>(new Date());
  const [monthDate, setMonthDate] = useState<Date>(new Date());
  const [yearDate, setYearDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!localStorage.getItem("gogaz_admin")) navigate("/admin", { replace: true });
  }, [navigate]);

  const data = DEMO_DATA[period];

  const periodLabel = useMemo(() => {
    switch (period) {
      case "jour":
        return `Aujourd'hui — ${format(selectedDate, "d MMMM yyyy", { locale: fr })}`;
      case "semaine": {
        const s = startOfWeek(weekDate, { weekStartsOn: 1 });
        const e = endOfWeek(weekDate, { weekStartsOn: 1 });
        return `Semaine du ${format(s, "d", { locale: fr })} au ${format(e, "d MMMM yyyy", { locale: fr })}`;
      }
      case "mois":
        return format(monthDate, "MMMM yyyy", { locale: fr });
      case "annee":
        return format(yearDate, "yyyy");
    }
  }, [period, selectedDate, weekDate, monthDate, yearDate]);

  const chartConfig = { value: { label: "Gains", color: "hsl(25, 100%, 50%)" } };

  const exportCSV = () => {
    const rows = [
      ["Periode", periodLabel],
      ["CA", data.ca.toString()],
      ["Commandes", data.commandes.toString()],
      ["Panier moyen", data.panier.toString()],
      "",
      ["Label", "Montant"],
      ...data.chartData.map((d) => [d.label, d.value.toString()]),
    ];
    const csv = rows.map((r) => (Array.isArray(r) ? r.join(",") : "")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-gogaz-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const periods: { key: Period; label: string }[] = [
    { key: "jour", label: "Jour" },
    { key: "semaine", label: "Semaine" },
    { key: "mois", label: "Mois" },
    { key: "annee", label: "Année" },
  ];

  return (
    <div className="min-h-screen bg-[hsl(0,0%,97%)] pb-24">
      {/* Header */}
      <div className="px-5 pt-8 pb-5" style={{ backgroundColor: "hsl(0,0%,10%)" }}>
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6" style={{ color: "#FF6B00" }} />
          <h1 className="text-xl font-bold text-white">Recapitulatif des gains</h1>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Period selector */}
        <div className="grid grid-cols-4 gap-2">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="h-9 rounded-lg text-sm font-semibold transition-colors"
              style={
                period === p.key
                  ? { backgroundColor: "#FF6B00", color: "#fff" }
                  : { backgroundColor: "#fff", border: "1px solid hsl(0,0%,88%)", color: "hsl(0,0%,50%)" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date navigator */}
        {period === "jour" && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full h-10 rounded-xl bg-white border border-[hsl(0,0%,88%)] text-sm text-[hsl(0,0%,30%)] font-medium">
                {format(selectedDate, "d MMMM yyyy", { locale: fr })}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} locale={fr} />
            </PopoverContent>
          </Popover>
        )}
        {period === "semaine" && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-[hsl(0,0%,88%)] h-10 px-3">
            <button onClick={() => setWeekDate(subWeeks(weekDate, 1))}><ChevronLeft className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
            <span className="text-sm font-medium text-[hsl(0,0%,30%)]">
              Semaine du {format(startOfWeek(weekDate, { weekStartsOn: 1 }), "d", { locale: fr })} au {format(endOfWeek(weekDate, { weekStartsOn: 1 }), "d MMM yyyy", { locale: fr })}
            </span>
            <button onClick={() => setWeekDate(addWeeks(weekDate, 1))}><ChevronRight className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
          </div>
        )}
        {period === "mois" && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-[hsl(0,0%,88%)] h-10 px-3">
            <button onClick={() => setMonthDate(subMonths(monthDate, 1))}><ChevronLeft className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
            <span className="text-sm font-medium text-[hsl(0,0%,30%)] capitalize">{format(monthDate, "MMMM yyyy", { locale: fr })}</span>
            <button onClick={() => setMonthDate(addMonths(monthDate, 1))}><ChevronRight className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
          </div>
        )}
        {period === "annee" && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-[hsl(0,0%,88%)] h-10 px-3">
            <button onClick={() => setYearDate(subYears(yearDate, 1))}><ChevronLeft className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
            <span className="text-sm font-medium text-[hsl(0,0%,30%)]">{format(yearDate, "yyyy")}</span>
            <button onClick={() => setYearDate(addYears(yearDate, 1))}><ChevronRight className="h-5 w-5 text-[hsl(0,0%,50%)]" /></button>
          </div>
        )}

        {/* Main recap card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-[13px] text-[hsl(0,0%,50%)] mb-1 capitalize">{periodLabel}</p>
          <p className="text-[13px] text-[hsl(0,0%,40%)] mb-1">Chiffre d'affaires total</p>
          <p className="text-4xl font-bold mb-4" style={{ color: "#FF6B00" }}>{formatPrice(data.ca)}</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[hsl(0,0%,97%)] rounded-xl p-3 text-center">
              <ShoppingCart className="h-4 w-4 mx-auto mb-1 text-[hsl(0,0%,50%)]" />
              <p className="text-lg font-bold text-[hsl(0,0%,15%)]">{data.commandes}</p>
              <p className="text-xs text-[hsl(0,0%,50%)]">Commandes</p>
            </div>
            <div className="bg-[hsl(0,0%,97%)] rounded-xl p-3 text-center">
              <Package className="h-4 w-4 mx-auto mb-1 text-[hsl(0,0%,50%)]" />
              <p className="text-lg font-bold text-[hsl(0,0%,15%)]">{formatPrice(data.panier)}</p>
              <p className="text-xs text-[hsl(0,0%,50%)]">Panier moyen</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data.comparison >= 0 ? (
              <TrendingUp className="h-4 w-4" style={{ color: "#27AE60" }} />
            ) : (
              <TrendingDown className="h-4 w-4" style={{ color: "#E74C3C" }} />
            )}
            <span
              className="text-sm font-semibold"
              style={{ color: data.comparison >= 0 ? "#27AE60" : "#E74C3C" }}
            >
              {data.comparison >= 0 ? "+" : ""}{data.comparison}% {data.compLabel}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(0,0%,20%)] mb-3">{data.chartTitle}</h3>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={data.chartData}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Brand breakdown */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(0,0%,20%)] mb-3">Ventes par marque</h3>
          <div className="space-y-3">
            {brands.map((b) => (
              <div key={b.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[hsl(0,0%,20%)]">{b.name}</span>
                  <span className="text-[hsl(0,0%,45%)]">{b.pct}% — {formatPrice(Math.round(data.ca * b.pct / 100))}</span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(0,0%,93%)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Size breakdown */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(0,0%,20%)] mb-3">Ventes par taille</h3>
          <div className="space-y-3">
            {sizes.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "#FF6B00" }}>{s.label}</span>
                    <span className="text-[hsl(0,0%,20%)]">Bouteille {s.label}</span>
                  </div>
                  <span className="text-[hsl(0,0%,45%)]">{s.pct}% — {formatPrice(Math.round(data.ca * s.pct / 100))}</span>
                </div>
                <div className="h-2 rounded-full bg-[hsl(0,0%,93%)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: "#FF6B00" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver table */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(0,0%,20%)] mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-[hsl(0,0%,50%)]" />
            Performance livreurs
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Livreur</TableHead>
                <TableHead className="text-center">Livr.</TableHead>
                <TableHead className="text-right">Gains</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((d, i) => (
                <TableRow key={d.name}>
                  <TableCell className="font-bold text-[hsl(0,0%,30%)]">
                    {i + 1}
                    {i === 0 && (
                      <span className="ml-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: "#F1C40F", color: "#fff" }}>
                        <Award className="h-3 w-3" /> Top
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-[hsl(0,0%,20%)]">{d.name}</TableCell>
                  <TableCell className="text-center text-[hsl(0,0%,40%)]">{d.deliveries}</TableCell>
                  <TableCell className="text-right font-semibold" style={{ color: "#27AE60" }}>
                    {formatPrice(d.gains)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Zone table */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[hsl(0,0%,20%)] mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[hsl(0,0%,50%)]" />
            Zones les plus actives
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead className="text-center">Cmd</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((z) => (
                <TableRow key={z.name}>
                  <TableCell className="font-medium text-[hsl(0,0%,20%)]">{z.name}</TableCell>
                  <TableCell className="text-center text-[hsl(0,0%,40%)]">{z.orders} cmd</TableCell>
                  <TableCell className="text-right font-semibold" style={{ color: "#FF6B00" }}>{z.pct}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Export */}
        <div className="flex justify-center pb-4">
          <Button
            onClick={exportCSV}
            className="w-[90%] h-12 rounded-xl text-sm font-bold"
            style={{ backgroundColor: "hsl(0,0%,10%)" }}
          >
            <Download className="mr-2 h-[18px] w-[18px]" />
            Exporter le rapport
          </Button>
        </div>
      </div>

      <AdminBottomNav />
    </div>
  );
};

export default AdminFinances;
