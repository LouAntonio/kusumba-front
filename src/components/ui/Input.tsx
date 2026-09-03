import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className, id, ...props }, ref) => {
		const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label
						htmlFor={inputId}
						className="text-sm font-medium text-slate-700"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={cn(
						'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900',
						'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
						error && 'border-red-400 focus:ring-red-200',
						className,
					)}
					{...props}
				/>
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
		);
	},
);

Input.displayName = 'Input';
