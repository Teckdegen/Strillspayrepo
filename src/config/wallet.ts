// Wallet Configuration
export const WALLET_CONFIG = {
  // WalletConnect 2.0
  projectId: 'fec710779a1c53881cac4c08c19bd33d',
  // Recommended wallet providers
  recommendedWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c984492429c8746a07f2527148b0cc475b75bc50e6d6086fd43', // Rainbow
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Trust Wallet
  ],
  // Required namespaces
  requiredNamespaces: {
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: ['eip155:1'], // Ethereum mainnet
      events: ['chainChanged', 'accountsChanged'],
    },
  },
};
