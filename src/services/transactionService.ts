import { toast } from 'sonner';
import { purchaseAirtime, purchaseData, purchaseCable, purchaseElectricity } from './peyflex';

type ServiceType = 'airtime' | 'data' | 'cable' | 'electricity';

interface TransactionData {
  service: ServiceType;
  network: string;
  phone: string;
  amount?: string;
  plan?: string;
  iuc?: string;
  provider?: string;
  meter?: string;
  type?: string;
}

export const processServiceTransaction = async (data: TransactionData) => {
  const { service, ...rest } = data;

  try {
    let result;

    switch (service) {
      case 'airtime':
        if (!rest.phone || !rest.amount || !rest.network) {
          throw new Error('Missing required fields for airtime transaction');
        }
        result = await purchaseAirtime({
          network: rest.network,
          phone: rest.phone,
          amount: rest.amount,
        });
        break;

      case 'data':
        if (!rest.phone || !rest.plan || !rest.network) {
          throw new Error('Missing required fields for data purchase');
        }
        result = await purchaseData({
          phone: rest.phone,
          plan: rest.plan,
          network: rest.network,
        });
        break;

      case 'cable':
        if (!rest.provider || !rest.iuc || !rest.plan || !rest.phone) {
          throw new Error('Missing required fields for cable subscription');
        }
        result = await purchaseCable({
          provider: rest.provider,
          iuc: rest.iuc,
          plan: rest.plan,
          phone: rest.phone,
        });
        break;

      case 'electricity':
        if (!rest.meter || !rest.plan || !rest.amount || !rest.type || !rest.phone) {
          throw new Error('Missing required fields for electricity payment');
        }
        result = await purchaseElectricity({
          meter: rest.meter,
          plan: rest.plan,
          amount: rest.amount,
          type: rest.type,
          phone: rest.phone,
        });
        break;

      default:
        throw new Error(`Unsupported service type: ${service}`);
    }

    // Peyflex API response structure
    if (result.status === 'success' || result.status === true) {
      toast.success(result.message || 'Transaction successful');
      return { success: true, data: result.data, transactionId: result.id };
    } else {
      throw new Error(result.message || 'Transaction failed');
    }
  } catch (error: any) {
    console.error('Transaction error:', error);
    toast.error(error.message || 'Failed to process transaction');
    return { success: false, error: error.message };
  }
};

// Helper function to process transaction after blockchain confirmation
export const processAfterBlockchainConfirmation = async (
  txHash: string,
  serviceData: TransactionData
) => {
  try {
    // Here you would typically:
    // 1. Verify the blockchain transaction
    // 2. Check for sufficient confirmations
    // 3. Process the service transaction
    
    console.log(`Processing service for tx: ${txHash}`, serviceData);
    
    // Process the actual service
    const result = await processServiceTransaction(serviceData);
    
    return result;
  } catch (error: any) {
    console.error('Post-transaction processing error:', error);
    throw error;
  }
};
