import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const reducedMotionQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

const PageTransition = ({ children }: Props) => {
  const prefersReduced = reducedMotionQuery?.matches;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReduced ? undefined : { opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ minHeight: "100vh", willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
