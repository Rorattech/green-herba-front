import { apiPost } from "@/src/lib/api-client";

export interface CreateReviewBody {
  rating: number;
  message?: string;
}

export interface ReviewResponse {
  message: string;
  data: {
    id: number;
    product_id: number;
    user: string;
    rating: number;
    message: string | null;
    created_at: string;
  };
}

export async function createReview(productId: number, body: CreateReviewBody): Promise<ReviewResponse> {
  return apiPost<ReviewResponse>(`/api/products/${productId}/reviews`, body);
}
