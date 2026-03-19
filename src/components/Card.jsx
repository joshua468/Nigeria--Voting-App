import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Card = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx('glass-panel', className)}
      style={{ padding: 'var(--spacing-lg)' }}
    >
      {children}
    </motion.div>
  );
};
