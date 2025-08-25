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
        'Authorization': `Token ${API_KEY}`
      },
      timeout: REQUEST_TIMEOUT,
      validateStatus: () => true // This ensures we don't throw on HTTP error status
    };

    if (method === 'POST') {
      config.data = data;
    } else if (data) {
      config.params = data;
    }

    console.log('Making request to:', config.url, 'with data:', data);
    const response = await axios(config);
    
    // Log the full response for debugging
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });

    // Handle non-2xx responses
    if (response.status < 200 || response.status >= 300) {
      const errorMessage = response.data?.message || 
                         response.data?.error || 
                         `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    // Extract error message from different possible locations
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unknown error occurred';
    
    throw new Error(errorMessage);
  }
};

// Network mapping to standardize network identifiers
const NETWORK_MAPPING: Record<string, string> = {
  'mtn': 'MTN',
  'glo': 'GLO',
  'airtel': 'AIRTEL',
  '9mobile': '9MOBILE',
  'etisalat': '9MOBILE',
  '9 mobile': '9MOBILE'
};

// Airtime Endpoints
export const purchaseAirtime = async (data: {
  network: string;
  amount: number | string;
  mobile_number: string;
}) => {
  try {
    // Validate and normalize network
    const network = data.network.trim().toLowerCase();
    const networkId = NETWORK_MAPPING[network] || network.toUpperCase();
    
    // Format phone number (ensure it's in the correct format)
    const formattedPhone = data.mobile_number.replace(/\D/g, '');
    if (!formattedPhone) {
      throw new Error('Invalid phone number');
    }
    
    // Ensure amount is a valid number
    const amount = Number(data.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount. Please enter a valid positive number.');
    }

    // Prepare request data according to API requirements
    const requestData = {
      network: networkId,
      amount: amount.toString(),
      mobile_number: formattedPhone.startsWith('0') ? formattedPhone : `0${formattedPhone}`,
      bypass: 'false',
      agentId: '0',
      agentReference: `ref-${Date.now()}`,
      // Additional required fields
      service_type: 'AIRTIME',
      payment_method: 'wallet',
      request_type: 'PURCHASE',
      product_id: `${networkId}_AIRTIME`,
      product_name: `${networkId} Airtime Recharge`,
      customer_reference: `CUST-${Date.now()}`
    };

    console.log('Purchase Airtime Request:', JSON.stringify(requestData, null, 2));
    
    const response = await makeRequest('POST', '/airtime/topup/', requestData);
    
    // Log the response for debugging
    console.log('Airtime Purchase Response:', JSON.stringify(response, null, 2));
    
    // Check for specific error conditions in the response
    if (response.status === 'failed') {
      throw new Error(response.message || 'Airtime purchase failed');
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Airtime Purchase Error:', {
      error: error.message,
      requestData: data,
      response: error.response?.data
    });
    
    // Provide more user-friendly error messages
    if (error.message.includes('Product / Identifier Not Active') || 
        error.message.includes('Invalid')) {
      throw new Error('The selected network or amount is currently unavailable. Please try a different network or amount.');
    }
    
    throw error;
  }
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
