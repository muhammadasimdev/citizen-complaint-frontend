import API from './axios';

// Auth Services
export const loginUser = (formData) => API.post('/auth/login', formData);
export const signupUser = (formData) => API.post('/auth/signup', formData);

// Complaint Services
export const fetchComplaints = () => API.get('/complaints');
export const createComplaint = (complaintData) => API.post('/complaints', complaintData);
export const upvoteComplaint = (id) => API.patch(`/complaints/${id}/upvote`);
export const updateComplaintStatus = (id, statusData) => API.patch(`/complaints/${id}/status`, statusData);

// CSV Download Service
export const downloadComplaintsCSV = async () => {
  const response = await API.get('/complaints/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'complaints_report.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
};