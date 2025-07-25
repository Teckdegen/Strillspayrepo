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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-8">
            <Zap className="w-16 h-16 text-white mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold text-white">
              Strills
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-white font-medium">
            Pay with <span className="text-white font-bold">USDC</span> on{' '}
            <span className="text-white font-bold">Sonic</span>
          </p>
          
          <p className="text-lg text-white max-w-2xl mx-auto">
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
            <Wallet className="w-6 h-6 text-white" />
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
                className="cursor-pointer transform transition-all duration-300 hover:scale-110 border-white"
                onClick={() => navigate(service.path)}
              >
                <div className="bg-black p-6 rounded-xl mb-4 border border-white">
                  <IconComponent className="w-12 h-12 text-white mx-auto" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-white">
                    {service.description}
                  </p>
                </div>
              </LitCard>
            );
          })}
        </div>

        {/* Features */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Why Choose Strills?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-black border border-white rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Lightning Fast</h3>
              <p className="text-white text-sm">
                Powered by Sonic's high-speed blockchain
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-black border border-white rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant Payments</h3>
              <p className="text-white text-sm">
                Pay with USDC and get instant confirmation
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-black border border-white rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Low Fees</h3>
              <p className="text-white text-sm">
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
