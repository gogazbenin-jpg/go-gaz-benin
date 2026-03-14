import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "slideLeft" | "slideRight" | "slideUp" | "fadeScale" | "slideBottom" | "default";
}

const variants = {
  slideLeft: {
    initial: { x: "100%", opacity: 0.8 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0.8 },
  },
  slideRight: {
    initial: { x: "-100%", opacity: 0.8 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0.8 },
  },
  slideUp: {
    initial: { y: "100%", scale: 0.95 },
    animate: { y: 0, scale: 1 },
    exit: { y: "-100%", scale: 0.95 },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.9, rotate: 2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.9, rotate: -2 },
  },
  slideBottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  default: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

const reducedMotionQuery = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

const PageTransition = ({ children, variant = "default" }: Props) => {
  const prefersReduced = reducedMotionQuery?.matches;
  const v = prefersReduced ? variants.default : variants[variant];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ minHeight: "100vh" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
