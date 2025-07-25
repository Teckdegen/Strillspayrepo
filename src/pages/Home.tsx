import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Smartphone, Wifi, Tv, Lightbulb, Wallet } from 'lucide-react';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Airtime',
      icon: Smartphone,
      description: 'Top up your phone',
      gradient: 'from-primary to-neon-pink',
      path: '/airtime'
    },
    {
      title: 'Data',
      icon: Wifi,
      description: 'Buy data plans',
      gradient: 'from-primary to-electric-blue',
      path: '/data'
    },
    {
      title: 'Cable TV',
      icon: Tv,
      description: 'Pay for cable',
      gradient: 'from-primary to-lime-green',
      path: '/cable'
    },
    {
      title: 'Electricity',
      icon: Lightbulb,
      description: 'Pay your bills',
      gradient: 'from-neon-pink to-electric-blue',
      path: '/electricity'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-8">
            <Zap className="w-16 h-16 text-black mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold text-black">
              Strills
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-black font-medium">
            Pay with <span className="text-black font-bold">USDC</span> on{' '}
            <span className="text-black font-bold">Sonic</span>
          </p>
          
          <p className="text-lg text-black max-w-2xl mx-auto">
            The future of payments is here. Top up airtime, buy data, pay for cable TV, 
            and electricity bills using cryptocurrency on the lightning-fast Sonic network.
          </p>
        </div>

        {/* Wallet Section */}
        <div className="flex justify-center">
          <LitButton
            variant="secondary"
            size="lg"
            glow
            onClick={() => navigate('/wallet')}
            className="flex items-center space-x-3"
          >
            <Wallet className="w-6 h-6 text-black" />
            <span>View Wallet</span>
          </LitButton>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <LitCard
                key={service.title}
                className="cursor-pointer transform transition-all duration-300 hover:scale-110 border-black"
                onClick={() => navigate(service.path)}
              >
                <div className="bg-white p-6 rounded-xl mb-4 border border-black">
                  <IconComponent className="w-12 h-12 text-black mx-auto" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-black mb-2">
                    {service.title}
                  </h3>
                  <p className="text-black">
                    {service.description}
                  </p>
                </div>
              </LitCard>
            );
          })}
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-black">
            Why Choose Strills?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white border border-black rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Lightning Fast</h3>
              <p className="text-black text-sm">
                Powered by Sonic's high-speed blockchain
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white border border-black rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Instant Payments</h3>
              <p className="text-black text-sm">
                Pay with USDC and get instant confirmation
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white border border-black rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black">Low Fees</h3>
              <p className="text-black text-sm">
                Only 2% platform fee on all transactions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
