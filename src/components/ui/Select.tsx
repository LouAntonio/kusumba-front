import { forwardRef, useId, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	error?: string;
	options: Array<{ value: string; label: string }>;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ label, error, className, id, options, ...props }, ref) => {
		const autoId = useId();
		const selectId = id ?? autoId;
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label
						htmlFor={selectId}
						className="text-sm font-medium text-slate-700"
					>
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={selectId}
					className={cn(
						'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900',
						'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
						error && 'border-red-400 focus:ring-red-200',
						className,
					)}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
		);
	},
);

Select.displayName = 'Select';
