import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import gogazLogoDark from "@/assets/gogaz-logo-dark.jpg";

const Splash = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const onboardingDone = localStorage.getItem("gogaz_onboarding_done");
  const hasSession = (() => {
    try {
      const s = JSON.parse(localStorage.getItem("gogaz_session") || "null");
      return s && s.expires > Date.now();
    } catch { return false; }
  })();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => {
        const dest = hasSession ? "/home" : onboardingDone ? "/auth" : "/onboarding";
        navigate(dest, { replace: true });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [visible, navigate, onboardingDone, hasSession]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "#1A1A1A",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <img src={gogazLogoDark} alt="GoGaz" className="w-[280px] object-contain" />
      <div className="mt-8 h-1 w-16 rounded-full overflow-hidden bg-white/20">
        <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: "60%" }} />
      </div>
    </div>
  );
};

export default Splash;
