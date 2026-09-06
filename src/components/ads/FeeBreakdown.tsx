import { formatKz } from '../../lib/format';
import { cn } from '../../lib/cn';

interface FeeBreakdownProps {
	price: number;
	feePercent: number;
	className?: string;
}

export function FeeBreakdown({
	price,
	feePercent,
	className,
}: FeeBreakdownProps) {
	const fee = Math.round((price * feePercent) / 100);
	const net = price - fee;
	return (
		<div
			className={cn(
				'rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm',
				className,
			)}
		>
			<p className="mb-2 font-medium text-slate-800">
				Como fica o seu anúncio
			</p>
			<div className="flex justify-between text-slate-600">
				<span>Preço (comprador transfere)</span>
				<span className="font-mono font-semibold text-slate-900">
					{formatKz(price)}
				</span>
			</div>
			<div className="flex justify-between text-slate-600">
				<span>Taxa da plataforma ({feePercent}%)</span>
				<span className="font-mono font-semibold text-red-500">
					-{formatKz(fee)}
				</span>
			</div>
			<div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
				<span>Recebe após vender</span>
				<span className="font-mono">{formatKz(net)}</span>
			</div>
		</div>
	);
}
