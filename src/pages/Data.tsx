import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi } from 'lucide-react';
import { Header } from '../components/Header';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { LitInput } from '../components/LitInput';
import { LitSelect } from '../components/LitSelect';
import { NETWORKS, getDataPlansByNetwork, validatePhone } from '../constants';

const Data: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    network: '',
    plan: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const networkOptions = NETWORKS.map(network => ({
    value: network.network_id,
    label: network.name
  }));

  const planOptions = useMemo(() => {
    if (!formData.network) return [];
    
    const selectedNetwork = NETWORKS.find(n => n.network_id === formData.network);
    if (!selectedNetwork) return [];

    const plans = getDataPlansByNetwork(selectedNetwork.name);
    return plans.map(plan => ({
      value: plan.plan_id,
      label: plan.available 
        ? `${plan.data_size} - ₦${plan.amount.toLocaleString()} (${plan.validity_days} days)`
        : `${plan.data_size} - Plan unavailable`,
      disabled: !plan.available
    }));
  }, [formData.network]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'network') {
      setFormData(prev => ({ ...prev, plan: '' })); // Reset plan when network changes
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.network) {
      newErrors.network = 'Please select a network';
    }

    if (!formData.plan) {
      newErrors.plan = 'Please select a data plan';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-11 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const selectedNetwork = NETWORKS.find(n => n.network_id === formData.network);
      const selectedPlan = getDataPlansByNetwork(selectedNetwork?.name || '').find(p => p.plan_id === formData.plan);
      
      navigate('/confirm', {
        state: {
          service: 'data',
          provider: selectedNetwork?.name,
          plan: selectedPlan,
          recipient: formData.phone,
          amount: selectedPlan?.amount,
          network_id: formData.network,
          plan_id: formData.plan
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
              src="/lovable-uploads/2000af21-4568-4f7c-b886-22080a792f05.png" 
              alt="Strills Logo" 
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-4xl font-extrabold text-foreground">
              Data
            </h1>
          </div>
          <p className="text-muted-foreground">
            Buy data plans with USDC
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
                className="w-full p-4 bg-card border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer hover:bg-card/80 transition-colors"
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
              <div className="mt-3 p-4 bg-gradient-primary rounded-lg border border-primary/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shadow-glow-primary">
                    <span className="text-primary-foreground font-bold text-xl">
                      {NETWORKS.find(n => n.network_id === formData.network)?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-primary-foreground font-bold text-lg">
                      {NETWORKS.find(n => n.network_id === formData.network)?.name}
                    </p>
                    <p className="text-primary-foreground/80 text-sm">Selected Network Provider</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {formData.network && (
            <LitSelect
              label="Data Plan"
              value={formData.plan}
              onChange={(e) => handleInputChange('plan', e.target.value)}
              options={[
                { value: '', label: 'Select Plan' },
                ...planOptions
              ]}
              error={errors.plan}
            />
          )}

          <LitInput
            label="Phone Number"
            type="tel"
            placeholder="08012345678"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
          />

          {formData.plan && (() => {
            const selectedNetwork = NETWORKS.find(n => n.network_id === formData.network);
            const selectedPlan = getDataPlansByNetwork(selectedNetwork?.name || '').find(p => p.plan_id === formData.plan);
            return selectedPlan && selectedPlan.available ? (
              <div className="text-sm text-muted-foreground bg-card border border-border p-4 rounded-lg">
                <p className="mb-2">• Plan: {selectedPlan.data_size}</p>
                <p className="mb-2">• Amount: ₦{selectedPlan.amount.toLocaleString()}</p>
                <p className="mb-2">• Validity: {selectedPlan.validity_days} days</p>
                <p className="mb-2">• Type: {selectedPlan.type}</p>
                <p>• 2% platform fee applies</p>
              </div>
            ) : null;
          })()}

          <LitButton
            variant="primary"
            size="lg"
            glow
            onClick={handleNext}
            className="w-full"
            disabled={!formData.network || !formData.plan || !formData.phone}
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

export default Data;
