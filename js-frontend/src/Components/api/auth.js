import axios from 'axios';

const auth = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/auth`,
  withCredentials: true,
});

export function getLoggedin() {
  return auth.get('/loggedin');
}

export function login(data) {
  return auth.post('/login', data);
}

export function logout() {
  return auth.get('/logout');
}

export function signup(data) {
  const fd = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key]) fd.append(key, data[key]);
  });
  return auth.post(`/signup/${data.type}`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function verifyOTP(data) {
  return auth.post('/verify-otp', data);
}

export function resendOTP(data) {
  return auth.post('/resend-otp', data);
}
