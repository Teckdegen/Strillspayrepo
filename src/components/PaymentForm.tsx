import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useSignTypedData, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';

interface PaymentFormProps {
  service: 'airtime' | 'data' | 'cable' | 'electricity';
  provider: string;
  amount: number;
  recipient: string;
  plan?: string;
  network?: string;
  onSuccess?: () => void;
}

export function PaymentForm({
  service,
  provider,
  amount,
  recipient,
  plan = '',
  network = '',
  onSuccess
}: PaymentFormProps) {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Initialize contract write
  const { 
    data: hash,
    isPending,
    writeContractAsync
  } = useWriteContract();

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare transaction data
      const transactionData = {
        service,
        provider,
        amount,
        recipient,
        plan,
        network,
        status: 'pending' as const,
        timestamp: new Date().toISOString()
      };

      // In a real app, you would call your smart contract here
      // For example:
      // const hash = await writeContractAsync({
      //   address: CONTRACT_ADDRESS,
      //   abi: CONTRACT_ABI,
      //   functionName: 'processPayment',
      //   args: [recipient, parseEther(amount.toString())],
      //   value: parseEther(amount.toString()),
      // });

      // For demo purposes, we'll simulate a transaction hash
      const mockHash = `0x${Math.random().toString(16).substring(2, 66)}`;
      
      // Navigate to success page with transaction data
      navigate('/success', {
        state: {
          ...transactionData,
          reference: mockHash,
        },
        // Replace the current entry in the history stack
        replace: true
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium capitalize">{service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Provider:</span>
            <span className="font-medium">{provider}</span>
          </div>
          {plan && (
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{plan}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">₦{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Recipient:</span>
            <span className="font-medium">{recipient}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || isPending || isConfirming}
          className={`px-6 py-2 rounded-md text-white ${
            isProcessing || isPending || isConfirming
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing || isPending || isConfirming ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isConfirming ? 'Confirming...' : 'Processing...'}
            </span>
          ) : (
            'Confirm Payment'
          )}
        </button>
      </div>
    </div>
  );
}
