import axios from 'axios';

const api = axios.create({
  baseURL:
    'https://6a391a3564a2d82692237226.mockapi.io/api/v1',
});

export default api;