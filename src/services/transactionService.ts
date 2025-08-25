import { toast } from 'sonner';
import { 
  purchaseAirtime, 
  purchaseData, 
  subscribeCable, 
  rechargeElectricity,
  verifyCableIUC,
  verifyMeterNumber
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

export const processServiceTransaction = async (data: TransactionData): Promise<TransactionResult> => {
  const { service, reference, ...rest } = data;
  const timestamp = new Date().toISOString();

  try {
    // Input validation
    const validation = validateTransactionData(data);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    console.log(`Processing ${service} transaction with reference: ${reference}`, data);

    // Process based on service type
    let result;
    
    try {
      // Format phone number if needed
      const formattedPhone = rest.phone.startsWith('0') 
        ? `234${rest.phone.slice(1)}` 
        : rest.phone.startsWith('+234')
        ? rest.phone.slice(1)
        : rest.phone;

      switch (service) {
        case 'airtime':
          result = await purchaseAirtime({
            network: rest.network!,
            phone: formattedPhone,
            amount: rest.amount!
          });
          break;

        case 'data':
          result = await purchaseData({
            network: rest.network!,
            plan: rest.plan!,
            phone: formattedPhone
          });
          break;

        case 'cable':
          // First verify IUC if provided
          if (rest.iuc) {
            await verifyCableIUC(rest.provider!, rest.iuc);
          }
          
          result = await subscribeCable({
            provider: rest.provider!,
            iuc: rest.iuc!,
            plan: rest.plan!,
            phone: formattedPhone
          });
          break;

        case 'electricity':
          // Verify meter number first if provided
          if (rest.meter) {
            await verifyMeterNumber({
              meter: rest.meter,
              plan: rest.plan!,
              type: rest.type as 'prepaid' | 'postpaid'
            });
          }
          
          result = await rechargeElectricity({
            meter: rest.meter!,
            plan: rest.plan!,
            amount: rest.amount!,
            type: rest.type as 'prepaid' | 'postpaid',
            phone: formattedPhone
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
      transactionId: result.data?.transactionId || result.data?.transaction_id,
      reference: result.data?.reference || reference,
      timestamp: result.data?.timestamp || timestamp,
      status: 'success'
    };

  } catch (error: any) {
    console.error(`Error processing ${data.service} transaction:`, error);
    
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
      status: 'failed',
      data: {
        error: errorMessage,
        service: data.service,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
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
