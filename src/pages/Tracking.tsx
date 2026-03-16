import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle, Circle, Truck, MapPin, Phone, Clock, Star,
  Home as HomeIcon, ShoppingCart, User,
} from "lucide-react";
import { motion } from "framer-motion";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

const COTONOU_CENTER = { lat: 6.3654, lng: 2.4183 };
const DRIVER_POS = { lat: 6.3720, lng: 2.4100 };
const CLIENT_POS = { lat: 6.3590, lng: 2.4250 };

const MAPS_KEY = "AIzaSyDemo_placeholder_key";

const mapContainerStyle = { width: "100%", height: "100%" };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#c9e8f7" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#f0f0f0" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#e0e0e0" }],
    },
  ],
};

const routePath = [
  DRIVER_POS,
  { lat: 6.3700, lng: 2.4120 },
  { lat: 6.3670, lng: 2.4160 },
  { lat: 6.3640, lng: 2.4200 },
  { lat: 6.3610, lng: 2.4230 },
  CLIENT_POS,
];

const steps = [
  { label: "Commande confirmée", time: "14h32", status: "done" as const },
  { label: "Préparation en cours", time: "14h35", status: "done" as const },
  { label: "Livreur en route", time: "", status: "active" as const },
  { label: "Livraison effectuée", time: "", status: "pending" as const },
];

const StepIcon = ({ status }: { status: "done" | "active" | "pending" }) => {
  if (status === "done")
    return <CheckCircle size={22} style={{ color: "#27AE60" }} />;
  if (status === "active")
    return (
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Truck size={22} style={{ color: "#FF6B00" }} />
      </motion.div>
    );
  return <Circle size={22} style={{ color: "#BDBDBD" }} />;
};

/* ── Empty state ── */
const EmptyState = ({ onOrder }: { onOrder: () => void }) => (
  <div className="flex flex-1 flex-col items-center justify-center px-6 text-center gap-4">
    <MapPin size={48} style={{ color: "#BDBDBD" }} />
    <p className="text-lg font-bold text-foreground">Aucune livraison en cours</p>
    <p className="text-sm text-muted-foreground max-w-[260px]">
      Passez une commande pour suivre votre livreur
    </p>
    <Button
      onClick={onOrder}
      className="h-12 rounded-2xl px-8 text-base font-semibold"
      style={{ backgroundColor: "#FF6B00" }}
    >
      Commander maintenant
    </Button>
  </div>
);

/* ── Map section (with fallback) ── */
const MapSection = () => {
  const [mapError, setMapError] = useState(false);

  if (mapError) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "55vh", background: "#eee" }}
      >
        <div className="text-center px-6">
          <MapPin size={40} style={{ color: "#FF6B00" }} className="mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Carte indisponible</p>
          <p className="text-xs text-muted-foreground mt-1">
            La cl{"\u00e9"} Google Maps n{"'"}est pas encore configur{"\u00e9"}e
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "55vh", position: "relative" }}>
      <LoadScript
        googleMapsApiKey={MAPS_KEY}
        onError={() => setMapError(true)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={COTONOU_CENTER}
          zoom={14}
          options={mapOptions}
        >
          {/* Driver marker */}
          <Marker
            position={DRIVER_POS}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#FF6B00",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            }}
          />
          {/* Client marker */}
          <Marker
            position={CLIENT_POS}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            }}
          />
          {/* Route */}
          <Polyline
            path={routePath}
            options={{
              strokeColor: "#FF6B00",
              strokeOpacity: 0,
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1",
                    strokeOpacity: 1,
                    strokeColor: "#FF6B00",
                    scale: 3,
                  },
                  offset: "0",
                  repeat: "15px",
                },
              ],
            }}
          />
        </GoogleMap>
      </LoadScript>

      {/* Floating driver icon */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          top: "35%",
          left: "38%",
          width: 40,
          height: 40,
          backgroundColor: "#FF6B00",
          boxShadow: "0 4px 12px rgba(255,107,0,0.4)",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Truck size={20} color="#fff" />
      </motion.div>
    </div>
  );
};

/* ── Main component ── */
const navTabs = [
  { id: "home", icon: HomeIcon, label: "Accueil", path: "/home" },
  { id: "order", icon: ShoppingCart, label: "Commander", path: "/order" },
  { id: "track", icon: MapPin, label: "Suivi", path: "/tracking" },
  { id: "profile", icon: User, label: "Profil", path: "/profile" },
];

