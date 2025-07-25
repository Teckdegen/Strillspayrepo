import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { fetchExchangeRate, convertNairaToUSDC } from '../constants';

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
  
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [usdcAmount, setUsdcAmount] = useState<{
    baseUsdc: number;
    fee: number;
    totalUsdc: number;
  }>({ baseUsdc: 0, fee: 0, totalUsdc: 0 });
  const [loading, setLoading] = useState(true);

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

  const handleConfirm = () => {
    // Here you would implement the actual payment logic
    // For now, we'll just show a success message
    alert('Payment feature coming soon! Transaction details have been confirmed.');
    navigate('/');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Confirm Payment
          </h1>
          <p className="text-white">Review your transaction details</p>
        </div>

        <LitCard className="space-y-6 border-white">
          <div className="space-y-4">
            <div className="border-b border-white pb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Transaction Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white">Service:</span>
                  <span className="text-white font-medium">{state.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Provider:</span>
                  <span className="text-white font-medium">{state.provider}</span>
                </div>
                {state.plan && (
                  <div className="flex justify-between">
                    <span className="text-white">Plan:</span>
                    <span className="text-white font-medium">{state.plan.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white">
                    {state.service === 'Electricity' ? 'Meter Number:' : 
                     state.service === 'Cable' ? 'Smartcard:' : 'Phone Number:'}
                  </span>
                  <span className="text-white font-medium">{state.recipient}</span>
                </div>
                {state.mobileNumber && (
                  <div className="flex justify-between">
                    <span className="text-white">Mobile Number:</span>
                    <span className="text-white font-medium">{state.mobileNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="border-b border-white pb-4">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white">Amount:</span>
                  <span className="text-white font-medium">₦{state.amount.toLocaleString()}</span>
                </div>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white">Exchange Rate:</span>
                      <span className="text-white font-medium">₦{exchangeRate.toLocaleString()}/USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white">Base USDC:</span>
                      <span className="text-white font-medium">{usdcAmount.baseUsdc} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-500">Platform Fee (2%):</span>
                      <span className="text-red-500 font-medium">{usdcAmount.fee} USDC</span>
                    </div>
                    <div className="flex justify-between border-t border-white pt-2">
                      <span className="text-white font-semibold">Total USDC:</span>
                      <span className="text-white font-bold">{usdcAmount.totalUsdc} USDC</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="bg-black border border-white rounded-lg p-4">
              <p className="text-sm text-white text-center">
                By confirming this payment, you agree to pay{' '}
                <span className="text-white font-semibold">{usdcAmount.totalUsdc} USDC</span>{' '}
                (including 2% platform fee) for your {state.service.toLowerCase()} purchase.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <LitButton
              variant="secondary"
              onClick={handleBack}
              className="flex-1 text-white"
            >
              Back
            </LitButton>
            <LitButton 
              onClick={handleConfirm} 
              className="flex-1 text-white"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Confirm & Pay'}
            </LitButton>
          </div>
        </LitCard>
      </div>
    </div>
  );
};

export default Confirmation;
