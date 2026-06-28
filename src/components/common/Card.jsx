import { cn } from '../../utils/cn';

/**
 * Reusable Card Component
 */
export const Card = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  description,
  action,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div>
        {title && (
          <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-6">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
