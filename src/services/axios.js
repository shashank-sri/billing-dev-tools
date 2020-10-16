import axios from 'axios';

const stage = 'staging';
const config = {
    'dev': {
        'baseURL': 'https://ot8h44xql5.execute-api.ap-south-1.amazonaws.com/dev/api/v1/billing',
        'x-api-key': 'efpmEpTNKi9M90m5WxA5G2qoQp1U56XX8KjOI3eR',
    },
    'staging': {
        'baseURL': 'https://idyhokfdsh.execute-api.ap-south-1.amazonaws.com/staging',
        'x-api-key': 'qIY4i9Yb7R9LwcUvTPLo95pIEVrBG7dL5JsYejyP',
    },
}
  
const instance = axios.create({
    baseURL: config[stage].baseURL,
});

instance.defaults.headers.post['x-api-key'] = config[stage]['x-api-key'];
instance.defaults.headers.delete['x-api-key'] = config[stage]['x-api-key'];

export default instance;