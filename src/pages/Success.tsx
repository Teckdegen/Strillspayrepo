import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt, Loader2, AlertCircle } from 'lucide-react';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { Header } from '../components/Header';
import { useWaitForTransactionReceipt } from 'wagmi';
import { processServiceTransaction } from '../services/transactionService';
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
}

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<SuccessState>({
    ...(location.state as SuccessState),
    status: (location.state as SuccessState)?.status || 'pending',
  });
  const [isProcessing, setIsProcessing] = useState(false);

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
    if (isProcessing) return;
    
    setIsProcessing(true);
    setState(prev => ({ ...prev, status: 'processing' }));

    try {
      const serviceData = {
        service: state.service as 'airtime' | 'data' | 'cable' | 'electricity',
        network: state.networkId || state.provider || '',
        phone: state.mobileNumber || '',
        amount: state.amount.toString(),
        plan: state.planId || '',
        iuc: state.smartCardNumber || '',
        provider: state.provider || state.cableId || '',
      };

      const result = await processServiceTransaction(serviceData);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          status: 'completed',
          serviceProcessed: true,
          transactionHash: (result as any).transactionId || prev.transactionHash,
        }));
      } else {
        throw new Error(result.error || 'Failed to process service');
      }
    } catch (error) {
      console.error('Service processing error:', error);
      setState(prev => ({
        ...prev,
        status: 'failed',
        serviceProcessed: false,
        serviceError: error instanceof Error ? error.message : 'Unknown error',
      }));
      toast.error('Service processing failed. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-redirect to home after 10 seconds of successful completion
  useEffect(() => {
    if (state.status === 'completed') {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [state.status, navigate]);

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
          <LitCard className="text-center space-y-8">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-primary animate-pulse">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="absolute top-4 right-8 w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-4 left-8 w-1 h-1 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              {state.status === 'pending' && (
                <>
                  <h1 className="text-3xl font-bold text-foreground">
                    {isWaitingForConfirmation ? 'Confirming Payment...' : 'Payment Submitted'}
                  </h1>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-muted-foreground">
                        {isWaitingForConfirmation 
                          ? 'Waiting for blockchain confirmation...' 
                          : 'Transaction submitted to Sonic network'
                        }
                      </p>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse w-1/3"></div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        💡 Your payment is being processed on the Sonic blockchain. Service activation will begin once confirmed.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {state.status === 'processing' && (
                <>
                  <h1 className="text-3xl font-bold text-foreground">
                    Activating your {state.service.toLowerCase()}...
                  </h1>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-muted-foreground">
                        Processing {state.service.toLowerCase()} with {state.provider}
                      </p>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full animate-pulse w-2/3"></div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        ⚡ Payment confirmed! Now activating your service with {state.provider}...
                      </p>
                    </div>
                  </div>
                </>
              )}

              {state.status === 'completed' && (
                <>
                  <h1 className="text-3xl font-bold text-foreground">
                    Payment Successful! 🎉
                  </h1>
                  <p className="text-muted-foreground">
                    Your {state.service.toLowerCase()} service has been activated successfully.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      ✅ Service activation complete! You should receive a confirmation SMS shortly.
                    </p>
                  </div>
                </>
              )}

              {state.status === 'failed' && (
                <>
                  <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <span>Processing Error</span>
                  </h1>
                  <div className="space-y-2 text-center">
                    <p className="text-destructive">
                      {state.serviceError || 'Failed to process service'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your payment was successful, but there was an issue activating the service.
                      Please contact support with your transaction details.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Transaction Details */}
            <div className="bg-card/50 rounded-xl p-6 space-y-4 text-left border border-border/50">
              <div className="flex items-center space-x-3 mb-4">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Transaction Details</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="text-foreground font-medium capitalize">
                    {state.service.toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="text-foreground font-medium">{state.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="text-foreground font-medium">{state.recipient}</span>
                </div>
                {state.mobileNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Number:</span>
                    <span className="text-foreground font-medium">{state.mobileNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground font-medium">
                    ₦{state.amount.toLocaleString()} 
                    {state.usdcAmount && ` (${state.usdcAmount.toFixed(2)} USDC)`}
                  </span>
                </div>
                {state.exchangeRate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exchange Rate:</span>
                    <span className="text-foreground font-medium">₦{state.exchangeRate.toLocaleString()}/USDC</span>
                  </div>
                )}
                {state.transactionHash && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction:</span>
                    <a 
                      href={`https://sonicscan.org/tx/${state.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {state.transactionHash.slice(0, 8)}...{state.transactionHash.slice(-6)}
                    </a>
                  </div>
                )}
                {state.status === 'completed' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 font-medium">Service Activated</span>
                    </div>
                  </div>
                )}
                {state.status === 'failed' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4 text-destructive" />
                      <span className="text-destructive font-medium">Service Failed</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <LitButton
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/')}
                disabled={isProcessing}
              >
                <Home className="w-4 h-4 mr-2" />
                Back Home
              </LitButton>
              {state.status === 'failed' && (
                <LitButton 
                  className="w-full"
                  onClick={processService}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </LitButton>
              )}
              {state.status === 'completed' && (
                <LitButton className="w-full">
                  <Receipt className="w-4 h-4 mr-2" />
                  View Receipt
                </LitButton>
              )}
            </div>
          </LitCard>
        </div>
      </div>
    </>
  );
};

export default Success;