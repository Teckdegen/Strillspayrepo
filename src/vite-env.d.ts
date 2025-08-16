/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EASYTOPUP_API_KEY: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
