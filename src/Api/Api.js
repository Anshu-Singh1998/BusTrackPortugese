import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://api.carrismetropolitana.pt',
  headers: {
    ContentType: 'application/json',
  },
});

export default Api;
