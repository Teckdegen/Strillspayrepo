import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Types
export interface Network {
  id: string;
  name: string;
  code: string;
  status: boolean;
}

export interface DataPlan {
  id: string;
  plan_id: string;
  plan: string;
  amount: string;
  validity: string;
  network: string;
  status: boolean;
}

export interface CableProvider {
  id: string;
  name: string;
  code: string;
  status: boolean;
}

export interface CablePlan {
  id: string;
  plan_id: string;
  plan: string;
  amount: string;
  product_id: string;
  status: boolean;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  code: string;
  status: boolean;
}

// API Configuration
const BASE_URL = 'https://client.peyflex.com.ng/api';
const API_KEY = 'f304ee6fec16077c05ea82ebca89d39b6d575ac8'; // Should be moved to environment variables

// Create axios instance with base config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${API_KEY}`
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`[Peyflex API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('[Peyflex API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[Peyflex API] Response ${response.status} ${response.config.url}`, response.data);
    return response.data;
  },
  (error: AxiosError) => {
    console.error('[Peyflex API] Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common error cases
    if (error.response) {
      // Server responded with error status code
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No response received from server. Please check your internet connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error(`Request error: ${error.message}`));
    }
  }
);

// User Endpoints
export const getUserProfile = async (): Promise<any> => {
  return api.get('/user/profile/');
};

export const getWalletBalance = async (): Promise<{ balance: string }> => {
  return api.get('/wallet/balance/');
};

// Airtime Endpoints
export const getAirtimeNetworks = async (): Promise<Network[]> => {
  return api.get('/airtime/networks/');
};

export interface AirtimePurchasePayload {
  network: string;
  phone: string;
  amount: string | number;
  reference?: string;
}

export const purchaseAirtime = async (data: AirtimePurchasePayload): Promise<any> => {
  return api.post('/airtime/subscribe/', {
    network: data.network.toLowerCase(),
    phone: data.phone.replace(/\D/g, '').replace(/^234/, '0'),
    amount: String(data.amount),
    reference: data.reference || `airtime-${Date.now()}`
  });
};

// Data Endpoints
export const getDataNetworks = async (): Promise<Network[]> => {
  return api.get('/data/networks/');
};

export const getDataPlans = async (network: string): Promise<DataPlan[]> => {
  return api.get(`/data/plans/`, { params: { network } });
};

export interface DataPurchasePayload {
  network: string;
  plan: string;
  phone: string;
  reference?: string;
}

export const purchaseData = async (data: DataPurchasePayload): Promise<any> => {
  return api.post('/data/subscribe/', {
    network: data.network.toLowerCase(),
    plan: data.plan,
    phone: data.phone.replace(/\D/g, '').replace(/^234/, '0'),
    reference: data.reference || `data-${Date.now()}`
  });
};

// Cable TV Endpoints
export const getCableProviders = async (): Promise<CableProvider[]> => {
  return api.get('/cable/providers/');
};

export const getCablePlans = async (provider: string): Promise<CablePlan[]> => {
  return api.get(`/cable/plans/`, { params: { provider } });
};

export interface VerifyCablePayload {
  provider: string;
  iuc: string;
}

export const verifyCableIUC = async (data: VerifyCablePayload): Promise<any> => {
  return api.post('/cable/verify/', {
    provider: data.provider.toLowerCase(),
    iuc: data.iuc
  });
};

export interface CablePurchasePayload {
  provider: string;
  iuc: string;
  plan: string;
  phone: string;
  reference?: string;
}

export const subscribeCable = async (data: CablePurchasePayload): Promise<any> => {
  return api.post('/cable/subscribe/', {
    provider: data.provider.toLowerCase(),
    iuc: data.iuc,
    plan: data.plan,
    phone: data.phone.replace(/\D/g, '').replace(/^234/, '0'),
    reference: data.reference || `cable-${Date.now()}`
  });
};

// Electricity Endpoints
export const getElectricityProviders = async (): Promise<ElectricityProvider[]> => {
  return api.get('/electricity/plans/', { params: { identifier: 'electricity' } });
};

export interface VerifyMeterPayload {
  meter: string;
  plan: string;
  type: 'prepaid' | 'postpaid';
}

export const verifyMeterNumber = async (data: VerifyMeterPayload): Promise<any> => {
  return api.get('/electricity/verify/', {
    params: {
      identifier: 'electricity',
      meter: data.meter,
      plan: data.plan,
      type: data.type
    }
  });
};

export interface ElectricityPurchasePayload {
  meter: string;
  plan: string;
  amount: string | number;
  type: 'prepaid' | 'postpaid';
  phone: string;
  reference?: string;
}

export const rechargeElectricity = async (data: ElectricityPurchasePayload): Promise<any> => {
  return api.post('/electricity/subscribe/', {
    identifier: 'electricity',
    meter: data.meter,
    plan: data.plan,
    amount: String(data.amount),
    type: data.type,
    phone: data.phone.replace(/\D/g, '').replace(/^234/, '0'),
    reference: data.reference || `electricity-${Date.now()}`
  });
};

// Export all functions
export default {
  // User
  getUserProfile,
  getWalletBalance,
  
  // Airtime
  getAirtimeNetworks,
  purchaseAirtime,
  
  // Data
  getDataNetworks,
  getDataPlans,
  purchaseData,
  
  // Cable TV
  getCableProviders,
  getCablePlans,
  verifyCableIUC,
  subscribeCable,
  
  // Electricity
  getElectricityProviders,
  verifyMeterNumber,
  rechargeElectricity
};
