import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://client.peyflex.com.ng';
const API_KEY = 'f304ee6fec16077c05ea82ebca89d39b6d575ac8';

// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface PeyflexResponse<T = any> {
  status: 'success' | 'failed';
  message: string;
  data?: T;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Token ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor for retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as any;
    
    // If we don't have a config or retry count is exceeded, reject
    if (!config || !config.retryCount) {
      return Promise.reject(error);
    }

    // Retry only on network errors or 5xx responses
    if (
      error.code === 'ECONNABORTED' || 
      !error.response || 
      (error.response.status >= 500 && error.response.status < 600)
    ) {
      config.retryCount -= 1;
      
      // Delay before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

const makeRequest = async <T>(config: AxiosRequestConfig, retries = MAX_RETRIES): Promise<T> => {
  try {
    const response = await api({
      ...config,
      retryCount: retries,
    });
    
    // Check if the response indicates success
    if (response.data && response.data.status === 'failed') {
      throw new Error(response.data.message || 'Transaction failed');
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`API Error: ${message}`);
    }
    throw error;
  }
};

// User endpoints
export const getUserProfile = () => {
  return makeRequest({ method: 'GET', url: '/api/user/profile/' });
};

export const getWalletBalance = () => {
  return makeRequest({ method: 'GET', url: '/api/wallet/balance/' });
};

// Airtime endpoints
export const getAirtimeNetworks = () => {
  return makeRequest({ method: 'GET', url: '/api/airtime/networks/' });
};

export const purchaseAirtime = async (data: {
  network: string;
  phone: string;
  amount: string;
  reference: string; // Add transaction reference for tracking
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/airtime/subscribe/',
    data: {
      ...data,
      reference: data.reference,
    },
  });
};

// Data endpoints
export const getDataNetworks = () => {
  return makeRequest({ method: 'GET', url: '/api/data/networks/' });
};

export const getDataPlans = (network: string) => {
  return makeRequest({
    method: 'GET',
    url: `/api/data/plans/?network=${network}`,
  });
};

export const purchaseData = async (data: {
  network: string;
  plan: string;
  phone: string;
  reference: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/data/subscribe/',
    data: {
      ...data,
      reference: data.reference,
    },
  });
};

// Cable TV endpoints
export const getCableProviders = () => {
  return makeRequest({ method: 'GET', url: '/api/cable/providers/' });
};

export const getCablePlans = (provider: string) => {
  return makeRequest({
    method: 'GET',
    url: `/api/cable/plans/?provider=${provider}`,
  });
};

export const verifyCableIUC = async (data: {
  provider: string;
  iuc: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/cable/verify/',
    data,
  });
};

export const purchaseCable = async (data: {
  provider: string;
  iuc: string;
  plan: string;
  phone: string;
  reference: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/cable/subscribe/',
    data: {
      ...data,
      reference: data.reference,
    },
  });
};

// Electricity endpoints
export const getElectricityPlans = () => {
  return makeRequest({
    method: 'GET',
    url: '/api/electricity/plans/?identifier=electricity',
  });
};

export const verifyElectricityMeter = async (data: {
  meter: string;
  plan: string;
  type: string;
}) => {
  return makeRequest({
    method: 'GET',
    url: `/api/electricity/verify/?identifier=electricity&meter=${data.meter}&plan=${data.plan}&type=${data.type}`,
  });
};

export const purchaseElectricity = async (data: {
  meter: string;
  plan: string;
  amount: string;
  type: string;
  phone: string;
  reference: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/electricity/subscribe/',
    data: {
      identifier: 'electricity',
      ...data,
      reference: data.reference,
    },
  });
};

// Transaction status check
export const checkTransactionStatus = async (reference: string) => {
  return makeRequest({
    method: 'GET',
    url: `/api/transaction/status/${reference}/`,
  });
};

// Process transaction after on-chain confirmation
export const processTransaction = async (
  type: 'airtime' | 'data' | 'cable' | 'electricity',
  data: any,
  reference: string
) => {
  try {
    // Add reference to transaction data
    const transactionData = { ...data, reference };
    
    // Process based on transaction type
    switch (type) {
      case 'airtime':
        return await purchaseAirtime(transactionData);
      case 'data':
        return await purchaseData(transactionData);
      case 'cable':
        return await purchaseCable(transactionData);
      case 'electricity':
        return await purchaseElectricity(transactionData);
      default:
        throw new Error('Invalid transaction type');
    }
  } catch (error) {
    console.error('Transaction processing failed:', error);
    throw error;
  }
};
