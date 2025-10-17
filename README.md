# StrillsPay - Blockchain-Based Bill Payment Platform

## 🚀 Project Overview

StrillsPay is a decentralized bill payment platform that enables users to pay for Nigerian services (airtime, data, cable TV, electricity) using USDC cryptocurrency on the Sonic blockchain. The platform acts as a bridge between blockchain payments and traditional service providers.

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI primitives + custom shadcn/ui components
- **Routing:** React Router DOM v6
- **State Management:** React hooks + React Query (TanStack Query)
- **Web3 Integration:** Wagmi v2 + RainbowKit v2 + Viem v2
- **Notifications:** Sonner toast library
- **Form Validation:** React Hook Form + Zod

**Blockchain:**
- **Network:** Sonic Mainnet (Sepolia testnet for demo)
- **Token:** USDC (ERC-20)
- **Smart Contracts:** ERC-20 transfer functionality
- **Wallet Support:** Multiple wallets via RainbowKit (MetaMask, WalletConnect, etc.)

**Backend/API (To Be Implemented):**
- Bill payment provider API integration
- Service verification endpoints
- Transaction processing

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components (buttons, cards, etc.)
│   ├── Header.tsx      # Main navigation header with wallet connect
│   ├── ServiceCard.tsx # Service display cards
│   ├── LitButton.tsx   # Custom styled button with glow effects
│   ├── LitCard.tsx     # Custom styled card component
│   ├── LitInput.tsx    # Custom styled input component
│   ├── LitSelect.tsx   # Custom styled select component
│   └── PaymentForm.tsx # Payment confirmation component
│
├── pages/              # Route-based page components
│   ├── Index.tsx       # Home/landing page (/)
│   ├── Airtime.tsx     # Airtime purchase page (/airtime)
│   ├── Data.tsx        # Data bundle purchase page (/data)
│   ├── Cable.tsx       # Cable TV subscription page (/cable)
│   ├── Electricity.tsx # Electricity recharge page (/electricity)
│   ├── Confirmation.tsx # Payment confirmation page (/confirm)
│   ├── Success.tsx     # Transaction success page (/success)
│   ├── Wallet.tsx      # Wallet management page (/wallet)
│   └── NotFound.tsx    # 404 error page
│
├── config/             # Configuration files
│   ├── wagmi.ts        # Wagmi & blockchain configuration
│   └── wallet.ts       # Wallet connection configuration
│
├── constants.ts        # Service data, plans, providers, utilities
├── index.css          # Global styles & design tokens
├── App.tsx            # Main app component with routing
└── main.tsx           # React entry point
```

## 🎨 Design System

The platform uses a comprehensive design system defined in `index.css` and `tailwind.config.ts`:

### Color Tokens (HSL-based)
```css
--background: 222.2 84% 4.9%    /* Dark background */
--foreground: 210 40% 98%       /* Light text */
--primary: 217.2 91.2% 59.8%    /* Brand blue */
--primary-glow: 217 91% 70%     /* Lighter blue for effects */
```

### Gradients
- `--gradient-radial`: Radial background gradient
- `--gradient-primary`: Primary color gradient for cards/buttons

### Components
- All components use semantic tokens (no hardcoded colors)
- Consistent spacing and typography scale
- Glassmorphism effects with backdrop blur
- Glow effects on interactive elements

## 🔄 User Flow & Payment Process

### Complete Payment Journey

```
1. User Selection → 2. Form Input → 3. Confirmation → 4. Blockchain TX → 5. Service API → 6. Success
```

### Detailed Flow by Service

#### **1. Airtime Purchase**
1. User navigates to `/airtime`
2. Selects network (MTN, Airtel, Glo, 9Mobile) from `NETWORKS` constant
3. Enters phone number (validated: 10-11 digits)
4. Enters amount (minimum ₦50)
5. Clicks "Next" → navigates to `/confirm` with state:
   ```javascript
   {
     service: 'airtime',
     provider: 'MTN',
     recipient: '08012345678',
     amount: 1000,
     network_id: '1'
   }
   ```

#### **2. Data Bundle Purchase**
1. User navigates to `/data`
2. Selects network from `NETWORKS`
3. Selects data plan from filtered `DATA_PLANS` (by network)
4. Enters phone number
5. Plan auto-fills amount from `DATA_PLANS` array
6. Navigates to `/confirm` with plan details

#### **3. Cable TV Subscription**
1. User navigates to `/cable`
2. Selects decoder (GOTV, DSTV, STARTIMES) from `DECODERS`
3. Selects plan from filtered `CABLE_PLANS` (by decoder)
4. Enters smartcard number (validated: 10 digits)
5. Navigates to `/confirm` with subscription details

#### **4. Electricity Recharge**
1. User navigates to `/electricity`
2. Selects DISCO provider from `ELECTRICITY_PROVIDERS`
3. Selects meter type (Prepaid/Postpaid)
4. Enters meter number (validated: 10-13 digits)
5. Enters amount to recharge
6. Navigates to `/confirm` with recharge details

## 💳 Payment Confirmation Flow (`/confirm`)

### Step-by-Step Process

**1. Data Reception:**
```typescript
const location = useLocation();
const {
  service,
  provider,
  recipient,
  amount,
  // ... other service-specific fields
} = location.state;
```

**2. Exchange Rate Calculation:**
```typescript
// Fetch USDT/NGN rate from CoinGecko API
const rate = await fetchExchangeRate();

