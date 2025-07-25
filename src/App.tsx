import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { sonicMainnet } from './config/wagmi';

// Pages
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Cable from './pages/Cable';
import Electricity from './pages/Electricity';
import NotFound from './pages/NotFound';

const config = getDefaultConfig({
  appName: 'Strills',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'fallback-project-id',
  chains: [sonicMainnet] as any,
  ssr: false,
});

const queryClient = new QueryClient();

const App = () => (
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/airtime" element={<Airtime />} />
            <Route path="/data" element={<Data />} />
            <Route path="/cable" element={<Cable />} />
            <Route path="/electricity" element={<Electricity />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
