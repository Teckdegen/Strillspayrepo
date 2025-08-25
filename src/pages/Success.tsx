import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { processAfterBlockchainConfirmation } from '../services/transactionService';
import { toast } from 'sonner';

type TransactionStatus = 'pending' | 'processing' | 'success' | 'failed';

interface TransactionData {
  status: TransactionStatus;
  service: string;
  provider: string;
  amount: number;
  recipient: string;
  reference: string;
  message?: string;
  timestamp?: string;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get transaction data from location state first (if coming from payment flow)
    const stateData = location.state as TransactionData | undefined;
    
    // Then try to get from URL params
    const txHash = searchParams.get('txHash');
    const txData = searchParams.get('txData');

    if (stateData) {
      // If we have state data, use that
      setTransaction(stateData);
      if (stateData.status === 'pending' && txHash) {
        processTransaction(stateData, txHash);
      } else {
        setIsProcessing(false);
      }
    } else if (txHash && txData) {
      // Otherwise try to parse from URL params
      try {
        const parsedData = JSON.parse(decodeURIComponent(txData));
        setTransaction(parsedData);
        processTransaction(parsedData, txHash);
      } catch (err) {
        console.error('Error parsing transaction data:', err);
        setError('Invalid transaction data');
        setIsProcessing(false);
      }
    } else {
      // No valid data found
      setError('No transaction data found');
      setIsProcessing(false);
    }

    // Clean up function to handle component unmount
    return () => {
      // Any cleanup if needed
    };
  }, [searchParams, location.state]);

  const processTransaction = async (txData: TransactionData, txHash: string) => {
    try {
      setIsProcessing(true);
      
      // Update to processing state
      setTransaction(prev => ({
        ...prev!,
        status: 'processing',
        reference: txHash,
        timestamp: new Date().toISOString()
      }));

      console.log('Processing transaction with data:', {
        ...txData,
        reference: txHash,
        status: 'processing'
      });

      // Process the transaction
      const result = await processAfterBlockchainConfirmation(txHash, {
        ...txData,
        reference: txHash
      });

      console.log('Transaction processing result:', result);

      if (!result.success) {
        throw new Error(result.message || 'Transaction processing failed');
      }

      // Update to success state
      setTransaction(prev => ({
        ...prev!,
        status: 'success',
        message: result.message,
        timestamp: result.timestamp || new Date().toISOString()
      }));

      toast.success('Transaction completed successfully');
    } catch (err: any) {
      console.error('Error processing transaction:', err);
      
      const errorMessage = err?.response?.data?.message || 
                         err?.message || 
                         'An unexpected error occurred';
      
      setError(errorMessage);
      setTransaction(prev => ({
        ...prev!,
        status: 'failed',
        message: errorMessage
      }));
      
      toast.error(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToHome = () => {
    // Clear any transaction state when going back to home
    navigate('/', { replace: true, state: null });
  };

  const renderStatus = () => {
    if (!transaction) return null;

    const statusConfig = {
      pending: {
        emoji: '⏳',
        title: 'Transaction Pending',
        message: 'Waiting for blockchain confirmation...',
        color: 'bg-yellow-100 text-yellow-800'
      },
      processing: {
        emoji: '⚙️',
        title: 'Processing',
        message: 'Your transaction is being processed...',
        color: 'bg-blue-100 text-blue-800'
      },
      success: {
        emoji: '✅',
        title: 'Success!',
        message: transaction.message || 'Transaction completed successfully',
        color: 'bg-green-100 text-green-800'
      },
      failed: {
        emoji: '❌',
        title: 'Transaction Failed',
        message: transaction.message || 'An error occurred',
        color: 'bg-red-100 text-red-800'
      }
    };

    const status = statusConfig[transaction.status] || statusConfig.failed;

    return (
      <div className="text-center">
        <div className="text-6xl mb-4">{status.emoji}</div>
        <h1 className="text-2xl font-bold mb-2">{status.title}</h1>
        <p className="mb-6">{status.message}</p>
        
        <div className={`p-4 rounded-lg ${status.color} mb-6 text-left`}>
          <div className="grid grid-cols-2 gap-2">
            <div>Service:</div>
            <div className="font-medium capitalize">{transaction.service}</div>
            
            <div>Provider:</div>
            <div className="font-medium">{transaction.provider}</div>
            
            <div>Amount:</div>
            <div className="font-medium">₦{transaction.amount?.toLocaleString()}</div>
            
            <div>Recipient:</div>
            <div className="font-medium">{transaction.recipient}</div>
            
            <div>Reference:</div>
            <div className="font-mono text-sm break-all">{transaction.reference}</div>
            
            {transaction.timestamp && (
              <>
                <div>Time:</div>
                <div>{new Date(transaction.timestamp).toLocaleString()}</div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
          
          {transaction.status === 'failed' && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6">
        {renderStatus()}
      </div>
    </div>
  );
}
