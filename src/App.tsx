import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { sonicMainnet } from './config/wagmi';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

// Pages
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Cable from './pages/Cable';
import Electricity from './pages/Electricity';
import Confirmation from './pages/Confirmation';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const config = getDefaultConfig({
  appName: 'Strills',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'fallback-project-id',
  chains: [sonicMainnet] as any,
  ssr: false,
});

const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  enableAnalytics: true,
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': 'Inter, sans-serif',
    '--w3m-accent': '#3b82f6',
  },
});

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Component
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Toaster 
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '2px solid hsl(var(--primary))',
                color: 'hsl(var(--card-foreground))',
                boxShadow: 'var(--glow-primary)',
              },
            }}
          />
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/airtime" element={<Airtime />} />
                  <Route path="/data" element={<Data />} />
                  <Route path="/cable" element={<Cable />} />
                  <Route path="/electricity" element={<Electricity />} />
                  <Route path="/confirm" element={<Confirmation />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
