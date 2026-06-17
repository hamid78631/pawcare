import api from './axios';
import type { Booking, BookingWithRelations } from '../types/index';

export const bookingService = {
  getByOwner: () => api.get<BookingWithRelations[]>('/bookings/mine/owner').then(r => r.data),

  getBySitter: () => api.get<BookingWithRelations[]>('/bookings/mine/sitter').then(r => r.data),

  create: (data: { sitterId: number; animalId: number; startDate: string; endDate: string; message?: string }) =>
    api.post<Booking>('/bookings', data).then(r => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }).then(r => r.data),
};
