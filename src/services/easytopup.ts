import axios from 'axios';

const BASE_URL = 'https://easytopup.ng/api/v1';

// Types
type NetworkID = string;
type PlanID = string;
type CableID = string;

export interface AirtimeRequest {
  network_id: NetworkID;
  phone: string;
  amount: string;
  type: 'VTU';
}

export interface DataRequest {
  phone: string;
  plan_id: PlanID;
  network_id: NetworkID;
  type: 'VTU';
}

export interface CableValidationRequest {
  cable_id: CableID;
  smart_card_number: string;
  type: 'VTU';
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the API key for all requests
export const setApiKey = (apiKey: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
};

/**
 * Send airtime top-up request
 */
export const sendAirtime = async (data: Omit<AirtimeRequest, 'type'>): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/airtime', {
      ...data,
      type: 'VTU' as const,
    });
    return response.data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to process airtime request',
    };
  }
};

/**
 * Purchase data plan
 */
export const purchaseData = async (data: Omit<DataRequest, 'type'>): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/data', {
      ...data,
      type: 'VTU' as const,
    });
    return response.data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to process data purchase',
    };
  }
};

/**
 * Validate cable TV details
 */
export const validateCable = async (
  data: Omit<CableValidationRequest, 'type'>
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>('/cable-validation', {
      ...data,
      type: 'VTU' as const,
    });
    return response.data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to validate cable details',
    };
  }
};

// Example usage:
/*
// Set API key (should be stored in environment variables)
setApiKey('YOUR_API_KEY');

// Example airtime request
const airtimeResult = await sendAirtime({
  network_id: '1',
  phone: '08012345678',
  amount: '100',
});

// Example data purchase
const dataResult = await purchaseData({
  phone: '08012345678',
  plan_id: '20',
  network_id: '1',
});
*/

export default {
  setApiKey,
  sendAirtime,
  purchaseData,
  validateCable,
};
