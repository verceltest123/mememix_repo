import { createApp } from 'vue'
import App from './App.vue'
import store from './store'


import SolanaWallets from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

const walletOptions = {
    wallets: [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    ],
    autoConnect: true,
}


createApp(App).use(store).use(SolanaWallets,walletOptions).mount('#app')
