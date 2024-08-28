<template>
  <div class="main-section">
    <div class="white">
      <nav class="menu">
        <button
          :class="['left-button', { active: activeSection === 'home' }]"
          @click="setActiveSection('home')"
        >
          <div class="button-content">
            <img src="@/assets/fire.png" alt="Trending">
            Trending
          </div>
        </button>
        <button
          :class="['right-button', { active: activeSection === 'contact' }]"
          @click="setActiveSection('contact')"
        >
          <div class="button-content">
            <img src="@/assets/pf.png" alt="PumpFun">
            PumpFun
          </div>
        </button>
      </nav>
      <div class="container">
        <div v-if="activeSection === 'home'" class="trending-container">
            <TrendingComponent/>          
        </div>
        <div v-else-if="activeSection === 'contact'" class="pumpfun-container">
            <PumpComponent @open-modal="showModal = true"/>  
        </div>

      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <!-- <LotteryMachine/> -->
          <!-- <h2>Randomization Modal</h2> -->
          <!-- <div v-if="coins">
              <h2>LOLOLO</h2>
          </div>
          <div v-else>
            <h2>NENENENEN</h2>
          </div> -->
          
          <!-- <div v-if="coins && coins.purchases" class="image-container">
            <div v-for="(item, index) in coins.purchases"
            :key="index"
            class="image-wrapper"
            :style="{ animationDelay: `${index * 0.2}s` }"
            >
              <span>{{ item.tokenName }}</span>
              <img
                :src="getPlaceholderImage()"
                @load="handleImageLoad($event, '2jmjsuaSpDJTbWgA33orvMWvK2mLhph8rLus8FGxpump')"
                class="circular-image"
                :data-token-address="item.tokenMintAddress"
              >
            </div>
            </div> -->
          <!-- <h2>OP</h2>
          <p v-if="coins">{{coins['purchases']}}</p> -->
          <div v-if="buyingFinished">
            <h3>Finished</h3>
          </div>
        </div>
        <div v-if="transferredSignal" class="modal-body">
          <MysteryBox/>
        </div>
        <div v-else>
           <img src="@/assets/loader.gif">
        </div>
        <div class="modal-footer">
         
          <button class="button-style" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MysteryBox from './MysteryBox.vue'
import TrendingComponent from './TrendingComponent.vue'
import PumpComponent from './PumpComponent.vue'
import { mapGetters } from "vuex";

// 'https://dd.dexscreener.com/ds-data/tokens/solana/${item.tokenMintAddress}.png'


