import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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

// Generic request handler with queue management
const makeRequest = async <T>(
  config: AxiosRequestConfig,
  options: { requireReference?: boolean } = {}
): Promise<PeyflexResponse<T>> => {
  try {
    // Add API key to headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      ...config.headers
    };

    const response = await axios({
      ...config,
      headers,
      timeout: REQUEST_TIMEOUT,
      baseURL: BASE_URL
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw error;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw error;
    }
  }
};

// Transaction processing with enhanced error handling
export const processTransaction = async (
  type: 'airtime' | 'data' | 'cable' | 'electricity',
  data: any,
  reference: string
): Promise<TransactionResponse> => {
  try {
    // Input validation
    if (!reference || typeof reference !== 'string') {
      return formatErrorResponse(
        new Error('Invalid transaction reference'),
        reference,
        type,
        'A valid transaction reference is required'
      );
    }

    // Check for duplicate transaction
    if (processedTransactions.has(reference)) {
      return formatErrorResponse(
        new Error('Duplicate transaction'),
        reference,
        type,
        'This transaction has already been processed'
      );
    }

    // Mark this reference as processed
    processedTransactions.add(reference);

    // Prepare request based on transaction type
    let endpoint = '';
    let requestData: any = { ...data };

    switch (type) {
      case 'airtime':
        endpoint = '/airtime/purchase';
        requestData = {
          network: data.network,
          phone: data.phone,
          amount: data.amount,
          reference
        };
        break;

      case 'data':
        endpoint = '/data/purchase';
        requestData = {
          network: data.network,
          phone: data.phone,
          plan: data.plan,
          reference
        };
        break;

      case 'cable':
        endpoint = '/cable/subscribe';
        requestData = {
          provider: data.provider,
          iuc: data.iuc,
          plan: data.plan,
          phone: data.phone,
          reference
        };
        break;

      case 'electricity':
        endpoint = '/electricity/pay';
        requestData = {
          meter: data.meter,
          plan: data.plan,
          amount: data.amount,
          type: data.type,
          phone: data.phone,
          reference
        };
        break;

      default:
        return formatErrorResponse(
          new Error('Unsupported service type'),
          reference,
          type,
          'The requested service is not supported'
        );
    }

    // Make the API request
    const response = await makeRequest({
      method: 'POST',
      url: endpoint,
      data: requestData
    });

    // Handle the response
    if (response.status === 'success') {
      return formatSuccessResponse(
        response.data,
        reference,
        type,
        response.message
      );
    } else {
      return formatErrorResponse(
        new Error(response.message || 'Transaction failed'),
        reference,
        type,
        response.message
      );
    }

  } catch (error: any) {
    console.error(`Error in processTransaction (${type}):`, error);
    return formatErrorResponse(
      error,
      reference,
      type,
      'An unexpected error occurred while processing the transaction'
    );
  }
};

// Export other service functions
export const checkTransactionStatus = async (reference: string) => {
  return makeRequest({
    method: 'GET',
    url: `/transaction/status/${reference}`
  });
};

export const getAirtimeNetworks = async () => {
  return makeRequest({
    method: 'GET',
    url: '/airtime/networks'
  });
};

export const getDataPlans = async (network: string) => {
  return makeRequest({
    method: 'GET',
    url: `/data/plans?network=${network}`
  });
};

// Add other service functions as needed
