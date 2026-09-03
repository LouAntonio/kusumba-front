import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, error, className, id, ...props }, ref) => {
		const autoId = useId();
		const textareaId = id ?? autoId;
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label
						htmlFor={textareaId}
						className="text-sm font-medium text-slate-700"
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={textareaId}
					className={cn(
						'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
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

Textarea.displayName = 'Textarea';
