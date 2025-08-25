import { toast } from 'sonner';
import { 
  purchaseAirtime, 
  purchaseData, 
  subscribeCable, 
  rechargeElectricity,
  getServices,
  getPlans
} from './peyflex';

type ServiceType = 'airtime' | 'data' | 'cable' | 'electricity';

export interface TransactionData {
  service: ServiceType;
  network?: string;
  phone: string;
  amount?: string | number;
  plan?: string;
  iuc?: string;
  provider?: string;
  meter?: string;
  type?: 'prepaid' | 'postpaid';
  reference: string;
}

export interface TransactionResult {
  success: boolean;
  message: string;
  data?: any;
  transactionId?: string;
  reference: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

// Get available services or plans
export const fetchServiceData = async (type: 'services' | 'plans', serviceType?: ServiceType, id?: string) => {
  try {
    if (type === 'services') {
      return await getServices(serviceType!);
    } else if (type === 'plans' && serviceType && id) {
      if (serviceType === 'data' || serviceType === 'cable') {
        return await getPlans(serviceType, id);
      }
    }
    throw new Error('Invalid service type or missing parameters');
  } catch (error: any) {
    console.error(`Error fetching ${type}:`, error);
    throw new Error(error.message || `Failed to fetch ${type}`);
  }
};

const validateTransactionData = (data: TransactionData): { valid: boolean; error?: string } => {
  if (!data) {
    return { valid: false, error: 'Transaction data is required' };
  }

  if (!data.reference) {
    return { valid: false, error: 'Transaction reference is required' };
  }

  if (!data.service) {
    return { valid: false, error: 'Service type is required' };
  }

  // Basic phone number validation
  if (data.phone) {
    const phone = String(data.phone).trim();
    if (!/^(\+?234|0)[789]\d{9}$/.test(phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }
  }

  // Service-specific validation
  switch (data.service) {
    case 'airtime':
      if (!data.amount) return { valid: false, error: 'Amount is required for airtime purchase' };
      if (!data.network) return { valid: false, error: 'Network is required for airtime purchase' };
      break;
    
    case 'data':
      if (!data.plan) return { valid: false, error: 'Data plan is required' };
      if (!data.network) return { valid: false, error: 'Network is required for data purchase' };
      break;
    
    case 'cable':
      if (!data.iuc) return { valid: false, error: 'IUC/Decoder number is required for cable subscription' };
      if (!data.plan) return { valid: false, error: 'Plan is required for cable subscription' };
      if (!data.provider) return { valid: false, error: 'Provider is required for cable subscription' };
      break;
    
    case 'electricity':
      if (!data.meter) return { valid: false, error: 'Meter number is required for electricity payment' };
      if (!data.plan) return { valid: false, error: 'Plan is required for electricity payment' };
      if (!data.type) return { valid: false, error: 'Meter type (prepaid/postpaid) is required' };
      break;
  }

  return { valid: true };
};

// Network validation and mapping
const validateAndMapNetwork = (network: string, service: ServiceType): string => {
  if (!network) {
    throw new Error(`Network is required for ${service} service`);
  }

  const networkLower = network.toLowerCase().trim();
  
  // Network validation based on service type
  switch (service) {
    case 'airtime':
      const validNetworks = ['mtn', 'glo', 'airtel', '9mobile', 'etisalat'];
      if (!validNetworks.includes(networkLower)) {
        throw new Error(`Invalid network. Supported networks: ${validNetworks.join(', ')}`);
      }
      return networkLower;
      
    case 'data':
      const validDataNetworks = ['mtn', 'glo', 'airtel', '9mobile'];
      if (!validDataNetworks.includes(networkLower)) {
        throw new Error(`Invalid data network. Supported networks: ${validDataNetworks.join(', ')}`);
      }
      return networkLower;
      
    case 'cable':
      const validCableProviders = ['dstv', 'gotv', 'startimes'];
      if (!validCableProviders.includes(networkLower)) {
        throw new Error(`Invalid cable provider. Supported providers: ${validCableProviders.join(', ')}`);
      }
      return networkLower;
      
    case 'electricity':
      const validDiscos = ['ikeja', 'eko', 'kano', 'ph', 'ibadan', 'jos', 'kaduna', 'abuja', 'benin', 'portharcourt'];
      if (!validDiscos.includes(networkLower)) {
        throw new Error(`Invalid electricity provider. Supported providers: ${validDiscos.join(', ')}`);
      }
      return networkLower;
      
    default:
      return networkLower;
  }
};

export const processServiceTransaction = async (data: TransactionData): Promise<TransactionResult> => {
  const { service, reference, ...rest } = data;
  const timestamp = new Date().toISOString();

  try {
    // Input validation
    if (!service) {
      throw new Error('Service type is required');
    }

    console.log(`Processing ${service} transaction with reference: ${reference}`, data);

    // Process based on service type
    let result;
    
    try {
      // Format phone number (remove any non-digit characters and ensure it starts with 0)
      const formattedPhone = rest.phone.replace(/\D/g, '').replace(/^234/, '0');
      
      // Validate and normalize network/provider
      const network = rest.network ? validateAndMapNetwork(rest.network, service) : undefined;
      
      switch (service) {
        case 'airtime':
          if (!network) throw new Error('Network is required for airtime purchase');
          if (!rest.amount) throw new Error('Amount is required for airtime purchase');
          
          result = await purchaseAirtime({
            network,
            amount: Number(rest.amount),
            mobile_number: formattedPhone
          });
          break;

        case 'data':
          if (!network) throw new Error('Network is required for data purchase');
          if (!rest.plan) throw new Error('Data plan is required');
          
          result = await purchaseData({
            network,
            plan: rest.plan,
            mobile_number: formattedPhone
          });
          break;

        case 'cable':
          const provider = rest.provider ? validateAndMapNetwork(rest.provider, service) : undefined;
          if (!provider) throw new Error('Provider is required for cable subscription');
          if (!rest.iuc) throw new Error('IUC number is required');
          if (!rest.plan) throw new Error('Plan is required');
          
          result = await subscribeCable({
            provider,
            iuc: rest.iuc,
            plan: rest.plan,
            mobile_number: formattedPhone
          });
          break;

        case 'electricity':
          const disco = rest.network ? validateAndMapNetwork(rest.network, service) : undefined;
          if (!disco) throw new Error('Electricity provider is required');
          if (!rest.meter) throw new Error('Meter number is required');
          if (!rest.plan) throw new Error('Plan is required');
          if (!rest.amount) throw new Error('Amount is required');
          
          result = await rechargeElectricity({
            meter: rest.meter,
            plan: rest.plan,
            amount: Number(rest.amount),
            type: rest.type || 'prepaid',
            mobile_number: formattedPhone
          });
          break;

        default:
          throw new Error(`Unsupported service type: ${service}`);
      }
    } catch (apiError: any) {
      console.error(`API Error for ${service} (${reference}):`, apiError);
      throw new Error(apiError.message || 'API request failed');
    }

    console.log(`API Response for ${service} (${reference}):`, result);

    if (result.status === 'failed') {
      throw new Error(result.message || 'Transaction processing failed');
    }

    return {
      success: true,
      message: result.message || 'Transaction processed successfully',
      data: result.data,
      transactionId: result.data?.transaction_id || result.reference,
      reference: result.reference || reference,
      timestamp: result.timestamp || timestamp,
      status: 'success'
    };

  } catch (error: any) {
    console.error(`Error processing ${service} transaction:`, error);
    
    const errorMessage = error?.response?.data?.message || 
                       error?.message || 
                       'Failed to process transaction';
    
    // Show error toast
    toast.error(errorMessage);
    
    return {
      success: false,
      message: errorMessage,
      reference: reference || 'unknown',
      timestamp,
      status: 'failed'
    };
  }
};

// Helper function to process transaction after blockchain confirmation
export const processAfterBlockchainConfirmation = async (
  txHash: string,
  serviceData: TransactionData
): Promise<TransactionResult> => {
  const timestamp = new Date().toISOString();
  
  try {
    // 1. Verify the transaction hash
    if (!txHash || typeof txHash !== 'string' || txHash.length !== 66) {
      throw new Error('Invalid transaction hash');
    }

    console.log(`Processing service for transaction: ${txHash}`);
    
    // 2. Process the service transaction
    const result = await processServiceTransaction({
      ...serviceData,
      reference: txHash // Using transaction hash as reference
    });

    console.log('Service processing result for', txHash, ':', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Service processing failed');
    }

    return {
      ...result,
      status: 'success',
      timestamp: result.timestamp || timestamp,
      reference: txHash
    };

  } catch (error: any) {
    console.error(`Error processing transaction ${txHash}:`, error);
    
    // Extract error message from different error formats
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Failed to process transaction after blockchain confirmation';
    
    return {
      success: false,
      message: errorMessage,
      reference: txHash,
      timestamp,
      status: 'failed',
      data: {
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    };
  }
};
