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

// Data Plans (MTN plans 2233, 2234, 2235, 2243 disabled as specified)
export const DATA_PLANS: DataPlan[] = [
  // MTN Plans
  { plan_id: "105", data_size: "500MB", network: "MTN", type: "CORPORATE-GIFTING", amount: 130, validity_days: 30, available: true },
  { plan_id: "106", data_size: "1GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 260, validity_days: 30, available: true },
  { plan_id: "107", data_size: "2GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 520, validity_days: 30, available: true },
  { plan_id: "108", data_size: "3GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 780, validity_days: 30, available: true },
  { plan_id: "109", data_size: "5GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 1300, validity_days: 30, available: true },
  { plan_id: "110", data_size: "10GB", network: "MTN", type: "CORPORATE-GIFTING", amount: 2600, validity_days: 30, available: true },
  { plan_id: "2233", data_size: "1GB", network: "MTN", type: "DIRECT", amount: 0, validity_days: 30, available: false },
  { plan_id: "2234", data_size: "2GB", network: "MTN", type: "DIRECT", amount: 0, validity_days: 30, available: false },
  { plan_id: "2235", data_size: "3GB", network: "MTN", type: "DIRECT", amount: 0, validity_days: 30, available: false },
  { plan_id: "2243", data_size: "5GB", network: "MTN", type: "DIRECT", amount: 0, validity_days: 30, available: false },
  
  // Airtel Plans
  { plan_id: "200", data_size: "500MB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 125, validity_days: 30, available: true },
  { plan_id: "201", data_size: "1GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 250, validity_days: 30, available: true },
  { plan_id: "202", data_size: "2GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 500, validity_days: 30, available: true },
  { plan_id: "203", data_size: "5GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 1250, validity_days: 30, available: true },
  { plan_id: "204", data_size: "10GB", network: "AIRTEL", type: "CORPORATE-GIFTING", amount: 2500, validity_days: 30, available: true },
  
  // Glo Plans
  { plan_id: "300", data_size: "500MB", network: "GLO", type: "CORPORATE-GIFTING", amount: 120, validity_days: 30, available: true },
  { plan_id: "301", data_size: "1GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 240, validity_days: 30, available: true },
  { plan_id: "302", data_size: "2GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 480, validity_days: 30, available: true },
  { plan_id: "303", data_size: "5GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 1200, validity_days: 30, available: true },
  { plan_id: "304", data_size: "10GB", network: "GLO", type: "CORPORATE-GIFTING", amount: 2400, validity_days: 30, available: true },
  
  // 9Mobile Plans
  { plan_id: "400", data_size: "500MB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 135, validity_days: 30, available: true },
  { plan_id: "401", data_size: "1GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 270, validity_days: 30, available: true },
  { plan_id: "402", data_size: "2GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 540, validity_days: 30, available: true },
  { plan_id: "403", data_size: "5GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 1350, validity_days: 30, available: true },
  { plan_id: "404", data_size: "10GB", network: "9MOBILE", type: "CORPORATE-GIFTING", amount: 2700, validity_days: 30, available: true }
];

// Cable Plans
export const CABLE_PLANS: CablePlan[] = [
  // GOTV Plans
  { cable_id: "17", name: "GOtv Supa 7600 monthly", amount: 7600, decoder: "GOTV" },
  { cable_id: "18", name: "GOtv Max 5700 monthly", amount: 5700, decoder: "GOTV" },
  { cable_id: "19", name: "GOtv Jolli 3300 monthly", amount: 3300, decoder: "GOTV" },
  { cable_id: "20", name: "GOtv Jinja 2250 monthly", amount: 2250, decoder: "GOTV" },
  { cable_id: "21", name: "GOtv Lite 900 monthly", amount: 900, decoder: "GOTV" },
  
  // DSTV Plans
  { cable_id: "1", name: "DSTV Premium 29500 monthly", amount: 29500, decoder: "DSTV" },
  { cable_id: "2", name: "DSTV Compact Plus 19800 monthly", amount: 19800, decoder: "DSTV" },
  { cable_id: "3", name: "DSTV Compact 12000 monthly", amount: 12000, decoder: "DSTV" },
  { cable_id: "4", name: "DSTV Confam 7400 monthly", amount: 7400, decoder: "DSTV" },
  { cable_id: "5", name: "DSTV Yanga 4200 monthly", amount: 4200, decoder: "DSTV" },
  { cable_id: "6", name: "DSTV Padi 2950 monthly", amount: 2950, decoder: "DSTV" },
  
  // STARTIMES Plans
  { cable_id: "30", name: "StarTimes Super 6200 monthly", amount: 6200, decoder: "STARTIMES" },
  { cable_id: "31", name: "StarTimes Smart 3200 monthly", amount: 3200, decoder: "STARTIMES" },
  { cable_id: "32", name: "StarTimes Basic 1800 monthly", amount: 1800, decoder: "STARTIMES" },
  { cable_id: "33", name: "StarTimes Classic 2500 monthly", amount: 2500, decoder: "STARTIMES" }
];

// Electricity Providers
export const ELECTRICITY_PROVIDERS: ElectricityProvider[] = [
  { id: "1", name: "AEDC - ABUJA ELECTRIC", disco_id: "abuja_electric" },
  { id: "2", name: "EKEDC - EKO ELECTRIC", disco_id: "eko_electric" },
  { id: "3", name: "IKEDC - IKEJA ELECTRIC", disco_id: "ikeja_electric" },
  { id: "4", name: "EEDC - ENUGU ELECTRIC", disco_id: "enugu_electric" },
  { id: "5", name: "PHED - PORT HARCOURT ELECTRIC", disco_id: "portharcourt_electric" },
  { id: "6", name: "IBEDC - IBADAN ELECTRIC", disco_id: "ibadan_electric" },
  { id: "7", name: "KAEDCO - KADUNA ELECTRIC", disco_id: "kaduna_electric" },
  { id: "8", name: "KEDCO - KANO ELECTRIC", disco_id: "kano_electric" },
  { id: "9", name: "JEDC - JOS ELECTRIC", disco_id: "jos_electric" },
  { id: "10", name: "BEDC - BENIN ELECTRIC", disco_id: "benin_electric" }
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

// Utility Functions
export const getDataPlansByNetwork = (network: string): DataPlan[] => {
  return DATA_PLANS.filter(plan => plan.network === network);
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
  return CABLE_PLANS.filter(plan => plan.cable_id === cableId)[0];
};

export const getElectricityProviderById = (id: string): ElectricityProvider | undefined => {
  return ELECTRICITY_PROVIDERS.find(provider => provider.id === id);
};