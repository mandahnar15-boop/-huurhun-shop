"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n}`}
          onClick={onChange ? () => onChange(n) : undefined}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={n <= value ? "var(--color-ink)" : "none"}
            stroke="var(--color-ink)"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// 상품 리뷰 목록 + 작성 폼 (Supabase reviews 테이블 사용)
export default function ReviewSection({ productId, dict }) {
  const { user, isLoaded } = useAuth();
  const [supabase] = useState(() => createClient());
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? []);
        setLoading(false);
      });
  }, [supabase, productId]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        user_email: user.email,
        rating,
        comment,
      })
      .select()
      .single();

    setIsSubmitting(false);
    if (!error && data) {
      setReviews((prev) => [data, ...prev]);
      setComment("");
    }
  }

  async function handleDelete(id) {
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="border-t border-hairline pt-6">
      <h2 className="mb-4 text-base font-medium text-ink">
        {dict.review.title} ({reviews.length})
      </h2>

      {!loading && reviews.length === 0 && (
        <p className="mb-6 text-sm font-medium text-mute">{dict.review.empty}</p>
      )}

      <div className="mb-6 flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-1 border-b border-hairline pb-4">
            <div className="flex items-center justify-between">
              <Stars value={review.rating} />
              {user?.id === review.user_id && (
                <button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  className="text-xs font-medium text-mute hover:text-ink"
                >
                  {dict.review.delete}
                </button>
              )}
            </div>
            <p className="text-sm font-medium text-ink">{review.comment}</p>
            <p className="text-xs font-medium text-mute">
              {review.user_email} · {new Date(review.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
        ))}
      </div>

      {isLoaded && user && !myReview && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-ink">{dict.review.rating}</span>
            <Stars value={rating} onChange={setRating} />
          </div>
          <textarea
            required
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={dict.review.commentPlaceholder}
            rows={3}
            className="resize-none border border-hairline p-3 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-[30px] bg-ink text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {dict.review.submit}
          </button>
        </form>
      )}

      {isLoaded && user && myReview && (
        <p className="text-sm font-medium text-mute">{dict.review.alreadyReviewed}</p>
      )}

      {isLoaded && !user && <p className="text-sm font-medium text-mute">{dict.review.loginToWrite}</p>}
    </div>
  );
}
