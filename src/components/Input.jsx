import { clsx } from 'clsx';

export const Input = ({ label, error, className, ...props }) => {
  return (
    <div className={clsx('flex flex-col gap-2 w-full', className)} style={{ marginBottom: 'var(--spacing-md)' }}>
      {label && (
        <label className="text-sm font-medium text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10',
          error && 'border-red-500'
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 mt-1 ml-1">{error}</span>
      )}
      <style dangerouslySetInnerHTML={{ __html: `
        input {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          width: 100%;
          transition: all 0.3s ease;
        }
        input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(0, 135, 81, 0.1);
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
      `}} />
    </div>
  );
};
