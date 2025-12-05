import React from "react";
import { motion } from "framer-motion";

/**
 * MotionWrapper - Reusable Framer Motion wrapper with predefined animations
 * 
 * Usage:
 * <MotionWrapper variant="fadeUp">
 *   <YourComponent />
 * </MotionWrapper>
 */

const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  slideLeft: {
    initial: { opacity: 0, x: -10 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  parallaxSlow: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function MotionWrapper({ 
  children, 
  variant = "fadeUp", 
  delay = 0,
  className = "",
  ...props 
}) {
  const selectedVariant = variants[variant] || variants.fadeUp;
  
  return (
    <motion.div
      initial={selectedVariant.initial}
      whileInView={selectedVariant.whileInView}
      viewport={selectedVariant.viewport}
      transition={{
        ...selectedVariant.transition,
        delay
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Export variants for manual use
export { variants };