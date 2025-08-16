import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Zap, ArrowLeft } from 'lucide-react';
import { LitButton } from './LitButton';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo/Back */}
          <div className="flex items-center space-x-4">
            {!isHomePage && (
              <LitButton
                variant="secondary"
                onClick={() => navigate(-1)}
                className="p-2 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </LitButton>
            )}
            
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <img 
                src="/lovable-uploads/2000af21-4568-4f7c-b886-22080a792f05.png" 
                alt="Strills Logo" 
                className="w-10 h-10 rounded-xl shadow-glow-primary"
              />
              <h1 className="text-2xl font-bold text-foreground">Strills</h1>
            </div>
          </div>

          {/* Right side - Connect Button */}
          <div className="flex items-center space-x-4">
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full'
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};