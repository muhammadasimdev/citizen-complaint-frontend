import api from './api';

export const aiService = {
  getAiOfficerSummary: async () => {
    const res = await api.post('/api/ai/officer-summary');
    return res.data;
  }
};
