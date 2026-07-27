import apiClient from './apiClient';

export async function register(payload) {
  const { data } = await apiClient.post('/auth/register', payload);
  return data.data;
}

export async function login(payload) {
  const { data } = await apiClient.post('/auth/login', payload);
  return data.data;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}

export async function refresh() {
  const { data } = await apiClient.post('/auth/refresh');
  return data.data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post('/auth/forgot-password', { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await apiClient.post('/auth/reset-password', { token, password });
  return data;
}

export async function fetchMe() {
  const { data } = await apiClient.get('/auth/me');
  return data.data.user;
}

export async function updateProfile(payload) {
  const { data } = await apiClient.patch('/auth/me', payload);
  return data.data.user;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await apiClient.patch('/auth/change-password', { currentPassword, newPassword });
  return data;
}
