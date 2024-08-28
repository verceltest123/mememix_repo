import {
    createStore
} from 'vuex'

// import {
//     resolveToWalletAddress,
//     getParsedNftAccountsByOwner,
// } from "@nfteyez/sol-rayz";
// const web3 = require('@solana/web3.js');
// import constants from '../constants/index.js'
// import { useWallet } from '@solana/wallet-adapter-vue'
const { Connection, Transaction, TransactionInstruction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");
// const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");
// const borsh = require("borsh");
//const BN = require("bn.js");
// const delay = ms => new Promise(res => setTimeout(res, ms));

import { useWallet } from 'solana-wallets-vue';

//import Nft from '@/classes/nft';

// const web3 = require("@solana/web3.js");

//const splToken = require('@solana/spl-token')
//import * as BufferLayout from "@solana/buffer-layout";

// import {
//     TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";


// import {
//     Metadata
// } from "@metaplex-foundation/mpl-token-metadata";

import constants from '@/constants';
// const delay = ms => new Promise(res => setTimeout(res, ms));




const delay = ms => new Promise(res => setTimeout(res, ms));
const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

//const bs58 = require('bs58');

function getPumpFunURL(minMarketCap, maxMarketCap){
    const baseURL = constants.PUMPFUN_ENDPOINT
    const params = new URLSearchParams({
        // numCoins: numCoins,
        minMarketCap: minMarketCap,
        maxMarketCap: maxMarketCap
    });
    
    return `${baseURL}?${params.toString()}`;
}

function getPriceURL(token){
    const baseURL = constants.JUP_PRICE_API
    const params = new URLSearchParams({
        ids: token,
        vsToken: constants.SOLANA_ADDRESS
    });
    
    return `${baseURL}?${params.toString()}`;
}

function getUserPurchases(address){
    const baseURL = constants.USER_PURCHASES
    const params = new URLSearchParams({
        buyer: address,
    });
    
    return `${baseURL}?${params.toString()}`;
}

function calculateSinglePnL(startingPrice, currentPrice){

    return (currentPrice/startingPrice)*100-100;

}
    


function getBoughtCoins(signature){
    const baseURL = constants.CHECK_BOUGHT_COINS
    const params = new URLSearchParams({
        signature: signature
    });
    
    return `${baseURL}?${params.toString()}`;
}


export default createStore({

    state: {
        wallet: null,
        walletData: null,
        numberPumpCoinsForRange: 1,
        coins: null,
        txStatus: null,
        signature: "",
        numCoins: 0,
        transferredSignal: false,
        openModal: false,
        buyingFinished: false,
        pumpCoinsInfo: null,
        coinOrigin: null,
        allCoins: [],
        allPurchases: {},
        totalPnL: 0,

        // {
        //     "token": "DRBUfoSguW8G6KbRP8XXzHdmV1tk12TdUQz",
        //     "boughtPrice": "0.00123",
        //     "currentPrice": "0.00211"
        // }

    },
    mutations: {

        newWallet(state) {
            state.wallet = useWallet()
        },

        caluclateTotalPnL(state){

            let totalPnL = 0;
            for (let purchase of state.allPurchases){
                totalPnL += purchase.pnl
            }
            state.totalPnL = totalPnL
        }



        // init(state){
        //     state.wallet = []
        //     state.wallet['publicKey'] = ''
        //     console.log(state.wallet)

        // }



    },
    actions: {
        async getPumpFunCoins({state}, payload){
            const totalCoins = await fetch(getPumpFunURL(payload.min, payload.max))
            const totalCoinsJson = await totalCoins.json()
            state.numberPumpCoinsForRange = totalCoinsJson.total
            state.pumpCoinsInfo = totalCoinsJson.coins
            console.log(state.pumpCoinsInfo)
        },

        async getBoughtCoins({state}){

            const url = getBoughtCoins(state.signature)
            let status = {
                "purchases" : []
            }
            while (status.purchases.length != state.numCoins){
                let response = await fetch(url,  {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                status = await response.json()
                

                if (status.purchases){
                    state.coins = status
                    if (status.purchases.length == state.numCoins) {
                        state.buyingFinished = true;
                        break;
                    }
                }
                else{
                    status = {
                        "purchases" : []
                    }
                }

        
                await delay(5000)

            }
            
        },

        async buyCoins({state, dispatch}, payload){
            
            const connection = new Connection(constants.MAINNET_RPC)
            let message = "";
            state.numCoins = payload.numCoins
            if ("minMC" in payload){ 
                message = `${payload.type}${payload.numCoins}m${payload.minMC}M${payload.maxMC}`
                state.coinOrigin = 'P'
            }
            else{
                message = `${payload.type}${payload.numCoins}R700`
                state.coinOrigin = 'T'
            }
           
            // console.log(message)
          

            // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            //     units: 300,
            //   });
              
            //   const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
            //     microLamports: 200000,
            //   });

            const transferTransaction = new Transaction()
            // .add(modifyComputeUnits)
            // .add(addPriorityFee)
            .add(
                SystemProgram.transfer({
                fromPubkey: state.wallet.publicKey,
                toPubkey: new PublicKey(constants.PURCHASE_DESTINATION_WALLET),
                lamports: payload.amount * LAMPORTS_PER_SOL,
                })
            );
            
            await transferTransaction.add(
                new TransactionInstruction({
                keys: [{ pubkey: state.wallet.publicKey, isSigner: true, isWritable: true }],
                data: Buffer.from(message, "utf-8"),
                programId: new PublicKey(constants.MEMO_PROGRAM),
                })
            );
            
            try {

                // const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();

                // return
                // const sig = await connection.getSignatureStatus("5Xg3BpYNHgy3NdWUzj7FRAfzoWAsVEKAewspUR6pN7p9inNTW8QmKW56cH1sJG1tSeFGyrfDQtdZy3WifXbfkPo")
                // console.log(sig)
                const signature = await state.wallet.sendTransaction(transferTransaction, connection);

                state.openModal = true

                const controller = new AbortController();
                const abortSignal = controller.signal;

                const latestBh = await connection.getLatestBlockhash();

         
                const lastValidBlockHeight = latestBh.lastValidBlockHeight - 150;
            
                // this would throw TransactionExpiredBlockheightExceededError
                await Promise.race([
                    connection.confirmTransaction(
                      {
                        ...latestBh,
                        lastValidBlockHeight,
                        signature: signature,
                        abortSignal,
                      },
                      'confirmed'
                    ),
                    new Promise((resolve) => {
                      // in case ws socket died
                      const checkStatus = async () => {
                        while (!abortSignal.aborted) {
                          await wait(2000);
                          const tx = await connection.getSignatureStatus(signature, {
                            searchTransactionHistory: false,
                          });
                          if (tx?.value?.confirmationStatus === 'confirmed') {
                            console.log('confirmed');
                            resolve(tx);
                            break;
                          }
                        }
                      };
                      checkStatus();
                    }),
                  ]);

                state.transferredSignal = true
                state.signature = signature
                
                dispatch('getBoughtCoins');
                // console.log(state.signature)
            }
            catch(e){
                console.log(e)
                // state.transferredSignal = true
                // state.true
            }
            
        },
        async getAllTrendingCoins({state}){

            let response = await fetch(constants.TRENDING_COINS,  {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            let responseJson = await response.json()


            for (let coin of responseJson.coins){
                state.allCoins.push(coin.base_token_address)
            }

        },

        async resetBuy({state}){
            state.openModal = false
            state.transferredSignal = false
            state.buyingFinished = false
            state.pumpCoinsInfo = null
            state.coins = null
            state.coinOrigin = null
            state.numberPumpCoinsForRange = 1
            state.numCoins = 0
            
        },
        // async tryGMGN(){
        //     let pumpFunApi = await fetch("https://gmgn.ai/defi/quotation/v1/rank/sol/pump?limit=1000&orderby=usd_market_cap&direction=desc&pump=true", {
        //         method: 'GET',
        //         mode: 'cors',
        //     });
            
        //     let pumpFunCoins = await pumpFunApi.json();
            
            
        //     console.log(pumpFunCoins)
        // },

        async getAllUserPurchases({state, commit}){
            if (state.wallet.publicKey){
                const allUserPurchases = await fetch(getUserPurchases(state.wallet.publicKey.toBase58()))
                const allPurchases = await allUserPurchases.json();
                console.log(allPurchases)

                // filter all in a form "address" : "buyingPrice"

                // state.allPurchases = above

                for (let purchase of state.allPurchases){
                    let currentPriceData = await fetch(getPriceURL(purchase.token))
                    currentPriceData = await currentPriceData.json()
                    let currentCoinPrice = currentPriceData.data.token.price;
                     // edit dict

                     purchase['currentPrice'] = currentCoinPrice

                     purchase['pnl'] = calculateSinglePnL(purchase.boughtPrice, purchase.currentPrice)

                     //update dict

                     commit('caluclateTotalPnL')
                }


            }else{
                return
            }
        },
        

  
    },
    getters: {
        wallet: (state) => state.wallet,
        walletData: (state) => state.walletData,
        coins: (state) => state.coins,  
        transferredSignal: (state) => state.transferredSignal,  
        openModal: (state) => state.openModal,
        numberPumpCoinsForRange: (state) => state.numberPumpCoinsForRange,
        buyingFinished: (state) => state.buyingFinished,
        numCoins: (state) => state.numCoins,
        pumpCoinsInfo: (state) => state.pumpCoinsInfo,
        coinOrigin: (state) => state.coinOrigin,
        allCoins: (state) => state.allCoins,
        allPurchases: (state) => state.allPurchases,
        totalPnL: (state) => state.totalPnL,
    },


})