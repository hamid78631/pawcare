import api from './axios';
import type { User } from '../types/index';

export const userService = {
  getMe: () => api.get<User>('/users/me').then(r => r.data),

  updateMe: (data: { firstName: string; lastName: string; city?: string }) =>
    api.patch<User>('/users/me', data).then(r => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/me/password', data),
};
