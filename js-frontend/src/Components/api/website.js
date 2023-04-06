// these functions are for accessing routes not related to any specific resource

import axios from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

export function getTechnologies() {
  return instance.get('/technologies');
}
