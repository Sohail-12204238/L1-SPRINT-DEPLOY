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
  getTeamByStartup: (startupId) => api.get(`/teams/startup/${startupId}`),
  getMyTeams: () => api.get('/teams/my'),
};

// ─── ADMIN ───────────────────────────────────────────────────────────────────
// Note: Backend does not yet have admin-specific endpoints.
// These are placeholder calls that can be wired once backend admin APIs are added.
export const adminAPI = {
  // Stats (would come from an admin-stats endpoint)
  getStats: () => Promise.resolve({
    data: {
      totalUsers: 1620,
      activeStartups: 218,
      investmentsToday: '₹28L',
      messagesSent: 1847,
    }
  }),
  // Startup approval — maps to startup service update once admin endpoint is added
  approveStartup: (id) => api.put(`/startups/${id}/approve`),
  rejectStartup: (id) => api.put(`/startups/${id}/reject`),
  // User management
  getAllUsers: () => api.get('/users'),
  // All startups (for admin review)
  getPendingStartups: () => startupAPI.getAll(),
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
