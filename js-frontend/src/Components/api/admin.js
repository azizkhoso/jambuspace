import axios from 'axios';

const admin = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/admin`,
  withCredentials: true,
});

export function getTotalSellersCount() {
  return admin.get('/sellers/total-count');
}

export function getSellers(offset = 0) {
  return admin.get(`/sellers?offset=${offset}`);
}

export function getSeller(id) {
  return admin.get(`/sellers/${id}`);
}

export function toggleEnableSeller(id) {
  return admin.put(`/sellers/${id}/toggle-enabled`);
}

export function deleteSeller(id) {
  return admin.delete(`/sellers/${id}`);
}

export function getTotalCustomersCount() {
  return admin.get('/customers/total-count');
}

export function getCustomers(offset = 0) {
  return admin.get(`/customers?offset=${offset}`);
}

export function getCustomer(id) {
  return admin.get(`/customers/${id}`);
}

export function deleteCustomerJob({ customerId, jobId }) {
  return admin.delete(`/customers/${customerId}/jobs/${jobId}`);
}

export function toggleEnableCustomer(id) {
  return admin.put(`/customers/${id}/toggle-enabled`);
}

export function deleteCustomer(id) {
  return admin.get(`/customers/${id}`);
}

export function updateCompanyMargin(values) {
  return admin.put(`/company-margin/`, values);
}

export function getJobs() {
  return admin.get('/jobs');
}

export function deleteJob(id) {
  return admin.delete(`/jobs/${id}`);
}

export function updateAdminProfile(values) {
  return admin.put(`/update-profile`, values);
}

export function addTechnology(data) {
  return admin.post('/technologies', data);
}

export function updateTechnoloy(id, data) {
  return admin.put(`/technologies/${id}`, data);
}

export function deleteTechnology(id) {
  return admin.delete(`/technologies/${id}`);
}

export function getTechnologies() {
  return admin.get('/technologies');
}
