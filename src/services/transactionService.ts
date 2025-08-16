import { toast } from 'sonner';
import { sendAirtime, purchaseData, validateCable, setApiKey } from './easytopup';

// Set the API key directly
const EASYTOPUP_API_KEY = '84d5c7717d131cf2b5b2c6b1fbcace33';
setApiKey(EASYTOPUP_API_KEY);

type ServiceType = 'airtime' | 'data' | 'cable' | 'electricity';

interface TransactionData {
  service: ServiceType;
  network_id: string;
  phone?: string;
  amount?: string;
  plan_id?: string;
  smart_card_number?: string;
  cable_id?: string;
  // Additional fields for other services
  [key: string]: any;
}

export const processServiceTransaction = async (data: TransactionData) => {
  const { service, ...rest } = data;

  try {
    let result;

    switch (service) {
      case 'airtime':
        if (!rest.phone || !rest.amount || !rest.network_id) {
          throw new Error('Missing required fields for airtime transaction');
        }
        result = await sendAirtime({
          network_id: rest.network_id,
          phone: rest.phone,
          amount: rest.amount,
        });
        break;

      case 'data':
        if (!rest.phone || !rest.plan_id || !rest.network_id) {
          throw new Error('Missing required fields for data purchase');
        }
        result = await purchaseData({
          phone: rest.phone,
          plan_id: rest.plan_id,
          network_id: rest.network_id,
        });
        break;

      case 'cable':
        if (!rest.cable_id || !rest.smart_card_number) {
          throw new Error('Missing required fields for cable validation');
        }
        result = await validateCable({
          cable_id: rest.cable_id,
          smart_card_number: rest.smart_card_number,
        });
        break;

      case 'electricity':
        // Implement electricity service if needed
        throw new Error('Electricity service not yet implemented');

      default:
        throw new Error(`Unsupported service type: ${service}`);
    }

    if (result.status === 'success') {
      toast.success(result.message || 'Transaction successful');
      return { success: true, data: result.data };
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
