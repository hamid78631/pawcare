import api from './axios';
import type { Animal } from '../types/index';

export const animalService = {
  getAll: () => api.get<Animal[]>('/animals').then(r => r.data),

  create: (data: { name: string; species: string; age: number; breed?: string; description?: string }) =>
    api.post<Animal>('/animals', data).then(r => r.data),

  update: (id: number, data: { name: string; species: string; age: number; breed?: string; description?: string }) =>
    api.patch<Animal>(`/animals/${id}`, data).then(r => r.data),

  remove: (id: number) => api.delete(`/animals/${id}`),
};
