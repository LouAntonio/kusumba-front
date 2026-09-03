import {
	type ButtonHTMLAttributes,
	type AnchorHTMLAttributes,
	type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
	primary:
		'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-300',
	accent: 'bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent-200',
	outline:
		'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-slate-200',
	ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-200',
	danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
};

const sizes: Record<Size, string> = {
	sm: 'h-8 px-3 text-sm',
	md: 'h-10 px-4 text-sm',
	lg: 'h-12 px-6 text-base',
};

interface BaseProps {
	variant?: Variant;
	size?: Size;
	className?: string;
	children?: ReactNode;
	fullWidth?: boolean;
}

type ButtonProps = BaseProps &
	ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };

type LinkButtonProps = BaseProps & { to: string } & Omit<
		AnchorHTMLAttributes<HTMLAnchorElement>,
		'href'
	>;

type Props = ButtonProps | LinkButtonProps;

export function Button(props: Props) {
	const {
		variant = 'primary',
		size = 'md',
		className,
		children,
		fullWidth,
	} = props;

	const classes = cn(
		'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
		'disabled:cursor-not-allowed disabled:opacity-60',
		variants[variant],
		sizes[size],
		fullWidth && 'w-full',
		className,
	);

	if ('to' in props && props.to !== undefined) {
		const { to, ...linkProps } = props as LinkButtonProps;
		return (
			<Link to={to} className={classes} {...linkProps}>
				{children}
			</Link>
		);
	}

	const { type, ...rest } = props as ButtonProps;
	return (
		<button type={type ?? 'button'} className={classes} {...rest}>
			{children}
		</button>
	);
}
