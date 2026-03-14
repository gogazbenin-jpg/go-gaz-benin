import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gogazLogo from "@/assets/gogaz-logo.png";

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
      }, 500);
      return () => clearTimeout(t);
    }
  }, [visible, navigate, onboardingDone, hasSession]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={gogazLogo}
        alt="GoGaz"
        className="w-[250px] object-contain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.8, delay: 0.5, times: [0, 0.5, 1] } }}
      />
      <p className="mt-3 text-sm italic" style={{ color: "#666" }}>
        Nous vous simplifions la vie !
      </p>
      <div className="mt-6 h-1 w-[120px] overflow-hidden rounded-full" style={{ backgroundColor: "#E0E0E0" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "#FF6B00" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default Splash;
