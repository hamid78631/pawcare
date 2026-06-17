import api from './axios';
import type { SitterProfile, Review } from '../types/index';

export const sitterService = {
  search: (params: { city?: string; animalType?: string }) =>
    api.get<SitterProfile[]>('/sitter-profile/search', { params }).then(r => r.data),

  getById: (id: number) =>
    api.get<SitterProfile>(`/sitter-profile/${id}`).then(r => r.data),

  getReviews: (userId: number) =>
    api.get<Review[]>(`/reviews/sitter/${userId}`).then(r => r.data),

  getMyProfile: () =>
    api.get<SitterProfile>('/sitter-profile/me').then(r => r.data),

  create: (data: { bio?: string; hourlyRate: number; city?: string; acceptedAnimalTypes: string[]; isAvailable?: boolean }) =>
    api.post<SitterProfile>('/sitter-profile', data).then(r => r.data),

  update: (data: { bio?: string; hourlyRate: number; city?: string; acceptedAnimalTypes: string[]; isAvailable?: boolean }) =>
    api.patch<SitterProfile>('/sitter-profile', data).then(r => r.data),
};
