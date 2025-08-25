import { toast } from 'sonner';
import { processTransaction } from './peyflex';

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

    console.log(`Processing ${service} transaction with reference: ${reference}`, data);

    // Process based on service type
    let result;
    
    try {
      result = await processTransaction(
        service as 'airtime' | 'data' | 'cable' | 'electricity',
        {
          ...rest,
          phone: rest.phone.startsWith('0') ? `+234${rest.phone.slice(1)}` : rest.phone
        },
        reference
      );
    } catch (apiError: any) {
      console.error(`API Error for ${service} (${reference}):`, apiError);
      throw new Error(apiError.response?.data?.message || apiError.message || 'API request failed');
    }

    console.log(`API Response for ${service} (${reference}):`, result);

    if (result.status === 'failed') {
      throw new Error(result.message || 'Transaction processing failed');
    }

    return {
      success: true,
      message: result.message || 'Transaction processed successfully',
      data: result.data,
      transactionId: result.data?.transactionId || result.data?.id,
      reference: result.reference || reference,
      timestamp: result.timestamp || timestamp,
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
