import { motion } from "framer-motion";

interface ProgressGaugeProps {
  percentage: number;
}

const ProgressGauge = ({ percentage }: ProgressGaugeProps) => (
  <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
    <motion.div
      className="h-full bg-primary"
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
    />
  </div>
);

export default ProgressGauge;
