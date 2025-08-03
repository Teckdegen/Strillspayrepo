import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Smartphone, Wifi, Tv, Lightbulb, Wallet, Star, Shield, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { ServiceCard } from '../components/ServiceCard';
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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-radial pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              {/* Main Title */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight">
                  The Future of
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    Digital Payments
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Pay for services with <span className="text-primary font-bold">USDC</span> on the lightning-fast{' '}
                  <span className="text-secondary font-bold">Sonic</span> blockchain
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <LitButton
                  variant="success"
                  size="lg"
                  glow
                  onClick={() => navigate('/wallet')}
                  className="flex items-center space-x-3 px-8 py-4"
                >
                  <Wallet className="w-6 h-6" />
                  <span>Connect Wallet</span>
                </LitButton>
                
                <LitButton
                  variant="secondary"
                  size="lg"
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center space-x-3 px-8 py-4"
                >
                  <Star className="w-6 h-6" />
                  <span>Explore Services</span>
                </LitButton>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2%</div>
                  <div className="text-sm text-muted-foreground">Platform Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">~1s</div>
                  <div className="text-sm text-muted-foreground">Transaction Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from our range of digital services, all payable with cryptocurrency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <ServiceCard
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  onClick={() => navigate(service.path)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Why Choose Strills?
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the next generation of payment solutions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-primary">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Transactions complete in seconds on Sonic's high-performance blockchain
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-primary">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Military-grade encryption and blockchain security for all transactions
                </p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-primary">
                  <Star className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Low Fees</h3>
                <p className="text-muted-foreground">
                  Only 2% platform fee with no hidden charges or surprises
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
