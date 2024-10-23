import axios from 'axios';

const http = axios.create({
  baseURL: 'https://scigroup.com.vn/cp/app-seeding/api',
});

export default http;
