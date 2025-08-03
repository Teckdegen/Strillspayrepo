import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ArrowLeft, Wallet as WalletIcon, Copy, ExternalLink } from 'lucide-react';
import { Header } from '../components/Header';
import { LitCard } from '../components/LitCard';
import { LitButton } from '../components/LitButton';
import { USDC_CONTRACT_ADDRESS } from '../config/wagmi';
import { toast } from 'sonner';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  
  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_CONTRACT_ADDRESS as `0x${string}`,
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://sonicscan.org/address/${address}`, '_blank');
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
            <WalletIcon className="w-12 h-12 text-primary mr-3" />
            <h1 className="text-4xl font-extrabold text-foreground">
              Wallet
            </h1>
          </div>
        </div>

        {/* Wallet Info */}
        {isConnected ? (
          <LitCard className="space-y-6">
            {/* Address */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">
                Wallet Address
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-4 py-3 bg-input border-2 border-primary rounded-lg text-foreground">
                  {address ? formatAddress(address) : 'Not connected'}
                </div>
                <LitButton
                  variant="secondary"
                  size="sm"
                  onClick={copyAddress}
                  className="p-3"
                >
                  <Copy className="w-4 h-4" />
                </LitButton>
                <LitButton
                  variant="success"
                  size="sm"
                  onClick={openExplorer}
                  className="p-3"
                >
                  <ExternalLink className="w-4 h-4" />
                </LitButton>
              </div>
            </div>

            {/* USDC Balance */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">
                USDC Balance
              </label>
              <div className="px-4 py-6 bg-gradient-primary rounded-lg text-center shadow-glow-primary">
                <div className="text-3xl font-bold text-primary-foreground">
                  {usdcBalance ? `${parseFloat(usdcBalance.formatted).toFixed(2)}` : '0.00'}
                </div>
                <div className="text-sm text-primary-foreground/80 mt-1">
                  USDC on Sonic
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">
                Network
              </label>
              <div className="px-4 py-3 bg-input border-2 border-primary rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Sonic Mainnet</span>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Chain ID: 146
                </div>
              </div>
            </div>

            {/* Connect Button */}
            <div className="flex justify-center">
              <ConnectButton
                chainStatus="icon"
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
              />
            </div>
          </LitCard>
        ) : (
          <LitCard className="text-center space-y-6">
            <div className="space-y-4">
              <WalletIcon className="w-16 h-16 text-muted-foreground mx-auto" />
              <h2 className="text-2xl font-bold text-accent">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground">
                Connect your wallet to view your USDC balance and start making payments
              </p>
            </div>
            
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </LitCard>
        )}

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

export default Wallet;