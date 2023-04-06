import axios from 'axios';
import { objToFormData } from '../utils';

const seller = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/sellers`,
  withCredentials: true,
});

// update files of logged in seller
export function updateSellerFiles(data) {
  const fd = objToFormData(data);
  return seller.put('/files', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
// update details other than files of a seller
export function updateSeller(data) {
  return seller.put('/', data);
}

// get seller bids
export function getBids() {
  return seller.get('/bids');
}

export function addBid(formData) {
  return seller.post('/bids', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// jobs publically accessible to sellers
export function getJobs() {
  return seller.get('/jobs');
}

export function getJobById(jobId) {
  return seller.get(`/jobs/${jobId}`);
}

export function toggleSubscribe(technology) {
  return seller.put(`/toggle-subscribe/${technology}`);
}

export function getNotificationsCount() {
  return seller.get('/notifications/total-count');
}

export function getNotifications(offset = 0) {
  return seller.get(`/notifications?offset=${offset}`);
}

export function readNotification(id) {
  return seller.put(`/notifications/${id}/read`);
}

export function deleteNotification(id) {
  return seller.delete(`/notifications/${id}`);
}

export function createStripeId() {
  return seller.put('/create-stripe-account');
}

export function getStripeLoginLink() {
  return seller.get('/stripe-login-link');
}
