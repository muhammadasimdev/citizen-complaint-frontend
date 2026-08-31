import api from './api';
import { appConfig } from '../config/appConfig';

// Mock database fallback for offline prototyping
let mockStorage = [
  { _id: '1', name: 'Alpha Initiative', category: 'Project', status: 'Active', value: '$12,400', date: '2026-08-20' },
  { _id: '2', name: 'Beta Inventory Sync', category: 'Integration', status: 'Completed', value: '$4,800', date: '2026-08-22' },
  { _id: '3', name: 'Gamma System Audit', category: 'Security', status: 'Pending', value: '$8,900', date: '2026-08-25' },
  { _id: '4', name: 'Delta API Gateway', category: 'Infrastructure', status: 'Active', value: '$19,500', date: '2026-08-28' },
];

export const crudService = {
  async getItems() {
    if (appConfig.api.useMockFallback) {
      return { success: true, data: [...mockStorage] };
    }
    try {
      const response = await api.get(appConfig.api.endpoints.crudResource);
      return response.data;
    } catch (err) {
      console.warn("API Endpoint unreachable. Falling back to Mock Storage mode.");
      return { success: true, data: [...mockStorage] };
    }
  },

  async createItem(item) {
    if (appConfig.api.useMockFallback) {
      const newItem = { _id: Date.now().toString(), ...item, date: new Date().toISOString().split('T')[0] };
      mockStorage.unshift(newItem);
      return { success: true, data: newItem };
    }
    try {
      const response = await api.post(appConfig.api.endpoints.crudResource, item);
      return response.data;
    } catch (err) {
      const newItem = { _id: Date.now().toString(), ...item, date: new Date().toISOString().split('T')[0] };
      mockStorage.unshift(newItem);
      return { success: true, data: newItem };
    }
  },

  async updateItem(id, item) {
    if (appConfig.api.useMockFallback) {
      mockStorage = mockStorage.map(i => i._id === id ? { ...i, ...item } : i);
      return { success: true };
    }
    try {
      const response = await api.put(`${appConfig.api.endpoints.crudResource}/${id}`, item);
      return response.data;
    } catch (err) {
      mockStorage = mockStorage.map(i => i._id === id ? { ...i, ...item } : i);
      return { success: true };
    }
  },

  async deleteItem(id) {
    if (appConfig.api.useMockFallback) {
      mockStorage = mockStorage.filter(i => i._id !== id);
      return { success: true };
    }
    try {
      const response = await api.delete(`${appConfig.api.endpoints.crudResource}/${id}`);
      return response.data;
    } catch (err) {
      mockStorage = mockStorage.filter(i => i._id !== id);
      return { success: true };
    }
  }
};