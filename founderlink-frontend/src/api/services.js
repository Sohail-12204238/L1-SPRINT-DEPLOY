import api from '../api/axiosConfig';

// ─── AUTH ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ─── USER ────────────────────────────────────────────────────────────────────
export const userAPI = {
  createProfile: (data) => api.post('/users', data),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  viewProfile: (id) => api.get(`/users/${id}`),
  getInvestors: () => api.get('/users/investors'),
  getCofounders: () => api.get('/users/cofounders'),
  getByEmail: (email) => api.get(`/users/email/${email}`),
};

// ─── STARTUP ─────────────────────────────────────────────────────────────────
export const startupAPI = {
  create: (data) => api.post('/startups', data),
  getById: (id) => api.get(`/startups/${id}`),
  getAll: () => api.get('/startups/all'),
  update: (id, data) => api.put(`/startups/${id}`, data),
  delete: (id) => api.delete(`/startups/${id}`),
  getMyStartups: () => api.get('/startups/my'),
};

// ─── INVESTMENT ──────────────────────────────────────────────────────────────
export const investmentAPI = {
  create: (data) => api.post('/investments', data),
  getMyInvestments: () => api.get('/investments/my'),
  getByStartup: (startupId) => api.get(`/investments/startup/${startupId}`),
  approve: (id) => api.put(`/investments/${id}/approve`),
  reject: (id) => api.put(`/investments/${id}/reject`),
  // Investor Requests (Founder → Investor)
  sendRequest: (data) => api.post('/investments/investment-requests', data),
  getMyRequests: () => api.get('/investments/investment-requests'),
  respondRequest: (id, accept) =>
    api.put(`/investments/investment-requests/respond/${id}?accept=${accept}`),
};

// ─── TEAM ────────────────────────────────────────────────────────────────────
export const teamAPI = {
  invite: (data) => api.post('/teams/invite', data),
  join: (data) => api.post('/teams/join', data),
  requestJoin: (data) => api.post('/teams/request-join', data),
  respond: (id, accept) => api.put(`/teams/respond/${id}?accept=${accept}`),
  getTeamByStartup: (startupId) => api.get(`/teams/startup/${startupId}`),
  getMyTeams: () => api.get('/teams/my'),
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  // All users (admin only — GET /users/all)
  getAllUsers: () => api.get('/users/all'),
  // Delete a user by ID (admin only — DELETE /users/{id})
  deleteUser: (id) => api.delete(`/users/${id}`),
  // All startups (admin review)
  getAllStartups: () => api.get('/startups/all'),
  // Delete any startup (admin override)
  deleteStartup: (id) => api.delete(`/startups/${id}`),
  // Approve / reject startup
  approveStartup: (id) => api.put(`/startups/${id}/approve`),
  rejectStartup:  (id) => api.put(`/startups/${id}/reject`),
};
// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/read/${id}`),
};

// ─── MILESTONE ────────────────────────────────────────────────────────────────
export const milestoneAPI = {
  getByStartup: (startupId) => api.get(`/milestones/startup/${startupId}`),
  create: (data) => api.post('/milestones', data),
  updateStatus: (id, status) => api.put(`/milestones/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/milestones/${id}`),
};
