import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useAdReviews, useCreateReview } from '../../hooks/useReviews';
import { useAuthStore } from '../../store/authStore';
import { getApiError } from '../../lib/axios';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { RatingStars } from '../ui/RatingStars';
import { Textarea } from '../ui/Textarea';
import { fullName, formatDate } from '../../lib/format';
import { Skeleton } from '../ui/Skeleton';

export function AdReviews({ adId }: { adId: string }) {
	const { data, isLoading } = useAdReviews(adId);
	const user = useAuthStore((s) => s.user);
	const createReviewMutation = useCreateReview(adId);
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [comment, setComment] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (rating === 0) {
			toast.error('Escolha uma avaliação de 1 a 5 estrelas.');
			return;
		}
		createReviewMutation.mutate(
			{ rating, comment: comment || undefined },
			{
				onSuccess: () => {
					toast.success('Avaliação enviada!');
					setRating(0);
					setComment('');
				},
				onError: (error) => toast.error(getApiError(error)),
			},
		);
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-display text-xl">
					Avaliações ({data?.total ?? 0})
				</h2>
			</div>

			{user && (
				<form
					onSubmit={handleSubmit}
					className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
				>
					<div className="flex items-center gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onMouseEnter={() => setHover(star)}
								onMouseLeave={() => setHover(0)}
								onClick={() => setRating(star)}
								className="text-2xl"
								aria-label={`${star} estrelas`}
							>
								{star <= (hover || rating) ? (
									<FaStar className="text-amber-400" />
								) : (
									<FaRegStar className="text-slate-300" />
								)}
							</button>
						))}
					</div>
					<Textarea
						label="O seu comentário"
						placeholder="Como foi a sua experiência com este anunciante?"
						value={comment}
						onChange={(e) =>
							setComment(e.target.value.slice(0, 1000))
						}
						maxLength={1000}
					/>
					<Button
						type="submit"
						disabled={createReviewMutation.isPending}
						size="sm"
					>
						{createReviewMutation.isPending
							? 'A enviar…'
							: 'Publicar avaliação'}
					</Button>
				</form>
			)}

			{isLoading ? (
				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4"
						>
							<Skeleton className="h-8 w-8 shrink-0 rounded-full" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-3 w-1/3" />
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-4 w-4/5" />
							</div>
						</div>
					))}
				</div>
			) : (data?.items?.length ?? 0) === 0 ? (
				<p className="text-sm text-muted">
					Ainda não há avaliações para este anúncio.
				</p>
			) : (
				<div className="space-y-4">
					{(data?.items ?? []).map((review) => (
						<div
							key={review.id}
							className="rounded-2xl border border-slate-200 bg-white p-4"
						>
							<div className="flex items-center gap-3">
								<Avatar
									image={review.reviewer?.image}
									name={review.reviewer?.name ?? 'U'}
									size="sm"
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-slate-800">
										{review.reviewer
											? fullName(review.reviewer)
											: 'Utilizador'}
									</p>
									<p className="text-xs text-muted">
										{formatDate(review.createdAt)}
									</p>
								</div>
								<RatingStars rating={review.rating} size="sm" />
							</div>
							{review.comment && (
								<p className="mt-3 text-sm text-slate-700">
									{review.comment}
								</p>
							)}
							{review.response && (
								<div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
									<span className="font-medium text-slate-800">
										Resposta:
									</span>{' '}
									{review.response}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
