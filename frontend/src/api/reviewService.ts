import api from './axios';
import type { Review } from '../types/index';

export const reviewService = {
  create: (data: { bookingId: number; rating: number; comment?: string }) =>
    api.post<Review>('/reviews', data).then(r => r.data),

  getBySitter: (sitterId: number) =>
    api.get<Review[]>(`/reviews/sitter/${sitterId}`).then(r => r.data),
};
