import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { Header } from '../components/Header';
import { LitCard } from '../components/LitCard';
import { LitSelect } from '../components/LitSelect';
import { LitInput } from '../components/LitInput';
import { LitButton } from '../components/LitButton';
import { DECODERS, getCablePlansByDecoder, validateSmartcard } from '../constants';

const Cable = () => {
  const navigate = useNavigate();
  const [decoder, setDecoder] = useState('');
  const [planId, setPlanId] = useState('');
  const [smartcard, setSmartcard] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedDecoderData = DECODERS.find(d => d.id === decoder);
  const availablePlans = selectedDecoderData 
    ? getCablePlansByDecoder(selectedDecoderData.decoder)
    : [];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!decoder) newErrors.decoder = 'Please select a decoder';
    if (!planId) newErrors.planId = 'Please select a plan';
    if (!smartcard) {
      newErrors.smartcard = 'Please enter smartcard number';
    } else if (!validateSmartcard(smartcard)) {
      newErrors.smartcard = 'Please enter a valid 10-digit smartcard number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const selectedPlan = availablePlans.find(plan => plan.cable_id === planId);
      navigate('/confirm', {
        state: {
          service: 'Cable',
          provider: selectedDecoderData?.decoder,
          plan: selectedPlan,
          recipient: smartcard,
          amount: selectedPlan?.amount || 0,
          planId,
          smartcard
        }
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/2000af21-4568-4f7c-b886-22080a792f05.png" 
              alt="Strills Logo" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-4xl font-bold text-foreground">
              Cable TV
            </h1>
          </div>
          <p className="text-muted-foreground">Subscribe to your favorite channels</p>
        </div>

        <LitCard className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Decoder
              </label>
              <div className="relative">
                <select
                  value={decoder}
                  onChange={(e) => {
                    setDecoder(e.target.value);
                    setPlanId(''); // Reset plan when decoder changes
                  }}
                  className="w-full p-4 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer hover:bg-card/80 transition-colors"
                >
                  <option value="">Choose decoder</option>
                  {DECODERS.map((dec) => (
                    <option key={dec.id} value={dec.id} className="bg-card text-foreground">
                      {dec.decoder}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.decoder && (
                <p className="text-red-500 text-sm mt-1">{errors.decoder}</p>
              )}
              
              {/* Decoder Display */}
              {decoder && (
                <div className="mt-3 p-4 bg-gradient-primary rounded-lg border border-primary/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-primary">
                      <span className="text-primary-foreground font-bold text-xl">
                        {selectedDecoderData?.decoder.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-primary-foreground font-bold text-lg">
                        {selectedDecoderData?.decoder}
                      </p>
                      <p className="text-primary-foreground/80 text-sm">Selected Decoder</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Plan
              </label>
              <LitSelect
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                disabled={!decoder}
                options={[
                  { value: '', label: 'Choose plan' },
                  ...availablePlans.map((plan) => ({
                    value: plan.cable_id,
                    label: `${plan.name} - ₦${plan.amount.toLocaleString()}`
                  }))
                ]}
              />
              {errors.planId && (
                <p className="text-red-500 text-sm mt-1">{errors.planId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Smartcard Number
              </label>
              <LitInput
                type="text"
                value={smartcard}
                onChange={(e) => setSmartcard(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-digit smartcard number"
                maxLength={10}
              />
              {errors.smartcard && (
                <p className="text-red-500 text-sm mt-1">{errors.smartcard}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <LitButton
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Back
            </LitButton>
            <LitButton onClick={handleNext} className="flex-1">
              Next
            </LitButton>
          </div>
        </LitCard>
      </div>
    </div>
    </>
  );
};

export default Cable;
