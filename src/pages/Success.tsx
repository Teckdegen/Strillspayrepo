import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { Header } from '../components/Header';

interface SuccessState {
  service: string;
  provider: string;
  amount: number;
  recipient: string;
  transactionHash: string;
  usdcAmount?: number;
  serviceProcessed?: boolean;
  serviceError?: string;
}

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SuccessState;

  useEffect(() => {
    // Auto-redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
              <h1 className="text-3xl font-bold text-foreground">
                {state.serviceProcessed === false 
                  ? 'Payment Complete' 
                  : 'Payment Successful! 🎉'}
              </h1>
              {state.serviceProcessed === undefined ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Processing your {state.service.toLowerCase()} request...
                  </p>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              ) : state.serviceProcessed === true ? (
                <p className="text-muted-foreground">
                  Your {state.service.toLowerCase()} service has been activated successfully.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-destructive">
                    Service activation failed: {state.serviceError || 'Unknown error'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your payment was successful, but there was an issue activating the service.
                    Please contact support with your transaction hash.
                  </p>
                </div>
              )}
            </div>

            {/* Transaction Details */}
            <div className="bg-card/50 rounded-xl p-6 space-y-4 text-left">
              <div className="flex items-center space-x-3 mb-4">
                <Receipt className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Transaction Details</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="text-foreground font-medium">{state.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="text-foreground font-medium">{state.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="text-foreground font-medium">{state.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground font-medium">
                    ₦{state.amount.toLocaleString()} 
                    {state.usdcAmount && `(${state.usdcAmount.toFixed(2)} USDC)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction:</span>
                  <a 
                    href={`https://sonicscan.org/tx/${state.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium truncate max-w-32"
                  >
                    {state.transactionHash.slice(0, 8)}...{state.transactionHash.slice(-6)}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <LitButton
                onClick={() => navigate('/')}
                className="w-full"
                glow
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </LitButton>
              
              <p className="text-xs text-muted-foreground">
                You will be automatically redirected in 10 seconds
              </p>
            </div>
          </LitCard>
        </div>
      </div>
    </>
  );
};

export default Success;