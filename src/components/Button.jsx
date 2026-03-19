import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Custom utility for merging classes (simulating tailwind-merge logic with vanilla CSS classes)
 * Since we are using Vanilla CSS, we'll just use clsx for now.
 */
const cn = (...inputs) => clsx(inputs);

export const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  loading = false, 
  ...props 
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseClass, className, loading && 'opacity-70 pointer-events-none')}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="loader">Loading...</span>
      ) : children}
    </motion.button>
  );
};
