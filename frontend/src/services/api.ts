import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';



// Define interface for our extended API

// Define interface for our extended API
import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';


interface JanSetuApi extends AxiosInstance {
  getNearbyHospitals: (lat: number, lng: number) => Promise<any>;
  getNearbyMedicalStores: (lat: number, lng: number) => Promise<any>;
  getNearbyPoliceStations: (lat: number, lng: number) => Promise<any>;
  requestAmbulanceEmergency: (payload: { address: string; lat?: number; lng?: number; landmark?: string }) => Promise<any>;
  searchMedicines: (query: string) => Promise<any>;

}


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as unknown as JanSetuApi; // Cast to our interface


// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);


// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);



// Healthcare Services
api.getNearbyHospitals = (lat: number, lng: number) => {
  return api.get(`/api/healthcare/hospitals/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};

api.getNearbyMedicalStores = (lat: number, lng: number) => {
  return api.get(`/api/healthcare/medical-stores/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};

api.getNearbyPoliceStations = (lat: number, lng: number) => {
  return api.get(`/api/emergency/police-stations/nearby?lat=${lat}&lng=${lng}`).then((res: AxiosResponse) => res.data);
};


api.requestAmbulanceEmergency = (payload: { address: string; lat?: number; lng?: number; landmark?: string }) => {
  return api.post('/api/healthcare/ambulance/emergency', payload).then((res: AxiosResponse) => res.data);
};

api.searchMedicines = (query: string) => {
  return api.get(`/api/healthcare/medicines/search?q=${encodeURIComponent(query)}`).then((res: AxiosResponse) => res.data);
};


export default api;

