import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, Loader2, AlertCircle, Clock, XCircle } from 'lucide-react';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { Header } from '../components/Header';
import { useWaitForTransactionReceipt } from 'wagmi';
import { processAfterBlockchainConfirmation, TransactionData } from '../services/transactionService';
import { toast } from 'sonner';

interface SuccessState {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  service: string;
  provider?: string;
  amount: number;
  recipient: string;
  transactionHash?: string;
  mobileNumber?: string;
  planId?: string;
  networkId?: string;
  smartCardNumber?: string;
  cableId?: string;
  usdcAmount?: number;
  nairaAmount?: number;
  exchangeRate?: number;
  serviceProcessed?: boolean;
  serviceError?: string;
  message?: string;
  reference?: string;
}

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<SuccessState>({
    ...(location.state as SuccessState),
    status: (location.state as SuccessState)?.status || 'pending',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Watch for transaction confirmation if we have a hash
  const { isSuccess: isTransactionConfirmed, isLoading: isWaitingForConfirmation } = useWaitForTransactionReceipt({
    hash: state.transactionHash as `0x${string}`,
  });

  // Handle service processing when transaction is confirmed
  useEffect(() => {
    if (isTransactionConfirmed && state.status === 'pending') {
      processService();
    }
  }, [isTransactionConfirmed, state.status]);

  // Process the service (airtime/data/cable) after transaction is confirmed
  const processService = async () => {
    if (isProcessing || !state.transactionHash) return;
    
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: 'processing' }));

    try {
      // Prepare service data
      const serviceData: TransactionData = {
        service: state.service.toLowerCase() as 'airtime' | 'data' | 'cable' | 'electricity',
        reference: state.transactionHash,
        phone: state.mobileNumber || state.recipient || '',
        amount: state.amount?.toString() || '0',
        plan: state.planId || '',
        network: state.networkId || state.provider || '',
        iuc: state.smartCardNumber || '',
        provider: state.provider || state.cableId || '',
        meter: state.recipient,
        type: 'prepaid'
      };

      console.log('Processing service with data:', serviceData);
      
      // Show processing toast
      const toastId = toast.loading('Processing your transaction...');
      
      // Process the service
      const result = await processAfterBlockchainConfirmation(state.transactionHash, serviceData);
      
      console.log('Service processing result:', result);
      
      // Update state based on result
      const newState = {
        status: result.status === 'success' ? 'completed' : 'failed',
        serviceProcessed: result.status === 'success',
        serviceError: result.status === 'failed' ? result.message : undefined,
        message: result.message,
        reference: result.reference
      };
      
      setState(prev => ({ ...prev, ...newState }));

      // Update toast based on result
      if (result.status === 'success') {
        toast.success('Transaction completed successfully!', { id: toastId });
      } else {
        toast.error(result.message || 'Failed to process service', { id: toastId });
      }
      
    } catch (error) {
      console.error('Service processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState(prev => ({
        ...prev,
        status: 'failed',
        serviceProcessed: false,
        serviceError: errorMessage,
        message: errorMessage
      }));
      
      toast.error('Service processing failed. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-redirect to home after countdown
  useEffect(() => {
    if (state.status === 'completed') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.status, navigate]);

  const getStatusIcon = () => {
    switch (state.status) {
      case 'completed':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      case 'processing':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />;
      default:
        return <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;
    }
  };

  const getStatusMessage = () => {
    switch (state.status) {
      case 'completed':
        return state.message || 'Transaction Completed Successfully!';
      case 'failed':
        return state.message || 'Transaction Failed';
      case 'processing':
        return 'Processing your transaction...';
      default:
        return 'Waiting for confirmation...';
    }
  };

  const getActionButtons = () => {
    if (state.status === 'failed') {
      return (
        <div className="flex flex-col space-y-4">
          <LitButton
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Back to Home
          </LitButton>
          <LitButton
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try Again
          </LitButton>
        </div>
      );
    }

    if (state.status === 'completed') {
      return (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Redirecting to home in {countdown} seconds...
          </p>
          <LitButton
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Home Now
          </LitButton>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground text-center">
          {state.status === 'processing' 
            ? 'Processing your request. Please wait...' 
            : 'Waiting for transaction confirmation...'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      <div className="container mx-auto px-4 py-24 max-w-md">
        <LitCard className="p-6 space-y-6">
          <div className="text-center space-y-4">
            {getStatusIcon()}
            <h1 className="text-2xl font-bold text-foreground">
              {getStatusMessage()}
            </h1>
            
            {state.status === 'completed' && (
              <p className="text-muted-foreground">
                Your {state.service} transaction has been processed successfully.
              </p>
            )}

            {state.status === 'failed' && state.serviceError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
                {state.serviceError}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-foreground">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Service:</div>
                <div className="text-right font-medium capitalize">{state.service}</div>
                
                <div className="text-muted-foreground">Amount:</div>
                <div className="text-right font-medium">
                  ₦{state.amount?.toLocaleString()}
                  {state.usdcAmount && ` (${state.usdcAmount} USDC)`}
                </div>
                
                {state.recipient && (
                  <>
                    <div className="text-muted-foreground">Recipient:</div>
                    <div className="text-right font-medium">{state.recipient}</div>
                  </>
                )}
                
                {state.reference && (
                  <>
                    <div className="text-muted-foreground">Reference:</div>
                    <div className="text-right font-mono text-xs break-all">
                      {state.reference}
                    </div>
                  </>
                )}
              </div>
            </div>

            {getActionButtons()}
          </div>
        </LitCard>
      </div>
    </div>
  );
};

export default Success;
