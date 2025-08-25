import axios from 'axios';

const BASE_URL = 'https://client.peyflex.com.ng';
const API_KEY = 'f304ee6fec16077c05ea82ebca89d39b6d575ac8';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Token ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// User endpoints
export const getUserProfile = async () => {
  const response = await api.get('/api/user/profile/');
  return response.data;
};

export const getWalletBalance = async () => {
  const response = await api.get('/api/wallet/balance/');
  return response.data;
};

// Airtime endpoints
export const getAirtimeNetworks = async () => {
  const response = await api.get('/api/airtime/networks/');
  return response.data;
};

export const purchaseAirtime = async (data: {
  network: string;
  phone: string;
  amount: string;
}) => {
  const response = await api.post('/api/airtime/subscribe/', data);
  return response.data;
};

// Data endpoints
export const getDataNetworks = async () => {
  const response = await api.get('/api/data/networks/');
  return response.data;
};

export const getDataPlans = async (network: string) => {
  const response = await api.get(`/api/data/plans/?network=${network}`);
  return response.data;
};

export const purchaseData = async (data: {
  network: string;
  plan: string;
  phone: string;
}) => {
  const response = await api.post('/api/data/subscribe/', data);
  return response.data;
};

// Cable TV endpoints
export const getCableProviders = async () => {
  const response = await api.get('/api/cable/providers/');
  return response.data;
};

export const getCablePlans = async (provider: string) => {
  const response = await api.get(`/api/cable/plans/?provider=${provider}`);
  return response.data;
};

export const verifyCableIUC = async (data: {
  provider: string;
  iuc: string;
}) => {
  const response = await api.post('/api/cable/verify/', data);
  return response.data;
};

export const purchaseCable = async (data: {
  provider: string;
  iuc: string;
  plan: string;
  phone: string;
}) => {
  const response = await api.post('/api/cable/subscribe/', data);
  return response.data;
};

// Electricity endpoints
export const getElectricityPlans = async () => {
  const response = await axios.get(`${BASE_URL}/api/electricity/plans/?identifier=electricity`);
  return response.data;
};

export const verifyElectricityMeter = async (data: {
  meter: string;
  plan: string;
  type: string;
}) => {
  const response = await axios.get(
    `${BASE_URL}/api/electricity/verify/?identifier=electricity&meter=${data.meter}&plan=${data.plan}&type=${data.type}`
  );
  return response.data;
};

export const purchaseElectricity = async (data: {
  meter: string;
  plan: string;
  amount: string;
  type: string;
  phone: string;
}) => {
  const response = await api.post('/api/electricity/subscribe/', {
    identifier: 'electricity',
    meter: data.meter,
    plan: data.plan,
    amount: data.amount,
    type: data.type,
    phone: data.phone,
  });
  return response.data;
};