export default {
  name: 'PageMain',
  components:{
    MysteryBox,
    TrendingComponent,
    PumpComponent
  },
  data() {
    return {
      activeSection: 'home',
      showModal: false,
      moonshotSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="none" viewBox="0 0 50 50" class="w-[16px]"><g clip-path="url(#a)"><path fill="#0D0D10" stroke="#DFFF16" stroke-width="2.667" d="M16 30.855c8.205 0 14.857-6.652 14.857-14.857C30.857 7.792 24.205 1.14 16 1.14c-8.205 0-14.857 6.651-14.857 14.857 0 8.205 6.652 14.857 14.857 14.857Z"></path><g clip-path="url(#b)"><path fill="#DFFF16" d="M23.963 18.956c.181-.432-.337-.8-.772-.608a6.83 6.83 0 0 1-2.756.576c-3.72 0-6.735-2.955-6.735-6.6a6.47 6.47 0 0 1 1.008-3.476c.252-.398-.051-.95-.513-.832C10.63 8.926 8 12.101 8 15.877 8 20.364 11.711 24 16.29 24c3.467 0 6.436-2.084 7.673-5.044Z"></path><path fill="#DFFF16" d="M22.32 9.856c.175-.515-.485-.897-.845-.489l-.64.728a1.991 1.991 0 0 1-2.134.572l-.918-.31c-.515-.174-.897.487-.488.846l.728.64a1.99 1.99 0 0 1 .572 2.133l-.31.919c-.175.515.485.897.844.488l.64-.729a1.99 1.99 0 0 1 2.135-.572l.918.311c.515.175.897-.486.488-.846l-.728-.639a1.991 1.991 0 0 1-.572-2.134l.31-.918Z"></path></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h32v32H0z"></path></clipPath><clipPath id="b"><path fill="#fff" d="M8 8h16v16H8z"></path></clipPath></defs></svg>`
    };
  },
  computed:{
        ...mapGetters(['coins']),
        ...mapGetters(['buyingFinished']),
        ...mapGetters(['transferredSignal']),
        ...mapGetters(['openModal']),
        ...mapGetters(['numCoins']),
  },
  watch: {
    openModal(newSignal) {
      if (newSignal) {
        this.showModal = true;
      }
    }
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
    },
    closeModal() {
      this.showModal = false;
      this.$store.dispatch('resetBuy')
    },
    getPlaceholderImage() {
      return this.placeholderImage
    },
    async handleImageLoad(event, tokenAddress) {
      // Get the failed <img> element
      // const imgElement = event.target;
      
      // // Create a div to hold the SVG content
      // const svgContainer = document.createElement('div');
      // svgContainer.innerHTML = this.moonshotSvg;

      let url = `https://dd.dexscreener.com/ds-data/tokens/solana/${tokenAddress}.png`

      const img = new Image();
      img.onload = () => {
        // URL is valid, set the src
        console.log("dombra")
        event.target.src = url;
      };
      img.onerror = () => {
        console.log('lomssa')
        // URL is invalid or cannot be loaded, fetch the real URL
        this.fetchRealImage(event, tokenAddress);
      };
      img.src = url;



      // try {
      //   const response = await fetch(url, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   });

      //   if (!response.ok) {
      //     console.log('lalla')
      //     throw new Error(`HTTP error! status: ${response.status}`);
          
          
      //   }

      //   console.log('dexscreener gud')

      //   // const data = await response.json();

      //   // event.target.src = data.result.content.links.image;
      //   // console.log('Response:', data);
      // } catch (error) {
      //   console.log('lall2')
      //   console.error('Error making POST request:', error);
      // }

      // Replace the <img> element with the SVG
      // imgElement.parentNode.replaceChild(svgContainer.firstChild, imgElement);
    },
    async handleImageError2(event, tokenAddress){
      const url = 'https://mainnet.helius-rpc.com?api-key=bbb7f814-7b66-4c5d-a2a6-a6675108a62c';
      const body = {
        "jsonrpc": "2.0",
        "id": "",
        "method": "getAsset",
        "params": {
          "id": tokenAddress,
          "options": {
            "showFungible": true
          }
        }
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        event.target.src = data.result.content.links.image;
        // console.log('Response:', data);
      } catch (error) {
        console.error('Error making POST request:', error);
      }
    
    }
  },

};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap');

.image-container {
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap between images as needed */
}

.image-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flyIn 1s ease-in-out forwards;
  opacity: 0;
}

.circular-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

@keyframes flyIn {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.circular-image:hover {
  transform: scale(1.1); /* Optional: Add a zoom effect on hover */
}

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

.trending-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;

}

.pumpfun-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.button-content {
  display: flex;
  flex-direction: row;
  gap: 10px; /* Reduced gap for smaller screens */
  align-items: center;
  justify-content: center;
  text-align: center;
}

.button-content img {
    width: 50px; /* Reduce image size for smaller screens */
  }

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "IBM Plex Mono", sans-serif;
  user-select: none;
}

.white {
  width: 90vw; /* Use a percentage for responsive width */
  max-width: 800px; /* Maintain max-width for larger screens */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu {
  display: flex;
  width: 70%;
}

button {
  color: black;
  background-color: white;
  border: 3px solid black;
  padding: 15px 0; /* Adjusted padding for smaller screens */
  font-size: 20px; /* Adjusted font size for smaller screens */
  box-shadow: 0 4px 0 black;
  cursor: pointer;
  flex-grow: 1;
  text-align: center;
}

.left-button {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 0;
  border-right: none;
}

.right-button {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 0;
}

button:hover,
button.active {
  background-color: #dedede;
}

button:active {
  transform: translateY(4px);
  box-shadow: none;
}

.container {
  border: 3px solid black;
  border-top: none;
  padding: 20px;
  width: 70%;
  background-color: white;
  box-shadow: 0 4px 0 black;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.main-section {
  margin-top:5vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .button-content {
    flex-direction: column;
    gap: 5px; /* Reduce gap further for very small screens */
  }

  .button-content img {
    width: 40px; /* Reduce image size for smaller screens */
  }

  button {
    padding: 10px 0; /* Smaller padding on mobile */
    font-size: 18px; /* Smaller font size on mobile */
  }

  .container {
    height: auto; /* Let the content determine height on mobile */
    padding: 15px; /* Adjust padding for mobile */
  }
}

@media (max-width: 480px) {
  .button-content img {
    width: 30px; /* Further reduce image size for extra small screens */
  }

  button {
    font-size: 16px; /* Even smaller font size for extra small screens */
  }
}

@media only screen and (max-width: 768px) {
  .menu{
    width: 90%;
  }

  .container{
    width: 90%;
  }
}
</style>
