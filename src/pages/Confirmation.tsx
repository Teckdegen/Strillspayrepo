import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { fetchExchangeRate, convertNairaToUSDC } from '../constants';
import { USDC_CONTRACT_ADDRESS, TREASURY_ADDRESS, USDC_ABI, sonicMainnet } from '../config/wagmi';
import { processServiceTransaction } from '../services/transactionService';

interface ConfirmationState {
  service: string;
  provider: string;
  plan?: { name: string; amount: number };
  recipient: string;
  mobileNumber?: string;
  phone?: string; // Alias for mobileNumber
  amount: number;
  planId?: string;
  plan_id?: string; // Alias for planId
  networkId?: string;
  network_id?: string; // Alias for networkId
  discoId?: string;
  cable_id?: string; // Alias for discoId
  meterNumber?: string;
  smartcard?: string;
  smart_card_number?: string; // Alias for smartcard
  usdcAmount?: number;
  nairaAmount?: number;
  exchangeRate?: number;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ConfirmationState;
  const { address, isConnected } = useAccount();
  
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [usdcAmount, setUsdcAmount] = useState<{
    baseUsdc: number;
    fee: number;
    totalUsdc: number;
  }>({ baseUsdc: 0, fee: 0, totalUsdc: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // Normalize the data from location state
  const normalizedState = React.useMemo(() => ({
    ...state,
    mobileNumber: state.mobileNumber || state.recipient,
    networkId: state.networkId || state.network_id,
    smartcard: state.smartcard || state.smart_card_number,
    cableId: state.discoId || state.cable_id,
    planId: state.planId || state.plan_id,
  }), [state]);
  
  const { writeContract, error } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setTransactionHash(hash);
      },
      onError: (error) => {
        console.error('Transaction error:', error);
        toast.error('Transaction failed. Please try again.');
        setProcessing(false);
      }
    }
  });
  
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash: transactionHash as `0x${string}`,
    chainId: sonicMainnet.id,
  });

  useEffect(() => {
    const loadExchangeRate = async () => {
      try {
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
        const conversion = convertNairaToUSDC(state.amount, rate);
        setUsdcAmount(conversion);
      } catch (error) {
        console.error('Failed to load exchange rate:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state?.amount) {
      loadExchangeRate();
    } else {
      navigate('/');
    }
  }, [state, navigate]);

  useEffect(() => {
    console.log('Confirmation state:', state);
    console.log('Normalized state:', normalizedState);
  }, [state, normalizedState]);

  const handleConfirm = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (usdcAmount.totalUsdc <= 0) {
      toast.error('Invalid amount');
      return;
    }

    setProcessing(true);
    
    try {
      // Convert USDC amount to wei (6 decimals for USDC)
      const amountInWei = parseUnits(usdcAmount.totalUsdc.toString(), 6);
      
      // Show loading toast
      const toastId = toast.loading('Processing transaction...');
      
      // Prepare transaction data
      const txData = {
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [TREASURY_ADDRESS as `0x${string}`, amountInWei],
        account: address,
        chain: sonicMainnet,
      };
      
      // Log the transaction data for debugging
      console.log('Initiating transaction with data:', txData);
      
      // Initiate the blockchain transaction
      writeContract(txData);
      
      // Update toast when transaction is submitted
      if (transactionHash) {
        toast.loading('Waiting for confirmation...', { id: toastId });
      }
      
    } catch (err) {
      console.error('Transaction failed:', err);
      toast.error('Transaction failed. Please try again.');
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!isConfirmed || !transactionHash || !state) return;

    // Navigate to success page immediately with pending status
    // The Success page will handle the service processing
    const pendingState = {
      status: 'pending' as const,
      service: state.service,
      provider: state.provider,
      amount: state.amount,
      recipient: state.recipient,
      mobileNumber: state.mobileNumber || state.phone,
      planId: state.planId || state.plan_id,
      networkId: state.networkId || state.network_id,
      smartCardNumber: state.smartcard || state.smart_card_number,
      cableId: state.discoId || state.cable_id,
      usdcAmount: usdcAmount.totalUsdc,
      nairaAmount: state.amount,
      exchangeRate,
      transactionHash,
      serviceProcessed: false,
    };

    console.log('Transaction confirmed, navigating to success with pending state:', pendingState);
    navigate('/success', { state: pendingState });
  }, [isConfirmed, transactionHash, state, navigate, usdcAmount.totalUsdc, exchangeRate]);

  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed. Please try again.');
      setProcessing(false);
    }
  }, [error]);

  const handleBack = () => {
    navigate(-1);
  };

  if (!state) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Confirm Payment
          </h1>
          <p className="text-muted-foreground">Review your transaction details</p>
        </div>

        <LitCard className="space-y-6">
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Service:</span>
                  <div className="bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {state.service}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Provider:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{state.provider.charAt(0)}</span>
                    </div>
                    <span className="text-foreground font-medium">{state.provider}</span>
                  </div>
                </div>
                {state.plan && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="text-foreground font-medium">{state.plan.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {state.service === 'Electricity' ? 'Meter Number:' : 
                     state.service === 'Cable' ? 'Smartcard:' : 'Phone Number:'}
                  </span>
                  <span className="text-foreground font-medium">{state.recipient}</span>
                </div>
                {state.mobileNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobile Number:</span>
                    <span className="text-foreground font-medium">{state.mobileNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground font-medium">₦{state.amount.toLocaleString()}</span>
                </div>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exchange Rate:</span>
                      <span className="text-foreground font-medium">₦{exchangeRate.toLocaleString()}/USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base USDC:</span>
                      <span className="text-foreground font-medium">{usdcAmount.baseUsdc} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-destructive">Platform Fee (2%):</span>
                      <span className="text-destructive font-medium">{usdcAmount.fee} USDC</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-foreground font-semibold">Total USDC:</span>
                      <span className="text-primary font-bold">{usdcAmount.totalUsdc} USDC</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground text-center">
                By confirming this payment, you agree to pay{' '}
                <span className="text-primary font-semibold">{usdcAmount.totalUsdc} USDC</span>{' '}
                (including 2% platform fee) for your {state.service.toLowerCase()} purchase.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <LitButton
              variant="secondary"
              onClick={handleBack}
              className="flex-1"
              disabled={processing}
            >
              Back
            </LitButton>
            <LitButton 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={loading || processing || !isConnected}
              glow
            >
              {processing ? 'Processing...' : loading ? 'Loading...' : 'Confirm & Pay'}
            </LitButton>
          </div>
        </LitCard>
      </div>
    </div>
    </>
  );
};

export default Confirmation;