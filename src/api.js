import axios from 'axios';

const API = axios.create({
  baseURL: 'https://zenfit-server.onrender.com/api',
});

export default API;
