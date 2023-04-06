import axios from 'axios';
import { objToFormData } from '../utils';

const client = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/customers`,
  withCredentials: true,
});

// update files of logged in client
export function updateCustomerFiles(data) {
  const fd = objToFormData(data);
  return client.put('/files', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// update details other than files of a client
export function updateCustomer(data) {
  return client.put('/', data);
}

export function getCustomerJobs() {
  return client.get('/jobs');
}

export function getJob(id) {
  return client.get(`/jobs/${id}`);
}

export function createJob(data) {
  const fd = objToFormData(data);
  return client.post('/jobs', fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteJob(id) {
  return client.delete(`/jobs/${id}`);
}

export function getNotificationsCount() {
  return client.get('/notifications/total-count');
}

export function getNotifications(offset = 0) {
  return client.get(`/notifications?offset=${offset}`);
}

export function readNotification(id) {
  return client.put(`/notifications/${id}/read`);
}

export function deleteNotification(id) {
  return client.delete(`/notifications/${id}`);
}

export function getStripeCheckout(jobId, bidId) {
  return client.get(`/jobs/${jobId}/checkout?bid=${bidId}`);
}

export function getPaymentIntent(jobId, bidId) {
  return client.get(`/jobs/${jobId}/payment-intent?bid=${bidId}`);
}

export function confirmPayment(paymentIntent) {
  return client.post(`/jobs/confirm-payment`, paymentIntent);
}

export function completeJob(id) {
  return client.put(`/jobs/${id}/complete`);
}
export function addSkill(data) {
  return client.post('/auth/seller/skills/add', data);
}
export function addResume(data) {
  return client.post('/auth/seller/resume/add', data);
}
export function UpdateProfilePicture(userid, data) {
  return client.put(`/auth/picture/${userid}`, data);
}
export function updateAttr(userid, data) {
  return client.put(`/auth/${userid}`, data);
}
export function getJobs(userid) {
  return client.get(`/auth/${userid}`);
}
export function getReviews(userid) {
  return client.get(`/auth/${userid}/reviews`);
}
