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
    // Input validation
    if (!reference) {
      throw new Error('Transaction reference is required');
    }

    if (!service) {
      throw new Error('Service type is required');
    }

    console.log(`Processing ${service} transaction with reference: ${reference}`);

    let result: TransactionResponse;
    const requestData: any = { ...rest };

    // Common validation for all services
    if (!rest.phone || !/^\+?[0-9]{10,14}$/.test(rest.phone)) {
      throw new Error('Valid phone number is required');
    }

    // Process based on service type
    switch (service) {
      case 'airtime':
        if (!rest.amount || isNaN(Number(rest.amount)) || Number(rest.amount) <= 0) {
          throw new Error('Valid amount is required for airtime transaction');
        }
        if (!rest.network) {
          throw new Error('Network is required for airtime transaction');
        }
        result = await processTransaction('airtime', {
          phone: rest.phone,
          amount: rest.amount,
          network: rest.network,
        }, reference);
        break;

      case 'data':
        if (!rest.plan) {
          throw new Error('Data plan is required');
        }
        if (!rest.network) {
          throw new Error('Network is required for data purchase');
        }
        result = await processTransaction('data', {
          phone: rest.phone,
          plan: rest.plan,
          network: rest.network,
        }, reference);
        break;

      case 'cable':
        if (!rest.provider) {
          throw new Error('Cable provider is required');
        }
        if (!rest.iuc) {
          throw new Error('Smart card/IUC number is required');
        }
        if (!rest.plan) {
          throw new Error('Cable plan is required');
        }
        result = await processTransaction('cable', {
          provider: rest.provider,
          iuc: rest.iuc,
          plan: rest.plan,
          phone: rest.phone,
        }, reference);
        break;

      case 'electricity':
        if (!rest.meter) {
          throw new Error('Meter number is required');
        }
        if (!rest.amount || isNaN(Number(rest.amount)) || Number(rest.amount) <= 0) {
          throw new Error('Valid amount is required for electricity payment');
        }
        if (!rest.plan) {
          throw new Error('Electricity plan is required');
        }
        if (!rest.type) {
          throw new Error('Meter type (prepaid/postpaid) is required');
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

    // Log successful API response
    console.log(`API Response for ${service} (${reference}):`, result);

    // Handle response
    const response: TransactionResult = {
      success: result.status === 'success',
      message: result.message || 'Transaction processed successfully',
      data: result.data,
      transactionId: result.data?.transactionId || result.data?.id,
      reference: result.reference || reference,
      timestamp: result.timestamp || timestamp,
      status: result.status === 'success' ? 'success' : 'failed'
    };

    if (!response.success) {
      console.error(`Transaction failed: ${response.message}`, response);
    }

    // Show toast notification
    if (response.success) {
      toast.success(response.message || 'Transaction completed successfully');
    } else {
      toast.error(response.message || 'Transaction failed');
    }

    return response;

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

    console.log(`Service processing result for ${txHash}:`, result);
    
    if (!result.success) {
      throw new Error(result.message || 'Service processing failed');
    }

    return {
      ...result,
      status: 'success',
      timestamp,
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
