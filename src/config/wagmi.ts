// Sonic Mainnet Configuration
export const sonicMainnet = {
  id: 146,
  name: 'Sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sonic Explorer',
      url: 'https://sonicscan.org',
    },
  },
};

// USDC Contract Address on Sonic Mainnet (placeholder - needs actual address)
export const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // USDC on Sonic

// Treasury Address (placeholder - needs actual address)
export const TREASURY_ADDRESS = '0x3a5149Ae34B99087fF51EC374EeC371623789Cd0'; // Treasury wallet

// USDC ABI for transfer and balanceOf functions
export const USDC_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  }
] as const;

// USDC Conversion Utilities
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn';
export const PLATFORM_FEE_PERCENTAGE = 0.02; // 2% platform fee

export interface USDCConversion {
  nairaAmount: number;
  baseUSDC: number;
  fee: number;
  totalUSDC: number;
  rate: number;
}

export const calculateUSDCAmount = (nairaAmount: number, usdtNgnRate: number): USDCConversion => {
  const baseUSDC = nairaAmount / usdtNgnRate;
  const fee = baseUSDC * PLATFORM_FEE_PERCENTAGE;
  const totalUSDC = baseUSDC + fee;
  
  return {
    nairaAmount,
    baseUSDC,
    fee,
    totalUSDC,
    rate: usdtNgnRate
  };
};

// Cache for exchange rate (5 minutes)
let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getUSDTNGNRate = async (): Promise<number> => {
  const now = Date.now();
  
  // Check cache
  if (cachedRate && (now - cachedRate.timestamp) < CACHE_DURATION) {
    return cachedRate.rate;
  }
  
  try {
    const response = await fetch(COINGECKO_API_URL);
    const data = await response.json();
    const rate = data.tether.ngn;
    
    // Cache the rate
    cachedRate = { rate, timestamp: now };
    
    // Also store in localStorage as backup
    localStorage.setItem('strills_usdt_rate', JSON.stringify(cachedRate));
    
    return rate;
  } catch (error) {
    console.error('Failed to fetch USDT/NGN rate:', error);
    
    // Try to use cached rate from localStorage
    const stored = localStorage.getItem('strills_usdt_rate');
    if (stored) {
      const parsedStored = JSON.parse(stored);
      if ((now - parsedStored.timestamp) < (24 * 60 * 60 * 1000)) { // 24 hours max
        return parsedStored.rate;
      }
    }
    
    // Fallback rate (approximate)
    return 1650; // Fallback USDT/NGN rate
  }
};
