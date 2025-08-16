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
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/2000af21-4568-4f7c-b886-22080a792f05.png" 
              alt="Strills Logo" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-4xl font-bold text-foreground">
              Electricity
            </h1>
          </div>
          <p className="text-muted-foreground">Top up your electricity meter</p>
        </div>

        <LitCard className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Provider
              </label>
              <div className="relative">
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="w-full p-4 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer hover:bg-card/80 transition-colors"
                >
                  <option value="">Choose electricity provider</option>
                  {ELECTRICITY_PROVIDERS.map((provider) => (
                    <option key={provider.id} value={provider.id} className="bg-card text-foreground">
                      {provider.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.providerId && (
                <p className="text-red-500 text-sm mt-1">{errors.providerId}</p>
              )}
              
              {/* Provider Display */}
              {providerId && (
                <div className="mt-3 p-4 bg-gradient-primary rounded-lg border border-primary/20 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-primary">
                      <span className="text-primary-foreground font-bold text-xl">
                        {selectedProvider?.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-primary-foreground font-bold text-lg">
                        {selectedProvider?.name}
                      </p>
                      <p className="text-primary-foreground/80 text-sm">Selected Provider</p>
                    </div>
                  </div>
                </div>
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
