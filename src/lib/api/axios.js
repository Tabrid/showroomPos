
import axios from 'axios';
import baseUrl from '../../Components/services/baseUrl';

const instance = axios.create({
  baseURL: `${baseUrl}/api`, 
});

export default instance;
