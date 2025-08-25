import { toast } from 'sonner';
import { processTransaction, TransactionResponse } from './peyflex';

type ServiceType = 'airtime' | 'data' | 'cable' | 'electricity';

export interface TransactionData {
  service: ServiceType;
  network?: string;
  phone: string;
  amount?: string;
  plan?: string;
  iuc?: string;
  provider?: string;
  meter?: string;
  type?: string;
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

export const processServiceTransaction = async (data: TransactionData): Promise<TransactionResult> => {
  const { service, reference, ...rest } = data;
  const timestamp = new Date().toISOString();

  try {
    // Basic validation
    if (!reference) {
      throw new Error('Transaction reference is required');
    }

    let result: TransactionResponse;

    switch (service) {
      case 'airtime':
        if (!rest.phone || !rest.amount || !rest.network) {
          throw new Error('Missing required fields for airtime transaction');
        }
        result = await processTransaction('airtime', {
          phone: rest.phone,
          amount: rest.amount,
          network: rest.network,
        }, reference);
        break;

      case 'data':
        if (!rest.phone || !rest.plan || !rest.network) {
          throw new Error('Missing required fields for data purchase');
        }
        result = await processTransaction('data', {
          phone: rest.phone,
          plan: rest.plan,
          network: rest.network,
        }, reference);
        break;

      case 'cable':
        if (!rest.provider || !rest.iuc || !rest.plan || !rest.phone) {
          throw new Error('Missing required fields for cable subscription');
        }
        result = await processTransaction('cable', {
          provider: rest.provider,
          iuc: rest.iuc,
          plan: rest.plan,
          phone: rest.phone,
        }, reference);
        break;

      case 'electricity':
        if (!rest.meter || !rest.plan || !rest.amount || !rest.type || !rest.phone) {
          throw new Error('Missing required fields for electricity payment');
        }
        result = await processTransaction('electricity', {
          meter: rest.meter,
          plan: rest.plan,
          amount: rest.amount,
          type: rest.type,
          phone: rest.phone,
        }, reference);
        break;

      default:
        throw new Error(`Unsupported service type: ${service}`);
    }

    // Handle response
    const response: TransactionResult = {
      success: result.status === 'success',
      message: result.message,
      data: result.data,
      transactionId: result.data?.transactionId || result.data?.id,
      reference: result.reference || reference,
      timestamp: result.timestamp || timestamp,
      status: result.status
    };

    // Show toast notification
    if (response.success) {
      toast.success(response.message || 'Transaction completed successfully');
    } else {
      toast.error(response.message || 'Transaction failed');
    }

    return response;

  } catch (error: any) {
    console.error('Transaction error:', error);
    
    const errorMessage = error.response?.data?.message || error.message || 'Failed to process transaction';
    
    // Show error toast
    toast.error(errorMessage);
    
    return {
      success: false,
      message: errorMessage,
      reference,
      timestamp,
      status: 'failed',
      data: error.response?.data || {}
    };
  }
};

// Helper function to process transaction after blockchain confirmation
export const processAfterBlockchainConfirmation = async (
  txHash: string,
  serviceData: TransactionData
): Promise<TransactionResult> => {
  try {
    // 1. Verify the blockchain transaction
    if (!txHash) {
      throw new Error('Transaction hash is required');
    }

    // 2. Process the service transaction
    const result = await processServiceTransaction({
      ...serviceData,
      reference: txHash // Using transaction hash as reference
    });

    return result;

  } catch (error: any) {
    console.error('Error in processAfterBlockchainConfirmation:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to process transaction after blockchain confirmation',
      reference: txHash,
      timestamp: new Date().toISOString(),
      status: 'failed',
      data: { error: error.toString() }
    };
  }
};
