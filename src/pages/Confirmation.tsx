import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { toast } from 'sonner';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { fetchExchangeRate, convertNairaToUSDC } from '../constants';
import { USDC_CONTRACT_ADDRESS, TREASURY_ADDRESS, USDC_ABI, sonicMainnet } from '../config/wagmi';

interface ConfirmationState {
  service: string;
  provider: string;
  plan?: { name: string; amount: number };
  recipient: string;
  mobileNumber?: string;
  amount: number;
  planId?: string;
  networkId?: string;
  discoId?: string;
  meterNumber?: string;
  smartcard?: string;
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

  const { writeContract, data: hash, error } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash,
    chainId: sonicMainnet.id 
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
      
      writeContract({
        address: USDC_CONTRACT_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [TREASURY_ADDRESS as `0x${string}`, amountInWei],
        account: address,
        chain: sonicMainnet,
      });
    } catch (err) {
      console.error('Transaction failed:', err);
      toast.error('Transaction failed. Please try again.');
      setProcessing(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      toast.success('Payment successful! Processing your order...');
      
      // Call Easy Top Up API after successful payment
      const processOrder = async () => {
        try {
          const apiPayload = {
            service: state.service.toLowerCase(),
            network_id: state.networkId,
            disco_id: state.discoId,
            plan_id: state.planId,
            recipient: state.recipient,
            mobile_number: state.mobileNumber,
            amount: state.amount,
            transaction_hash: hash,
          };
          
          // Replace with actual Easy Top Up API endpoint
          const response = await fetch('/api/easy-topup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload),
          });
          
          if (response.ok) {
            toast.success('Service activated successfully!');
          } else {
            toast.error('Service activation failed. Please contact support.');
          }
        } catch (err) {
          console.error('API call failed:', err);
          toast.error('Service activation failed. Please contact support.');
        } finally {
          setProcessing(false);
          navigate('/');
        }
      };
      
      processOrder();
    }
  }, [isConfirmed, hash, state, navigate]);

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
    <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-6">
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="text-foreground font-medium">{state.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="text-foreground font-medium">{state.provider}</span>
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
  );
};

export default Confirmation;