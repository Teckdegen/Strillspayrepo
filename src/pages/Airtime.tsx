import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone } from 'lucide-react';
import { Header } from '../components/Header';
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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-radial flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/53059c35-18e1-42b0-b269-b56c3e9848a8.png" 
              alt="Strills Logo" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-4xl font-extrabold text-foreground">
              Airtime
            </h1>
          </div>
          <p className="text-muted-foreground">
            Top up your phone with USDC
          </p>
        </div>

        {/* Form */}
        <LitCard className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Network</label>
            <div className="relative">
              <select
                value={formData.network}
                onChange={(e) => handleInputChange('network', e.target.value)}
                className="w-full p-4 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Select Network</option>
                {NETWORKS.map((network) => (
                  <option key={network.network_id} value={network.network_id} className="bg-card text-foreground">
                    {network.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.network && (
              <p className="text-sm text-destructive">{errors.network}</p>
            )}
            
            {/* Network Display */}
            {formData.network && (
              <div className="mt-3 p-3 bg-gradient-primary rounded-lg border border-primary/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {NETWORKS.find(n => n.network_id === formData.network)?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-primary-foreground font-semibold">
                      {NETWORKS.find(n => n.network_id === formData.network)?.name}
                    </p>
                    <p className="text-primary-foreground/80 text-sm">Selected Network</p>
                  </div>
                </div>
              </div>
            )}
          </div>

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

          <div className="text-sm text-muted-foreground bg-card border border-border p-4 rounded-lg">
            <p className="mb-2">• Minimum amount: ₦50</p>
            <p className="mb-2">• 2% platform fee applies</p>
            <p>• Instant delivery upon confirmation</p>
          </div>

          <LitButton
            variant="primary"
            size="lg"
            glow
            onClick={handleNext}
            className="w-full"
          >
            Next
          </LitButton>
        </LitCard>

        {/* Navigation */}
        <div className="flex justify-center">
          <LitButton
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </LitButton>
        </div>
      </div>
    </div>
    </>
  );
};

export default Airtime;
