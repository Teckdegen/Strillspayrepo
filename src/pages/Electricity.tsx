import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { Header } from '../components/Header';
import { LitCard } from '../components/LitCard';
import { LitSelect } from '../components/LitSelect';
import { LitInput } from '../components/LitInput';
import { LitButton } from '../components/LitButton';
import { ELECTRICITY_PROVIDERS, validateMeter, validatePhone, validateAmount } from '../constants';

const Electricity = () => {
  const navigate = useNavigate();
  const [providerId, setProviderId] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedProvider = ELECTRICITY_PROVIDERS.find(p => p.id === providerId);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!providerId) newErrors.providerId = 'Please select an electricity provider';
    if (!meterNumber) {
      newErrors.meterNumber = 'Please enter meter number';
    } else if (!validateMeter(meterNumber)) {
      newErrors.meterNumber = 'Please enter a valid 10-13 digit meter number';
    }
    if (!mobileNumber) {
      newErrors.mobileNumber = 'Please enter mobile number';
    } else if (!validatePhone(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-11 digit mobile number';
    }
    if (!amount) {
      newErrors.amount = 'Please enter amount';
    } else if (!validateAmount(parseFloat(amount))) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigate('/confirm', {
        state: {
          service: 'Electricity',
          provider: selectedProvider?.name,
          recipient: meterNumber,
          mobileNumber,
          amount: parseFloat(amount),
          providerId,
          meterNumber,
          discoId: selectedProvider?.disco_id
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
            Electricity
          </h1>
          <p className="text-muted-foreground">Top up your electricity meter</p>
        </div>

        <LitCard className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Provider
              </label>
              <LitSelect
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                options={[
                  { value: '', label: 'Choose electricity provider' },
                  ...ELECTRICITY_PROVIDERS.map((provider) => ({
                    value: provider.id,
                    label: provider.name
                  }))
                ]}
              />
              {errors.providerId && (
                <p className="text-red-500 text-sm mt-1">{errors.providerId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Meter Number
              </label>
              <LitInput
                type="text"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 10-13 digit meter number"
                maxLength={13}
              />
              {errors.meterNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.meterNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mobile Number
              </label>
              <LitInput
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter mobile number"
                maxLength={11}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount (₦)
              </label>
              <LitInput
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
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

export default Electricity;
