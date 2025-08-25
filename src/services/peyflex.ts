import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = 'https://client.peyflex.com.ng';
const API_KEY = 'f304ee6fec16077c05ea82ebca89d39b6d575ac8';

// Configuration
const REQUEST_TIMEOUT = 30000; // 30 seconds

interface PeyflexResponse<T = any> {
  status: 'success' | 'failed' | 'pending';
  message: string;
  data?: T;
  code?: string;
  reference?: string;
}

export interface TransactionResponse {
  status: 'success' | 'failed' | 'pending';
  message: string;
  data?: any;
  code?: string;
  reference: string;
  timestamp: string;
  serviceType?: string;
  amount?: number | string;
  recipient?: string;
}

// Helper function to format success response
const formatSuccessResponse = (
  data: any,
  reference: string,
  serviceType: string,
  customMessage?: string
): TransactionResponse => ({
  status: 'success',
  message: customMessage || 'Transaction processed successfully',
  data,
  reference,
  timestamp: new Date().toISOString(),
  serviceType,
  ...(data.amount && { amount: data.amount }),
  ...(data.recipient && { recipient: data.recipient })
});

// Helper function to format error response
const formatErrorResponse = (
  error: any,
  reference: string,
  serviceType: string,
  customMessage?: string
): TransactionResponse => {
  const errorMessage = error?.response?.data?.message || 
                      error?.message || 
                      customMessage || 
                      'An unexpected error occurred';
  
  return {
    status: 'failed',
    message: errorMessage,
    code: error?.response?.data?.code || 'UNKNOWN_ERROR',
    reference,
    timestamp: new Date().toISOString(),
    serviceType,
    data: error?.response?.data || { error: errorMessage }
  };
};

// Generic request handler
const makeRequest = async <T>(
  config: AxiosRequestConfig,
  requireAuth: boolean = true
): Promise<PeyflexResponse<T>> => {
  try {
    // Add headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add auth header if required
    if (requireAuth) {
      headers['Authorization'] = `Token ${API_KEY}`;
    }

    const response = await axios({
      ...config,
      headers: {
        ...headers,
        ...config.headers
      },
      timeout: REQUEST_TIMEOUT,
      baseURL: BASE_URL
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      return {
        status: 'failed',
        message: error.response.data?.message || 'Request failed',
        code: error.response.data?.code || 'REQUEST_ERROR',
        data: error.response.data
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 'failed',
        message: 'No response received from server',
        code: 'NO_RESPONSE'
      };
    } else {
      // Something happened in setting up the request
      return {
        status: 'failed',
        message: error.message || 'Request setup failed',
        code: 'REQUEST_SETUP_ERROR'
      };
    }
  }
};

// User Endpoints
export const getUserProfile = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/user/profile/'
  });
};

export const getWalletBalance = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/wallet/balance/'
  });
};

// Airtime Endpoints
export const getAirtimeNetworks = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/airtime/networks/'
  });
};

export const purchaseAirtime = async (data: {
  network: string;
  phone: string;
  amount: string | number;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/airtime/subscribe/',
    data: {
      network: data.network.toLowerCase(),
      phone: data.phone,
      amount: data.amount.toString()
    }
  });
};

// Data Endpoints
export const getDataNetworks = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/data/networks/'
  });
};

export const getDataPlans = async (network: string) => {
  return makeRequest({
    method: 'GET',
    url: `/api/data/plans/?network=${network}`
  });
};

export const purchaseData = async (data: {
  network: string;
  plan: string;
  phone: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/data/subscribe/',
    data: {
      network: data.network.toLowerCase(),
      plan: data.plan,
      phone: data.phone
    }
  });
};

// Cable TV Endpoints
export const getCableProviders = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/cable/providers/'
  });
};

export const getCablePlans = async (provider: string) => {
  return makeRequest({
    method: 'GET',
    url: `/api/cable/plans/?provider=${provider}`
  });
};

export const verifyCableIUC = async (provider: string, iuc: string) => {
  return makeRequest({
    method: 'POST',
    url: '/api/cable/verify/',
    data: {
      provider: provider.toLowerCase(),
      iuc
    }
  });
};

export const subscribeCable = async (data: {
  provider: string;
  iuc: string;
  plan: string;
  phone: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/cable/subscribe/',
    data: {
      provider: data.provider.toLowerCase(),
      iuc: data.iuc,
      plan: data.plan,
      phone: data.phone
    }
  });
};

// Electricity Endpoints
export const getElectricityPlans = async () => {
  return makeRequest({
    method: 'GET',
    url: '/api/electricity/plans/?identifier=electricity',
    requireAuth: false
  });
};

export const verifyMeterNumber = async (params: {
  meter: string;
  plan: string;
  type: 'prepaid' | 'postpaid';
}) => {
  return makeRequest({
    method: 'GET',
    url: `/api/electricity/verify/?identifier=electricity&meter=${params.meter}&plan=${params.plan}&type=${params.type}`,
    requireAuth: false
  });
};

export const rechargeElectricity = async (data: {
  meter: string;
  plan: string;
  amount: string | number;
  type: 'prepaid' | 'postpaid';
  phone: string;
}) => {
  return makeRequest({
    method: 'POST',
    url: '/api/electricity/subscribe/',
    data: {
      identifier: 'electricity',
      meter: data.meter,
      plan: data.plan,
      amount: data.amount.toString(),
      type: data.type,
      phone: data.phone
    }
  });
};
