<template>

    <span v-if="this.getCoinName() == ''" class="loadingText">
      {{ loadingText }} 
      <div class="loader"></div> 
    </span>
    <h2 v-else>
      {{ this.getCoinName() }}
    </h2>
  <div id="cube" class="h-40 w-40 relative flex items-center cursor-pointer">
    <div class="hexagon absolute"></div>
    <div class="cube back h-40 w-40 absolute top-0 left-0"></div>
    <div class="cube top h-40 w-40 absolute top-0 left-0"></div>
    <div class="cube left h-40 w-40 absolute top-0 left-0"></div>
    <div class="cube right h-40 w-40 absolute top-0 left-0"></div>
    <div class="powerup absolute"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'MysteryBox',
  data() {
    return {
      cube: null,
      cback: null,
      ctop: null,
      cleft: null,
      cright: null,
      glow: null,
      powerup: null,
      transitionTime: null,
      isOpen: false,
      current: 0,
      watching: false, // New state to avoid multiple triggers
      coinName: "",
      loadingText: 'Picking random memes',
      loadingTexts: [
        'Picking random memes',
        'Still picking',
        'Just a moment',
      ],
      currentTextIndex: 0,
      winSound: new Audio(require('@/assets/win.mp3'))
    }
  },
  computed: {
    ...mapGetters(['numCoins', 'coins', 'pumpCoinsInfo', 'coinOrigin']),
  },
  mounted() {
    this.initializeCubeElements();
    this.cycleLoadingTexts();
  },
  methods: {
    initializeCubeElements() {
      this.cube = document.querySelector("#cube");
      this.cback = document.querySelector(".back");
      this.ctop = document.querySelector(".top");
      this.cleft = document.querySelector(".left");
      this.cright = document.querySelector(".right");
      this.glow = document.querySelector(".hexagon");
      this.powerup = document.querySelector(".powerup");
      this.transitionTime = "750ms";

      this.ctop.style.transition = `all ${this.transitionTime}`;
      this.cleft.style.transition = `all ${this.transitionTime}`;
      this.cright.style.transition = `all ${this.transitionTime}`;
      this.cube.style.transition = `all ${this.transitionTime}`;
      this.powerup.style.transition = `all ${this.transitionTime}`;
      this.glow.style.transition = `all ${this.transitionTime}`;
      this.cback.style.transition = `all ${this.transitionTime}`;
    },
    async openCube() {
      if (!this.isOpen) {
        this.winSound.play();
        this.ctop.style.transform = "translateY(-3rem)";
        this.cleft.style.transform = "translateX(-3rem)";
        this.cright.style.transform = "translateX(3rem)";
        this.ctop.style.opacity = 0.1;
        this.cleft.style.opacity = 0.1;
        this.cright.style.opacity = 0.1;
        this.cback.style.opacity = 0.1;
        this.glow.style.opacity = 0.5;
        this.powerup.style.opacity = 1;
        this.isOpen = true;
        this.cube.style.animationPlayState = "paused";
        this.powerup.style.zIndex = 10;
        this.powerup.style.height = "80px";
        this.powerup.style.width = "80px";

        // Call award function here to update the powerup image
        this.award();
      }
    },
    closeCube() {
      if (this.isOpen) {
        this.ctop.style.transform = "translateY(0)";
        this.cleft.style.transform = "translateX(0)";
        this.cright.style.transform = "translateX(0)";
        this.cube.style.opacity = 1;
        this.isOpen = false;
        this.ctop.style.opacity = 1;
        this.cleft.style.opacity = 1;
        this.cright.style.opacity = 1;
        this.cback.style.opacity = 1;
        this.glow.style.opacity = 1;
        this.powerup.style.opacity = 0;
        this.powerup.style.zIndex = 0;
        this.cube.style.animationPlayState = "running";
        this.powerup.style.height = "48px";
        this.powerup.style.width = "48px";
        this.changeVar("rgba(255,195,26,0.4)");
      }
    },
    changeVar(glow) {
      document.documentElement.style.setProperty("--glow", glow);
    },
    award() {

      const latestPurchase = this.coins.purchases[this.current];
      const image =  this.getImageUrl()
      if (latestPurchase) {
        this.powerup.style.backgroundImage = `url('${image}')`;
        this.changeVar("rgba(69,185,251,0.33)");
      }
      this.coinName = this.coins.purchases[this.current].tokenName
    },
    getImageUrl(){
      let imageUrl = "@/assets/flame.png"
      console.log(this.coinOrigin)
      console.log(this.pumpCoinsInfo)
      console.log(this.coins.purchases)
      if (this.coinOrigin == 'P') {
        for (let pfCoin of this.pumpCoinsInfo){
          if (pfCoin.address == this.coins.purchases[this.current].tokenMintAddress){
            imageUrl = pfCoin.logo
          }
        }
    }
    else if (this.coinOrigin == 'T'){
      imageUrl = `https://dd.dexscreener.com/ds-data/tokens/solana/${this.coins.purchases[this.current].tokenMintAddress}.png`
      //trending
    }else{
      //well..
    }
      return imageUrl;
    },
    getCoinName(){
      return this.coinName;
    },
    cycleLoadingTexts() {
      const interval = setInterval(() => {
        this.currentTextIndex = (this.currentTextIndex + 1) % this.loadingTexts.length;
        this.loadingText = this.loadingTexts[this.currentTextIndex];
      }, 3000); // Change text every 3 seconds

      // Stop cycling when the coinName appears
      this.$watch('coinName', (newValue) => {
        if (newValue) {
          clearInterval(interval);
        }
      });
    },
    async handleCubeAnimation() {
      if (this.coins.purchases.length > this.current && !this.watching) {
        this.watching = true;
        await this.openCube();
        await this.sleep(3000); // Wait for 3 seconds
        this.closeCube();
        this.current++;
        await this.sleep(2000); // Wait for at least 2 seconds
        this.watching = false;
        if (this.current < this.coins.purchases.length) {
          this.handleCubeAnimation();
        }
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  },
  watch: {
    'coins.purchases.length': 'handleCubeAnimation',
  },
}
</script>

<style scoped>

.loadingText{
  display: flex;
  text-align: center;
  align-items: center;
  align-self: center;
}

/* HTML: <div class="loader"></div> */
.loader {
  margin-left: 1rem;
  width: 20px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side,#000 90%,#0000) 0/calc(100%/3) 100% space;
  clip-path: inset(0 100% 0 0);
  animation: l1 1s steps(4) infinite;
}
@keyframes l1 {to{clip-path: inset(0 -34% 0 0)}}

.cursor-pointer { cursor: pointer; }

.flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

.relative { 
    position: relative;
}

.left-0 { left: 0; }

.top-0 { top: 0; }

.absolute { 
    position: absolute;
}

.w-40 { 
  width: 10rem;
}

.h-40{
  height: 10rem;
}
:root {
  --glow: rgba(255, 195, 26, 0.4);
}
/* body {
  transform: scale(1.5);
} */
.hexagon {
  z-index: -2;
  position: relative;
  width: 160px;
  height: 92.38px;
  background-color: var(--glow);
  margin: 46.19px 0;
  filter: blur(20px);
}
.hexagon:before,
.hexagon:after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
}
.hexagon:before {
  bottom: 100%;
  border-bottom: 46.19px solid var(--glow);
}
.hexagon:after {
  top: 100%;
  width: 0;
  border-top: 46.19px solid var(--glow);
}
.back {
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxBackground_2x_b2espr.png");
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.top {
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxTopFlap_2x_f9cb8g.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.left {
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxLeftFlap_2x_y8u4gz.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
}
.right {
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxRightFlap_2x_abexhh.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
}
#cube {
  margin-top: 2rem;
  animation: hover 1.5s ease-in-out infinite alternate;
  transition: transform 300ms;
  animation-play-state: running;
}
@keyframes hover {
  from {
    transform: translateY(-0.5rem);
  }
  to {
    transform: translateY(0.5rem);
  }
}
.powerup {
  /* background-image: url(""); */
  background-size: cover;
  border-radius: 50%;
  z-index: 100;
  overflow: hidden;
  height: 48px;
  width: 48px;
  z-index: -5;
}

</style>
