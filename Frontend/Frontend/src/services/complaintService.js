import api from './api';

export const complaintService = {
  createComplaint: async (data) => {
    const res = await api.post('/api/complaints', data);
    return res.data;
  },
  getMyComplaints: async () => {
    const res = await api.get('/api/complaints/mine');
    return res.data;
  },
  getPublicComplaints: async (params = {}) => {
    const res = await api.get('/api/complaints', { params });
    return res.data;
  },
  checkDuplicates: async (category, area) => {
    const res = await api.get('/api/complaints', {
      params: { category, area, status: 'pending' }
    });
    return res.data;
  },
  upvoteComplaint: async (id) => {
    const res = await api.patch(`/api/complaints/${id}/upvote`);
    return res.data;
  },
  updateComplaintStatus: async (id, status, remark) => {
    const res = await api.patch(`/api/complaints/${id}/status`, { status, remark });
    return res.data;
  },
  submitFeedback: async (id, feedbackData) => {
    const res = await api.patch(`/api/complaints/${id}/feedback`, feedbackData);
    return res.data;
  },
  exportCsv: async (params = {}) => {
    const res = await api.get('/api/complaints/export', {
      params,
      responseType: 'blob',
    });
    return res;
  }
};