// Convert Naira to USDC with 2% platform fee
const { baseUsdc, fee, totalUsdc } = convertNairaToUSDC(nairaAmount, rate);
```

**3. Wallet Connection Check:**
- Verify user has connected wallet via Wagmi
- Check USDC balance using `readContract`:
  ```typescript
  const balance = await readContract(wagmiConfig, {
    address: USDC_CONTRACT_ADDRESS,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  });
  ```

**4. User Confirmation Display:**
Shows summary with:
- Service details (provider, plan, recipient)
- Naira amount
- USDC conversion (base + fee)
- Exchange rate
- Total USDC required

**5. Transaction Initiation:**
User clicks "Pay with USDC" button:
```typescript
const hash = await writeContract(wagmiConfig, {
  address: USDC_CONTRACT_ADDRESS,
  abi: USDC_ABI,
  functionName: 'transfer',
  args: [TREASURY_ADDRESS, parseUnits(totalUsdc.toString(), 6)], // USDC has 6 decimals
});
```

**6. Transaction Monitoring:**
```typescript
// Wait for blockchain confirmation
const receipt = await waitForTransactionReceipt(wagmiConfig, {
  hash: hash,
});

// Navigate to success page with transaction data
navigate('/success', {
  state: {
    transactionHash: hash,
    service,
    provider,
    amount: nairaAmount,
    usdcAmount: totalUsdc,
    recipient,
    timestamp: new Date().toISOString(),
    status: 'pending', // Blockchain confirmed, service pending
  }
});
```

## ✅ Success Page Flow (`/success`)

### Transaction States

1. **Initial State (pending):**
   - Blockchain transaction confirmed
   - Service API not yet called
   - Shows transaction hash, amount, recipient

2. **Processing State:**
   - User clicks "Process Service" button
   - Calls bill payment provider API
   - Shows loading spinner

3. **Success State:**
   - Service API returns success
   - Shows service confirmation details
   - Provides receipt/token (for electricity)

4. **Failed State:**
   - Service API fails
   - Shows error message
   - Offers retry option

### Service API Integration (To Implement)

```typescript
// Example service processing after blockchain confirmation
const processService = async () => {
  const response = await fetch('/api/process-service', {
    method: 'POST',
    body: JSON.stringify({
      service: transaction.service,
      provider: transaction.provider,
      recipient: transaction.recipient,
      amount: transaction.amount,
      transactionHash: transaction.transactionHash,
      // Service-specific fields
      network: transaction.network,
      plan: transaction.plan,
      smartcard: transaction.smartcard,
      meter: transaction.meter,
    }),
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Update UI to show success
    // Store service reference/token
  } else {
    // Show error, offer retry
  }
};
```

## 🔌 Bill Payment API Integration Guide

### API Provider Structure (Based on Provided Documentation)

#### **Endpoints to Implement:**

**1. Get Service Information:**
```
POST /CableTV/getCableTVInfo
POST /DataPurchase/getDataInfo
POST /Airtime/getAirtimeInfo
POST /Electricity/getElectricityInfo
```
Response caches providers and plans (30-60 min TTL)

**2. Verify Customer (Cable & Electricity only):**
```
POST /CableTV/verifyCustomer
POST /Electricity/verifyCustomer
```
Returns customer name for confirmation before payment

**3. Purchase Service:**
```
POST /CableTV/buyCableTV
POST /DataPurchase/buyData
POST /Airtime/buyAirtime
POST /Electricity/buyElectricity
```

### Request Structure

**Common Fields:**
```json
{
  "appId": "{BUSINESS_CODE}",
  "requestId": "<uuid>",
  "businessCode": "{BUSINESS_CODE}",
  "reference": "BOT-<uuid>"
}
```

**Service-Specific Examples:**

**Data Purchase:**
```json
{
  "appId": "{BUSINESS_CODE}",
  "requestId": "<uuid>",
  "businessCode": "{BUSINESS_CODE}",
  "network": "mtn",
  "providerPlanCode": "PSPLAN_1410",
  "phoneNumber": "08038892993",
  "reference": "STRILLS-<uuid>"
}
```

**Cable TV:**
```json
{
  "appId": "{BUSINESS_CODE}",
  "requestId": "<uuid>",
  "businessCode": "{BUSINESS_CODE}",
  "providerCode": "dstv",
  "providerPlanCode": "cwconfamextraview",
  "phoneNumber": "08038847485",
  "smartCardNumber": "8061700508",
  "customerName": "Umaru Akpan",
  "reference": "STRILLS-<uuid>"
}
```

**Electricity:**
```json
{
  "appId": "{BUSINESS_CODE}",
  "requestId": "<uuid>",
  "businessCode": "{BUSINESS_CODE}",
  "providerCode": "eko-electric",
  "providerPlanCode": "prepaid",
  "meterNumber": "02010000*****",
  "customerName": "MARK OKAFOR",
  "phoneNumber": "080388388829",
  "reference": "STRILLS-<uuid>",
  "amount": 1000
}
```

### Transaction Lifecycle

**1. Database Transaction Record:**
```typescript
interface Transaction {
  id: string;
  userId: string;
  service: 'airtime' | 'data' | 'cable' | 'electricity';
  provider: string;
  plan?: string;
  amount: number;
  usdcAmount: number;
  recipient: string;
  blockchainHash: string;
  providerReference?: string;
  providerCode?: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  requestId: string;
  createdAt: string;
  updatedAt: string;
}
```

**2. Processing Flow:**
```
a. Blockchain TX confirmed → Create DB record (status: pending)
b. Generate requestId (UUID) and reference (STRILLS-{uuid})
c. Call provider verify endpoint (if applicable)
d. Update status to 'processing'
e. Call provider buy endpoint
f. On success:
   - Save provider reference/code
   - Update status to 'success'
   - Send receipt to user
g. On failure:
   - Update status to 'failed'
   - Log error
   - Notify admin
   - Offer refund/retry
```

**3. Idempotency:**
- Use same `reference` for retries
- Check DB before duplicate processing
- Store full request/response for audits

## 🔐 Smart Contract Configuration

### USDC Contract Details

**Address:** `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` (Sonic Mainnet)
**Treasury:** `0x3a5149Ae34B99087fF51EC374EeC371623789Cd0`

**ABI Functions Used:**
```javascript
[
  {
    name: 'transfer',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'balanceOf',
    inputs: [{ name: '_owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }]
  }
]
```

### Network Configuration

```typescript
const sonicMainnet = {
  id: 11155111,
  name: 'Sonic',
  nativeCurrency: { decimals: 18, name: 'Sepolia', symbol: 'ETH' },
  rpcUrls: {
    default: { http: ['https://eth-sepolia.public.blastapi.io'] }
  },
  blockExplorers: {
    default: { name: 'Sonic Explorer', url: 'https://sonicscan.org' }
  }
};
```

## 📊 Data Models & Constants

### Service Plans Data

Located in `src/constants.ts`:

- **NETWORKS:** 4 mobile networks (MTN, Airtel, Glo, 9Mobile)
- **DATA_PLANS:** 80+ data plans with IDs, sizes, types, amounts
- **CABLE_PLANS:** 30+ cable TV packages (GOTV, DSTV, STARTIMES)
- **ELECTRICITY_PROVIDERS:** 8 DISCO providers
- **DECODERS:** 3 decoder types

### Validation Functions

```typescript
validatePhone(phone: string): boolean     // 10-11 digits
validateSmartcard(smartcard: string): boolean  // 10 digits
validateMeter(meter: string): boolean     // 10-13 digits
validateAmount(amount: number): boolean   // > 0
```

## 🔧 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.provider.com
VITE_BUSINESS_CODE=your_business_code
VITE_APP_ID=your_app_id

# WalletConnect
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Blockchain
VITE_USDC_CONTRACT_ADDRESS=0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
VITE_TREASURY_ADDRESS=0x3a5149Ae34B99087fF51EC374EeC371623789Cd0

# Optional: API Keys for rate limiting bypass
VITE_COINGECKO_API_KEY=your_coingecko_key
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ or Bun
- Web3 wallet (MetaMask recommended)
- USDC on Sonic network for testing

### Installation Steps

```bash
# Clone repository
git clone <repository-url>
cd strillspay

# Install dependencies
npm install
# or
bun install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
# or
bun dev

# Build for production
npm run build
# or
bun run build
```

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Wallet connection (multiple wallet types)
- [ ] Network switching
- [ ] USDC balance display
- [ ] Form validation (all services)
- [ ] Exchange rate fetching & caching
- [ ] Transaction signing & confirmation
- [ ] Success/error states
- [ ] Mobile responsiveness

### Integration Testing
- [ ] End-to-end payment flow (all services)
- [ ] API error handling
- [ ] Transaction retry logic
- [ ] Receipt generation
- [ ] Blockchain explorer links

### Security Testing
- [ ] Input sanitization
- [ ] Amount validation (prevent overflow)
- [ ] Transaction replay protection
- [ ] API authentication
- [ ] Private key security

## 📈 Future Enhancements

### Phase 1 (Core)
- [ ] Backend API implementation
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Transaction history

### Phase 2 (Features)
- [ ] Multi-currency support (ETH, BTC)
- [ ] Recurring payments
- [ ] Bulk payments
- [ ] Discount codes

### Phase 3 (Advanced)
- [ ] Mobile app (React Native)
- [ ] Telegram bot integration
- [ ] Admin dashboard
- [ ] Analytics & reporting
- [ ] Referral system

## 🐛 Known Issues & TODOs

1. **Service API Integration:** Currently mocked - needs real provider integration
2. **Error Recovery:** Implement automatic retry with exponential backoff
3. **Receipt Storage:** Add local/cloud storage for transaction receipts
4. **Network Status:** Add blockchain network status monitoring
5. **Gas Optimization:** Implement batch transfers for multiple payments

## 📝 API Implementation Priority

### High Priority
1. Data purchase API (most common)
2. Airtime API
3. Electricity API (with token return)
4. Cable TV API (with verification)

### Implementation Order
1. Set up backend server (Node.js/Express or Edge Functions)
2. Implement provider info caching (Redis/Memory)
3. Add verification endpoints
4. Implement purchase endpoints with idempotency
5. Add webhook handlers for provider callbacks
6. Implement reconciliation cron jobs

## 🔗 Key Resources

- **Wagmi Docs:** https://wagmi.sh
- **RainbowKit:** https://rainbowkit.com
- **Viem:** https://viem.sh
- **Tailwind CSS:** https://tailwindcss.com
- **Radix UI:** https://radix-ui.com
- **CoinGecko API:** https://coingecko.com/api

## 📄 License

[Your License Here]

## 👥 Contributing

[Contributing Guidelines Here]

---

**Built with ❤️ for the future of payments**
