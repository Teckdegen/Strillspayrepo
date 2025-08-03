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
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Cable TV
          </h1>
          <p className="text-muted-foreground">Subscribe to your favorite channels</p>
        </div>

        <LitCard className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Decoder
              </label>
              <LitSelect
                value={decoder}
                onChange={(e) => {
                  setDecoder(e.target.value);
                  setPlanId(''); // Reset plan when decoder changes
                }}
                options={[
                  { value: '', label: 'Choose decoder' },
                  ...DECODERS.map((dec) => ({
                    value: dec.id,
                    label: dec.decoder
                  }))
                ]}
              />
              {errors.decoder && (
                <p className="text-red-500 text-sm mt-1">{errors.decoder}</p>
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
