import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = 'https://client.peyflex.com.ng/api';
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

// Generic request handler
const makeRequest = async <T>(
  method: 'GET' | 'POST',
  endpoint: string,
  data?: any,
  requireAuth: boolean = true
): Promise<PeyflexResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(requireAuth && { 'Authorization': `Token ${API_KEY}` })
      },
      timeout: REQUEST_TIMEOUT
    };

    if (method === 'POST') {
      config.data = data;
    } else if (data) {
      // For GET requests, add params
      config.params = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Airtime Endpoints
export const purchaseAirtime = async (data: {
  network: string;
  amount: number | string;
  mobile_number: string;
}) => {
  return makeRequest('POST', '/airtime/topup/', {
    network: data.network.toLowerCase(),
    amount: data.amount,
    mobile_number: data.mobile_number
  });
};

// Data Endpoints
export const purchaseData = async (data: {
  network: string;
  plan: string;
  mobile_number: string;
}) => {
  return makeRequest('POST', '/data/subscribe/', {
    network: data.network.toLowerCase(),
    plan: data.plan,
    mobile_number: data.mobile_number
  });
};

// Cable TV Endpoints
export const subscribeCable = async (data: {
  provider: string;
  iuc: string;
  plan: string;
  mobile_number: string;
}) => {
  // First verify IUC
  await makeRequest('POST', '/cable/verify/', {
    provider: data.provider.toLowerCase(),
    iuc: data.iuc
  });
  
  // Then subscribe
  return makeRequest('POST', '/cable/subscribe/', {
    provider: data.provider.toLowerCase(),
    iuc: data.iuc,
    plan: data.plan,
    mobile_number: data.mobile_number
  });
};

// Electricity Endpoints
export const rechargeElectricity = async (data: {
  meter: string;
  plan: string;
  amount: string | number;
  type: 'prepaid' | 'postpaid';
  mobile_number: string;
}) => {
  // First verify meter
  await makeRequest('POST', '/electricity/verify/', {
    meter: data.meter,
    plan: data.plan,
    type: data.type
  });
  
  // Then recharge
  return makeRequest('POST', '/electricity/recharge/', {
    meter: data.meter,
    plan: data.plan,
    amount: data.amount,
    type: data.type,
    mobile_number: data.mobile_number
  });
};

// Get available services
export const getServices = async (type: 'airtime' | 'data' | 'cable' | 'electricity') => {
  switch (type) {
    case 'airtime':
      return makeRequest('GET', '/airtime/networks/');
    case 'data':
      return makeRequest('GET', '/data/networks/');
    case 'cable':
      return makeRequest('GET', '/cable/providers/');
    case 'electricity':
      return makeRequest('GET', '/electricity/plans/');
    default:
      throw new Error('Unsupported service type');
  }
};

// Get plans for a specific service
export const getPlans = async (type: 'data' | 'cable', id: string) => {
  switch (type) {
    case 'data':
      return makeRequest('GET', '/data/plans/', { network: id.toLowerCase() });
    case 'cable':
      return makeRequest('GET', '/cable/plans/', { provider: id.toLowerCase() });
    default:
      throw new Error('Unsupported plan type');
  }
};