const Tracking = () => {
  const navigate = useNavigate();
  const [hasOrder, setHasOrder] = useState(false);
  const [eta, setEta] = useState(22);

  useEffect(() => {
    const data = localStorage.getItem("gogaz_order");
    setHasOrder(!!data);
  }, []);

  // Simulate ETA countdown
  useEffect(() => {
    if (!hasOrder) return;
    const iv = setInterval(() => {
      setEta((prev) => (prev > 15 ? prev - 1 : 15));
    }, 30000);
    return () => clearInterval(iv);
  }, [hasOrder]);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-20">
        {/* Header */}
        <header
          className="px-5 pb-4 pt-10"
          style={{ background: "#FF6B00" }}
        >
          <h1 className="text-xl font-bold text-white">Suivi de livraison</h1>
          <p className="text-sm text-white/80">En temps réel</p>
        </header>

        {!hasOrder ? (
          <EmptyState onOrder={() => navigate("/order")} />
        ) : (
          <>
            {/* Map */}
            <MapSection />

            {/* Bottom panel */}
            <div
              className="-mt-6 relative z-10 flex-1 rounded-t-3xl bg-white px-5 pt-5 pb-6"
              style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
            >
              {/* Steps */}
              <div className="flex flex-col gap-0 mb-5">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <StepIcon status={step.status} />
                      {i < steps.length - 1 && (
                        <div
                          className="w-0.5 my-1"
                          style={{
                            height: 28,
                            backgroundColor:
                              step.status === "done"
                                ? "#27AE60"
                                : step.status === "active"
                                ? "#FF6B00"
                                : "#E0E0E0",
                          }}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className="text-sm"
                        style={{
                          fontWeight: step.status === "active" ? 700 : 500,
                          color:
                            step.status === "done"
                              ? "#27AE60"
                              : step.status === "active"
                              ? "#FF6B00"
                              : "#BDBDBD",
                        }}
                      >
                        {step.label}
                      </p>
                      {step.time && (
                        <p className="text-xs text-muted-foreground">{step.time}</p>
                      )}
                      {step.status === "active" && (
                        <p className="text-xs font-bold" style={{ color: "#FF6B00" }}>
                          En cours...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: "#E0E0E0" }}>
                <div className="flex h-full">
                  <div className="h-full" style={{ width: "50%", backgroundColor: "#27AE60" }} />
                  <motion.div
                    className="h-full"
                    style={{ width: "25%", backgroundColor: "#FF6B00" }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Driver info */}
              <div className="flex items-center gap-3 mb-4 rounded-2xl border border-border bg-card p-3">
                <div
                  className="flex h-[50px] w-[50px] items-center justify-center rounded-full text-white font-bold text-lg"
                  style={{ backgroundColor: "#FF6B00" }}
                >
                  AL
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">Aymar L.</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={14} style={{ color: "#F5A623", fill: "#F5A623" }} />
                    <span className="text-xs font-semibold" style={{ color: "#F5A623" }}>
                      4.8
                    </span>
                  </div>
                </div>
                <a
                  href="tel:+22997123456"
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                  style={{ backgroundColor: "#27AE60" }}
                >
                  <Phone size={16} />
                  Appeler
                </a>
              </div>

              {/* ETA */}
              <div className="flex items-center gap-2 rounded-xl p-3" style={{ backgroundColor: "rgba(255,107,0,0.08)" }}>
                <Clock size={20} style={{ color: "#FF6B00" }} />
                <p className="text-sm font-semibold" style={{ color: "#FF6B00" }}>
                  Livraison dans 15 à 30 min
                </p>
              </div>
            </div>
          </>
        )}
        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-white">
          <div className="mx-auto flex max-w-md items-center justify-around py-2">
            {navTabs.map((tab) => {
              const isActive = tab.id === "track";
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className="relative flex flex-col items-center gap-0.5 px-4 py-1"
                >
                  <tab.icon
                    className="h-5 w-5"
                    style={{ color: isActive ? "#FF6B00" : "#9E9E9E" }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color: isActive ? "#FF6B00" : "#9E9E9E",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div
                      className="absolute -bottom-2 h-0.5 w-8 rounded-full"
                      style={{ background: "#FF6B00" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Tracking;
