// Strills Service Data Constants

export interface Network {
  id: string;
  name: string;
  network_id: string;
}

export interface DataPlan {
  plan_id: string;
  data_size: string;
  network: string;
  type: string;
  amount: number;
  validity_days: number;
  available: boolean;
}

export interface CablePlan {
  cable_id: string;
  name: string;
  amount: number;
  decoder: string;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  disco_id: string;
}

export interface Decoder {
  id: string;
  decoder: string;
}

// Networks
export const NETWORKS: Network[] = [
  { id: "1", name: "MTN", network_id: "1" },
  { id: "2", name: "AIRTEL", network_id: "2" },
  { id: "3", name: "GLO", network_id: "3" },
  { id: "4", name: "9MOBILE", network_id: "4" }
];

// Data Plans
export const DATA_PLANS: DataPlan[] = [
  // MTN Plans
  { plan_id: "105", data_size: "500MB", network: "MTN", type: "CORPORATE-GIFTING", amount: 130, validity_days: 30, available: true },
  { plan_id: "106", data_size: "1GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 260, validity_days: 30, available: true },
  { plan_id: "108", data_size: "2GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 520, validity_days: 30, available: true },
  { plan_id: "189", data_size: "3GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 780, validity_days: 30, available: true },
  { plan_id: "191", data_size: "5GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 1300, validity_days: 30, available: true },
  { plan_id: "202", data_size: "10GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 2600, validity_days: 30, available: true },
  { plan_id: "2213", data_size: "1.5GB", network: "MTN", type: "DIRECT-COUPON", amount: 240, validity_days: 7, available: true },
  { plan_id: "2216", data_size: "3GB", network: "MTN", type: "DIRECT-COUPON", amount: 690, validity_days: 30, available: true },
  { plan_id: "2232", data_size: "2GB", network: "MTN", type: "DIRECT-COUPON", amount: 566, validity_days: 30, available: true },
  { plan_id: "2233", data_size: "5GB", network: "MTN", type: "DIRECT-COUPON", amount: 0, validity_days: 30, available: false },
  { plan_id: "2234", data_size: "1GB", network: "MTN", type: "DIRECT-COUPON", amount: 0, validity_days: 30, available: false },
  { plan_id: "2235", data_size: "750MB", network: "MTN", type: "DIRECT-COUPON", amount: 0, validity_days: 30, available: false },
  { plan_id: "2222", data_size: "12GB", network: "MTN", type: "GIFTING", amount: 4000, validity_days: 30, available: true },
  { plan_id: "2224", data_size: "75GB", network: "MTN", type: "GIFTING", amount: 16000, validity_days: 30, available: true },
  { plan_id: "2227", data_size: "100MB", network: "MTN", type: "GIFTING", amount: 100, validity_days: 1, available: true },
  { plan_id: "2230", data_size: "10GB", network: "MTN", type: "GIFTING", amount: 3500, validity_days: 30, available: true },
  { plan_id: "2236", data_size: "1.5GB", network: "MTN", type: "GIFTING", amount: 1230, validity_days: 30, available: true },
  { plan_id: "2237", data_size: "4.5GB", network: "MTN", type: "GIFTING", amount: 2000, validity_days: 30, available: true },
  { plan_id: "2238", data_size: "8GB", network: "MTN", type: "GIFTING", amount: 3000, validity_days: 30, available: true },
  { plan_id: "204", data_size: "20GB", network: "MTN", type: "GIFTING", amount: 5500, validity_days: 30, available: true },
  { plan_id: "2257", data_size: "1GB", network: "MTN", type: "GIFTING", amount: 230, validity_days: 30, available: true },
  { plan_id: "2258", data_size: "2GB", network: "MTN", type: "GIFTING", amount: 460, validity_days: 30, available: true },
  { plan_id: "2259", data_size: "3GB", network: "MTN", type: "GIFTING", amount: 690, validity_days: 30, available: true },
  { plan_id: "2260", data_size: "5GB", network: "MTN", type: "GIFTING", amount: 1150, validity_days: 30, available: true },
  { plan_id: "220", data_size: "40GB", network: "MTN", type: "GIFTING", amount: 11000, validity_days: 30, available: true },
  { plan_id: "1", data_size: "1GB", network: "MTN", type: "SME", amount: 253, validity_days: 30, available: true },
  { plan_id: "2", data_size: "2GB", network: "MTN", type: "SME", amount: 506, validity_days: 30, available: true },
  { plan_id: "3", data_size: "5GB", network: "MTN", type: "SME", amount: 1265, validity_days: 30, available: true },
  { plan_id: "20", data_size: "500MB", network: "MTN", type: "SME", amount: 127, validity_days: 30, available: true },
  { plan_id: "90", data_size: "3GB", network: "MTN", type: "SME", amount: 759, validity_days: 30, available: true },
  { plan_id: "91", data_size: "10GB", network: "MTN", type: "SME", amount: 2530, validity_days: 30, available: true },
  { plan_id: "2231", data_size: "1GB", network: "MTN", type: "SME2", amount: 258, validity_days: 30, available: true },
  { plan_id: "2239", data_size: "2GB", network: "MTN", type: "SME2", amount: 516, validity_days: 30, available: true },
  { plan_id: "2240", data_size: "3GB", network: "MTN", type: "SME2", amount: 774, validity_days: 30, available: true },
  { plan_id: "2241", data_size: "5GB", network: "MTN", type: "SME2", amount: 1290, validity_days: 30, available: true },
  { plan_id: "2242", data_size: "10GB", network: "MTN", type: "SME2", amount: 2580, validity_days: 30, available: true },
  { plan_id: "2243", data_size: "500MB", network: "MTN", type: "SME2", amount: 0, validity_days: 30, available: false },
  
  // Airtel Plans
  { plan_id: "12", data_size: "500MB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 140, validity_days: 30, available: true },
  { plan_id: "13", data_size: "1GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 280, validity_days: 30, available: true },
  { plan_id: "17", data_size: "2GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 560, validity_days: 30, available: true },
  { plan_id: "19", data_size: "5GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 1400, validity_days: 30, available: true },
  { plan_id: "2244", data_size: "1000MB", network: "AIRTEL", type: "GIFTING", amount: 300, validity_days: 1, available: true },
  { plan_id: "2245", data_size: "2GB", network: "AIRTEL", type: "GIFTING", amount: 1180, validity_days: 30, available: true },
  { plan_id: "2246", data_size: "3GB", network: "AIRTEL", type: "GIFTING", amount: 1480, validity_days: 30, available: true },
  { plan_id: "2247", data_size: "4.5GB", network: "AIRTEL", type: "GIFTING", amount: 1975, validity_days: 30, available: true },
  { plan_id: "2248", data_size: "6GB", network: "AIRTEL", type: "GIFTING", amount: 2445, validity_days: 30, available: true },
  { plan_id: "2249", data_size: "8GB", network: "AIRTEL", type: "GIFTING", amount: 2945, validity_days: 30, available: true },
  
  // Glo Plans
  { plan_id: "137", data_size: "1GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 280, validity_days: 30, available: true },
  { plan_id: "139", data_size: "2GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 550, validity_days: 30, available: true },
  { plan_id: "140", data_size: "5GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 1175, validity_days: 30, available: true },
  { plan_id: "2204", data_size: "500MB", network: "GLO", type: "CORPORATE-GIFTING", amount: 130, validity_days: 30, available: true },
  { plan_id: "2205", data_size: "10GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 2350, validity_days: 30, available: true },
  { plan_id: "2214", data_size: "3GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 1350, validity_days: 30, available: true },
  { plan_id: "2250", data_size: "1.8GB", network: "GLO", type: "GIFTING", amount: 500, validity_days: 30, available: true },
  { plan_id: "2251", data_size: "3.9GB", network: "GLO", type: "GIFTING", amount: 1085, validity_days: 30, available: true },
  { plan_id: "2252", data_size: "7.5GB", network: "GLO", type: "GIFTING", amount: 2000, validity_days: 30, available: true },
  { plan_id: "2253", data_size: "9.2GB", network: "GLO", type: "GIFTING", amount: 2500, validity_days: 30, available: true },
  { plan_id: "2254", data_size: "10.8GB", network: "GLO", type: "GIFTING", amount: 2245, validity_days: 30, available: true },
  { plan_id: "2255", data_size: "150MB", network: "GLO", type: "GIFTING", amount: 126, validity_days: 30, available: true },
  { plan_id: "2256", data_size: "350MB", network: "GLO", type: "GIFTING", amount: 140, validity_days: 30, available: true },
  
  // 9Mobile Plans
  { plan_id: "87", data_size: "1GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 190, validity_days: 30, available: true },
  { plan_id: "2210", data_size: "2GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 380, validity_days: 30, available: true },
  { plan_id: "2211", data_size: "3GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 570, validity_days: 30, available: true },
  { plan_id: "2212", data_size: "4GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 780, validity_days: 30, available: true },
  { plan_id: "2221", data_size: "15GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 2250, validity_days: 30, available: true },
  { plan_id: "2229", data_size: "500MB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 100, validity_days: 30, available: true },
  { plan_id: "11", data_size: "500MB", network: "9MOBILE", type: "GIFTING", amount: 175, validity_days: 30, available: true },
  { plan_id: "82", data_size: "1GB", network: "9MOBILE", type: "GIFTING", amount: 258, validity_days: 7, available: true },
  { plan_id: "83", data_size: "2GB", network: "9MOBILE", type: "GIFTING", amount: 590, validity_days: 30, available: true },
  { plan_id: "85", data_size: "5.5GB", network: "9MOBILE", type: "GIFTING", amount: 1590, validity_days: 30, available: true },
  { plan_id: "86", data_size: "11GB", network: "9MOBILE", type: "GIFTING", amount: 3290, validity_days: 30, available: true },
  { plan_id: "2215", data_size: "15GB", network: "9MOBILE", type: "GIFTING", amount: 4350, validity_days: 30, available: true }
];

// Cable Plans
export const CABLE_PLANS: CablePlan[] = [
  // GOTV Plans
  { cable_id: "17", name: "GOtv Supa 7600 monthly", amount: 7600, decoder: "GOTV" },
  { cable_id: "18", name: "GOtv Smallie - Yearly", amount: 10200, decoder: "GOTV" },
  { cable_id: "19", name: "GOtv Smallie - Quarterly", amount: 3450, decoder: "GOTV" },
  { cable_id: "20", name: "GOtv Smallie - Monthly", amount: 1300, decoder: "GOTV" },
  { cable_id: "21", name: "GOtv Jolli", amount: 3950, decoder: "GOTV" },
  { cable_id: "22", name: "GOtv Jinja", amount: 2700, decoder: "GOTV" },
  { cable_id: "23", name: "GOtv Max", amount: 5700, decoder: "GOTV" },
  
  // DSTV Plans
  { cable_id: "24", name: "ExtraView Access", amount: 4000, decoder: "DSTV" },
  { cable_id: "26", name: "DStv Compact Plus + Extra View", amount: 23800, decoder: "DSTV" },
  { cable_id: "27", name: "DStv Premium + Extra View", amount: 33500, decoder: "DSTV" },
  { cable_id: "28", name: "DStv Compact + Extra View", amount: 16500, decoder: "DSTV" },
  { cable_id: "29", name: "DStv Padi + ExtraView", amount: 6950, decoder: "DSTV" },
  { cable_id: "30", name: "DStv Yanga + ExtraView", amount: 8200, decoder: "DSTV" },
  { cable_id: "31", name: "DStv Confam + ExtraView", amount: 11400, decoder: "DSTV" },
  { cable_id: "32", name: "DStv Premium Asia", amount: 33000, decoder: "DSTV" },
  { cable_id: "33", name: "DStv Premium French", amount: 45600, decoder: "DSTV" },
  { cable_id: "34", name: "DStv Asia", amount: 9900, decoder: "DSTV" },
  { cable_id: "35", name: "DStv Padi", amount: 2950, decoder: "DSTV" },
  { cable_id: "36", name: "DStv Confam", amount: 7400, decoder: "DSTV" },
  { cable_id: "37", name: "DStv Premium", amount: 29500, decoder: "DSTV" },
  { cable_id: "38", name: "DStv Compact Plus", amount: 19800, decoder: "DSTV" },
  { cable_id: "39", name: "DStv Compact", amount: 12500, decoder: "DSTV" },
  { cable_id: "40", name: "DStv Yanga", amount: 4200, decoder: "DSTV" },
  
  // STARTIMES Plans
  { cable_id: "7", name: "Super - 2500 Naira - 1 Week", amount: 2500, decoder: "STARTIMES" },
  { cable_id: "8", name: "Classic - 1500 Naira - 1 Week", amount: 1500, decoder: "STARTIMES" },
  { cable_id: "9", name: "Smart - 1300 Naira - 1 Week", amount: 1300, decoder: "STARTIMES" },
  { cable_id: "10", name: "Basic - 1000 Naira - 1 Week", amount: 1000, decoder: "STARTIMES" },
  { cable_id: "11", name: "Nova - 500 Naira - 1 Week", amount: 500, decoder: "STARTIMES" },
  { cable_id: "12", name: "Super - 7,500 Naira - 1 Month", amount: 7500, decoder: "STARTIMES" },
  { cable_id: "14", name: "Smart - 3,800 Naira - 1 Month", amount: 3800, decoder: "STARTIMES" },
  { cable_id: "15", name: "Basic - 3000 Naira - 1 Month", amount: 3000, decoder: "STARTIMES" },
  { cable_id: "16", name: "Classic - 4500 Naira - 1 Month", amount: 4500, decoder: "STARTIMES" },
  { cable_id: "41", name: "Nova 1700 monthly", amount: 1700, decoder: "STARTIMES" }
];

// Electricity Providers
export const ELECTRICITY_PROVIDERS: ElectricityProvider[] = [
  { id: "3", name: "IKEJA ELECTRIC (IKEDC)", disco_id: "3" },
  { id: "4", name: "EKO ELECTRIC (EKEDC)", disco_id: "4" },
  { id: "5", name: "ABUJA (AEDC)", disco_id: "5" },
  { id: "6", name: "KANO ELECTRIC (KEDCO)", disco_id: "6" },
  { id: "7", name: "PORT HARCOURT ELECTRIC (PHED)", disco_id: "7" },
  { id: "8", name: "JOS ELECTRIC (JED)", disco_id: "8" },
  { id: "9", name: "KADUNA ELECTRIC (KAEDCO)", disco_id: "9" },
  { id: "10", name: "IBADAN ELECTRIC (IBEDC)", disco_id: "10" }
];

// Decoders
export const DECODERS: Decoder[] = [
  { id: "1", decoder: "GOTV" },
  { id: "2", decoder: "DSTV" },
  { id: "3", decoder: "STARTIMES" }
];

// Validation Functions
export const validatePhone = (phone: string): boolean => /^\d{10,11}$/.test(phone);
export const validateSmartcard = (smartcard: string): boolean => /^\d{10}$/.test(smartcard);
export const validateMeter = (meter: string): boolean => /^\d{10,13}$/.test(meter);
export const validateAmount = (amount: number): boolean => !isNaN(amount) && amount > 0;

// Currency conversion utilities
export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const cachedRate = localStorage.getItem('exchange_rate');
    const cachedTime = localStorage.getItem('exchange_rate_time');
    
    if (cachedRate && cachedTime) {
      const timeDiff = Date.now() - parseInt(cachedTime);
      if (timeDiff < 5 * 60 * 1000) { // 5 minutes cache
        return parseFloat(cachedRate);
      }
    }
    
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=ngn');
    const data = await response.json();
    const rate = data.tether.ngn;
    
    localStorage.setItem('exchange_rate', rate.toString());
    localStorage.setItem('exchange_rate_time', Date.now().toString());
    
    return rate;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1650; // Fallback rate
  }
};

export const convertNairaToUSDC = (nairaAmount: number, exchangeRate: number) => {
  const baseUsdc = nairaAmount / exchangeRate;
  const fee = baseUsdc * 0.02; // 2% platform fee
  const totalUsdc = baseUsdc + fee;
  
  return {
    baseUsdc: parseFloat(baseUsdc.toFixed(6)),
    fee: parseFloat(fee.toFixed(6)),
    totalUsdc: parseFloat(totalUsdc.toFixed(6))
  };
};

// Utility Functions
export const getDataPlansByNetwork = (network: string): DataPlan[] => {
  return DATA_PLANS.filter(plan => plan.network === network && plan.available);
};

export const getCablePlansByDecoder = (decoder: string): CablePlan[] => {
  return CABLE_PLANS.filter(plan => plan.decoder === decoder);
};

export const getNetworkById = (id: string): Network | undefined => {
  return NETWORKS.find(network => network.id === id);
};

export const getPlanById = (planId: string): DataPlan | undefined => {
  return DATA_PLANS.find(plan => plan.plan_id === planId);
};

export const getCablePlanById = (cableId: string): CablePlan | undefined => {
  return CABLE_PLANS.find(plan => plan.cable_id === cableId);
};

export const getElectricityProviderById = (id: string): ElectricityProvider | undefined => {
  return ELECTRICITY_PROVIDERS.find(provider => provider.id === id);
};