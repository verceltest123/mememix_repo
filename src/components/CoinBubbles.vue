<template>
    <div class="bubbles">
      <div
        v-for="(coin, index) in allCoins"
        :key="index"
        class="bubble"
        :style="getBubbleStyle(coin)"
      ></div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'CoinBubbles',
    computed: {
      ...mapGetters(['allCoins']),
    },
    beforeCreate() {
      this.$store.dispatch('getAllTrendingCoins');
    },
    methods: {
      getBubbleStyle(coin) {
        const size = `${Math.random() * 60 + 10}px`; // Random size between 10px and 70px
        const left = `${Math.random() * 100}%`; // Random horizontal position
        const top = `${Math.random() * 100}%`; // Random vertical position
        const animationDelay = `${Math.random() * 3}s`; // Random delay up to 3s
  
        return {
          width: size,
          height: size,
          left: left,
          top: top,
          animationDelay: animationDelay,
          background: `url('https://dd.dexscreener.com/ds-data/tokens/solana/${coin}.png') center center no-repeat`,
          backgroundSize: 'contain',
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .bubbles {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    overflow: hidden;
    top: 0;
    left: 0;
  }
  
  .bubble {
    position: absolute;
    background-size: contain;
    border-radius: 50%;
    opacity: 0;
    animation: popUp 1s infinite;
  }
  
  /* Keyframes for sharp pop-up and disappear animation */
  @keyframes popUp {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0);
    }
  }
  </style>
  