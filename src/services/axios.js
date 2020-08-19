import axios from 'axios';
  
const instance = axios.create({
  // baseURL: 'http://localhost:3001',
  baseURL: 'https://ot8h44xql5.execute-api.ap-south-1.amazonaws.com/dev/api/v1/billing',
});
// instance.defaults.headers.get['x-api-key'] = 'efpmEpTNKi9M90m5WxA5G2qoQp1U56XX8KjOI3eR';
instance.defaults.headers.post['x-api-key'] = 'efpmEpTNKi9M90m5WxA5G2qoQp1U56XX8KjOI3eR';

export default instance;