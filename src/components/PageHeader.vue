<template>
    <div class="header">


        <!-- <LotteryMachine/> -->

        <!-- <span class="para-text">Tired of searching for the <span class="red">RIGHT</span> coin?</span>
        <span class="para-text">Tired of spending hours on <span class="grey">Dexscreener</span> and <span class="green">Pump.fun</span>?</span>
        <span class="para-text">Tired of having a one coin portfolio?</span> -->

        <div>
            <span class="header-text">mememix </span>
        </div>


        <div style="margin-left: 5rem;">
            <span class="infoText" @click="openInfoModal">
                How does it work?
            </span>
        </div>



        <div v-if="showInfoModal" class="modal-overlay">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    
                </div>
                <div class="modal-body">
                    <span>
                        1. Connect your Solana wallet
                    </span>
                    <span>
                        2. Choose between Trending or PumpFun coins
                    </span>
                    <span>
                        3. Choose how many coins you want 
                    </span>
                    <span>
                        4. Choose how much SOL you want to split across them
                    </span>
                    <span>
                        5. Receieve randomly selected memecoins
                    </span>
                    <span>
                        - Trending coins are all checked with rugcheck.xyz
                    </span>
                    <span>
                        - PumpFun coins can be filtered by Market Cap
                    </span>
                </div>

                <div class="modal-footer">
                    <span>
                        Platform fee for every transaction is 0.5%
                    </span>
                    <button class="button-style" @click="closeInfoModal">Close</button>
                </div>

            </div>
        </div>


        <WalletWrapper />

        <!-- <div v-if="walletData">
            {{walletData.lamports}}
        </div> -->

    </div>
</template>

<script>
import WalletWrapper from './WalletWrapper.vue'
import { mapGetters } from "vuex";

export default {
    name: 'PageHeader',
    components: {
        WalletWrapper,
    },
    data() {
        return {
            showInfoModal: false,
        }
    }, computed: {
        ...mapGetters(['walletData']),
        ...mapGetters(['wallet'])
    }, created() {
        // this.$store.dispatch('getAccountInfo')
        // this.$store.dispatch('getPumpFunCoins')
    },
    methods: {
        openInfoModal() {
            this.showInfoModal = true
        },
        closeInfoModal(){
            this.showInfoModal = false
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border: 3px solid black;
    padding: 20px;
    width: 70%;
    max-width: 400px;
    box-shadow: 0 4px 0 black;
    border-radius: 10px;
}

.modal-header {
    margin-bottom: 10px;
    text-align: center;
}

.modal-body {
    margin-bottom: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.modal-footer {
    display: flex;
    justify-content: center;
}

.red {
    color: red;
}

.grey {
    color: grey;
}

.green {
    color: green;
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

}

.header-text {
    font-size: 1.5rem;
    color: black;
}

.para-text {
    color: white;
    font-family: 'Courier New', Courier, monospace;
}


.infoText {
    text-decoration: underline;
    cursor: pointer;
}

.button-style {
  color: black;
  background-color: white;
  border: 3px solid black;
  padding: 15px 20px;
  font-size: 20px;
  box-shadow: 0 4px 0 black;
  cursor: pointer;
  text-align: center;
  flex-grow: 1;
  text-align: center;
  border-radius: 10px; /* Same border radius as header buttons */
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease;
}

.button-style:hover {
  background-color: #dedede;
}

.button-style:active {
  transform: translateY(4px);
  box-shadow: none;
}


</style>