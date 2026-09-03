import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { cn } from '../../lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, className, id, type, ...props }, ref) => {
		const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
		const isPassword = type === 'password';
		const [showPassword, setShowPassword] = useState(isPassword);

		const input = (
			<input
				ref={ref}
				id={inputId}
				type={isPassword && showPassword ? 'text' : type}
				className={cn(
					'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900',
					isPassword && 'pr-10',
					'placeholder:text-slate-400',
					error && 'border-red-400',
					className,
				)}
				{...props}
			/>
		);

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
				{isPassword ? (
					<div className="relative">
						{input}
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							tabIndex={-1}
							aria-label={
								showPassword ? 'Ocultar senha' : 'Mostrar senha'
							}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600"
						>
							{showPassword ? (
								<FaEyeSlash className="h-4 w-4" />
							) : (
								<FaEye className="h-4 w-4" />
							)}
						</button>
					</div>
				) : (
					input
				)}
				{error && <span className="text-xs text-red-600">{error}</span>}
			</div>
		);
	},
);

Input.displayName = 'Input';
