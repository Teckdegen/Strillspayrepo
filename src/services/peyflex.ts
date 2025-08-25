import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const BASE_URL = 'https://client.peyflex.com.ng';
const API_KEY = 'f304ee6fec16077c05ea82ebca89d39b6d575ac8';

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RATE_LIMIT_DELAY = 500; // ms between requests
const REQUEST_TIMEOUT = 30000; // 30 seconds

// In-memory store for rate limiting and deduplication
const requestQueue: Array<() => void> = [];
let isProcessing = false;
const processedTransactions = new Set<string>();

interface PeyflexResponse<T = any> {
  status: 'success' | 'failed' | 'pending';
  message: string;
  data?: T;
  code?: string;
  reference?: string;
}

// Input validation schemas
const validNetworks = new Set(['mtn', 'airtel', 'glo', '9mobile']);
const validServiceTypes = new Set(['airtime', 'data', 'cable', 'electricity']);

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
  return phoneRegex.test(phone);
};

const validateAmount = (amount: string | number): boolean => {
  const amountNum = Number(amount);
  return !isNaN(amountNum) && amountNum > 0;
};

const validateReference = (ref: string): boolean => {
  return typeof ref === 'string' && ref.length > 0;
};

// Rate limiting queue processor
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const nextRequest = requestQueue.shift();
  
  if (nextRequest) {
    try {
      await nextRequest();
    } finally {
      // Add delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      isProcessing = false;
      processQueue();
    }
  }
};

// Enhanced axios instance with interceptors
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Token ${API_KEY}`,
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(),
  },
  timeout: REQUEST_TIMEOUT,
});

// Request interceptor for logging and retry logic
api.interceptors.request.use(
  (config) => {
    console.log(`[${new Date().toISOString()}] Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and retries
api.interceptors.response.use(
  (response) => {
    console.log(`[${new Date().toISOString()}] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as any;
    
    // Log the error
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`[${new Date().toISOString()}] API Error:`, {
      url: config?.url,
      status: error.response?.status,
      message: errorMessage,
      retryCount: config?.retryCount || 0
    });

    // If we don't have a config or retry count is exceeded, reject
    if (!config || config.retryCount >= MAX_RETRIES) {
      return Promise.reject(new Error(`Max retries exceeded: ${errorMessage}`));
    }

    // Retry on network errors, 5xx, or rate limiting (429)
    if (
      error.code === 'ECONNABORTED' || 
      !error.response || 
      error.response.status >= 500 ||
      error.response.status === 429
    ) {
      config.retryCount = (config.retryCount || 0) + 1;
      const delay = error.response?.status === 429 
        ? Math.pow(2, config.retryCount) * 1000 // Exponential backoff for rate limits
        : RETRY_DELAY;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

// Enhanced response interface
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
  message: customMessage || 'Transaction completed successfully',
  data,
  reference,
  timestamp: new Date().toISOString(),
  serviceType,
  amount: data.amount,
  recipient: data.phone || data.iuc || data.meter
});

// Helper function to format error response
const formatErrorResponse = (
  error: any, 
  reference: string, 
  serviceType: string,
  customMessage?: string
): TransactionResponse => {
  const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
  
  return {
    status: 'failed',
    message: customMessage || `Transaction failed: ${errorMessage}`,
    code: error.response?.data?.code || error.code || 'UNKNOWN_ERROR',
    reference,
    timestamp: new Date().toISOString(),
    serviceType,
    data: error.response?.data || {}
  };
};

// Generic request handler with queue management
const makeRequest = async <T>(
  config: AxiosRequestConfig,
  options: { requireReference?: boolean } = {}
): Promise<PeyflexResponse<T>> => {
  const { requireReference = true } = options;
  
  if (requireReference && !validateReference(config.data?.reference)) {
    throw new Error('Transaction reference is required');
  }

  if (requireReference && processedTransactions.has(config.data?.reference)) {
    throw new Error('This transaction has already been processed');
  }

  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      try {
        const response = await api({
          ...config,
          retryCount: 0,
        });

        if (requireReference && response.data?.reference) {
          processedTransactions.add(response.data.reference);
        }

        resolve({
          ...response.data,
          status: response.data.status || 'success',
          message: response.data.message || 'Request completed',
          reference: response.data.reference || config.data?.reference,
        });
      } catch (error) {
        reject(error);
      }
    };

    requestQueue.push(executeRequest);
    processQueue();
  });
};

// Update the processTransaction function
export const processTransaction = async (
  type: 'airtime' | 'data' | 'cable' | 'electricity',
  data: any,
  reference: string
): Promise<TransactionResponse> => {
  const serviceType = type;
  
  try {
    // Input validation
    if (!validServiceTypes.has(type)) {
      throw new Error(`Invalid service type: ${type}`);
    }
    
    if (!validateReference(reference)) {
      throw new Error('A valid transaction reference is required');
    }
    
    const transactionData = { ...data, reference };
    validateTransactionData(transactionData, type);
    
    // Process based on transaction type
    let endpoint = '';
    switch (type) {
      case 'airtime':
        endpoint = '/api/airtime/subscribe/';
        break;
      case 'data':
        endpoint = '/api/data/subscribe/';
        break;
      case 'cable':
        endpoint = '/api/cable/subscribe/';
        break;
      case 'electricity':
        endpoint = '/api/electricity/subscribe/';
        transactionData.identifier = 'electricity';
        break;
    }
    
    // Make the API request
    const response = await makeRequest({
      method: 'POST',
      url: endpoint,
      data: transactionData,
    });
    
    // Check if the API indicates failure
    if (response.status === 'failed') {
      return formatErrorResponse(
        new Error(response.message || 'Transaction failed'),
        reference,
        serviceType,
        response.message || 'Failed to process payment'
      );
    }
    
    // Return success response
    return formatSuccessResponse(
      response.data || {},
      reference,
      serviceType,
      'Payment processed successfully!'
    );
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Transaction Error:`, {
      type,
      reference,
      error: error.message,
      data
    });
    
    // Format and return error response
    return formatErrorResponse(
      error,
      reference,
      serviceType,
      `Failed to process ${serviceType} transaction`
    );
  }
};

// Helper function to validate transaction data
const validateTransactionData = (data: any, type: string) => {
  if (!data) throw new Error('Transaction data is required');
  
  // Common validations
  if (!validatePhoneNumber(data.phone)) {
    throw new Error('Invalid phone number format');
  }
  
  if (data.amount && !validateAmount(data.amount)) {
    throw new Error('Invalid amount');
  }
  
  // Type-specific validations
  switch (type) {
    case 'airtime':
      if (!validNetworks.has(data.network?.toLowerCase())) {
        throw new Error('Invalid network provider');
      }
      break;
      
    case 'data':
      if (!data.plan) {
        throw new Error('Data plan is required');
      }
      break;
      
    case 'cable':
      if (!data.iuc || !data.plan) {
        throw new Error('IUC and plan are required for cable subscription');
      }
      break;
      
    case 'electricity':
      if (!data.meter || !data.plan || !data.type) {
        throw new Error('Meter number, plan, and type are required for electricity payment');
      }
      break;
  }
};

// Transaction processing with enhanced error handling
export const processTransaction = async (
  type: 'airtime' | 'data' | 'cable' | 'electricity',
  data: any,
  reference: string
): Promise<TransactionResponse> => {
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

// Export other utility functions
export const checkTransactionStatus = async (reference: string) => {
  if (!validateReference(reference)) {
    throw new Error('A valid transaction reference is required');
  }
  
  return makeRequest({
    method: 'GET',
    url: `/api/transaction/status/${reference}/`,
  }, { requireReference: false });
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
