import axios from 'axios';

const stage = 'staging';
const config = {
    'dev': {
        'baseURL': 'https://ot8h44xql5.execute-api.ap-south-1.amazonaws.com/dev/api/v1/billing',
        'x-api-key': 'efpmEpTNKi9M90m5WxA5G2qoQp1U56XX8KjOI3eR',
    },
    'staging': {
        'baseURL': 'https://t4pyh84te6.execute-api.ap-south-1.amazonaws.com/staging/api/v1/billing',
        'x-api-key': 'wlC2cStpGg4WToPiFZKTV4it2AEEIQF1cwmQQcOc',
    },
}
  
const instance = axios.create({
    baseURL: config[stage].baseURL,
});

instance.defaults.headers.post['x-api-key'] = config[stage]['x-api-key'];

export default instance;