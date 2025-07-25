import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { LitInput } from '../components/LitInput';
import { LitSelect } from '../components/LitSelect';
import { NETWORKS, validatePhone, validateAmount } from '../constants';

const Airtime: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const networkOptions = NETWORKS.map(network => ({
    value: network.network_id,
    label: network.name
  }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.network) {
      newErrors.network = 'Please select a network';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-11 digits)';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (!validateAmount(parseFloat(formData.amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) < 50) {
      newErrors.amount = 'Minimum amount is ₦50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const selectedNetwork = NETWORKS.find(n => n.network_id === formData.network);
      navigate('/confirm', {
        state: {
          service: 'airtime',
          provider: selectedNetwork?.name,
          recipient: formData.phone,
          amount: parseFloat(formData.amount),
          network_id: formData.network
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Smartphone className="w-12 h-12 text-black mr-3" />
            <h1 className="text-4xl font-extrabold text-black">
              Airtime
            </h1>
          </div>
          <p className="text-black">
            Top up your phone with USDC
          </p>
        </div>

        {/* Form */}
        <LitCard className="space-y-6 border-black">
          <LitSelect
            label="Network"
            value={formData.network}
            onChange={(e) => handleInputChange('network', e.target.value)}
            options={[
              { value: '', label: 'Select Network' },
              ...networkOptions
            ]}
            error={errors.network}
          />

          <LitInput
            label="Phone Number"
            type="tel"
            placeholder="08012345678"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
          />

          <LitInput
            label="Amount (₦)"
            type="number"
            placeholder="1000"
            min="50"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            error={errors.amount}
          />

          <div className="text-sm text-black bg-white p-4 rounded-lg border border-black">
            <p className="mb-2">• Minimum amount: ₦50</p>
            <p className="mb-2">• 2% platform fee applies</p>
            <p>• Instant delivery upon confirmation</p>
          </div>

          <LitButton
            variant="primary"
            size="lg"
            glow
            onClick={handleNext}
            className="w-full text-black"
          >
            Next
          </LitButton>
        </LitCard>

        {/* Navigation */}
        <div className="flex justify-center">
          <LitButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-black"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
            <span>Back to Home</span>
          </LitButton>
        </div>
      </div>
    </div>
  );
};

export default Airtime;
