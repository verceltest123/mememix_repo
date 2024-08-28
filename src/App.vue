<template>

  <PageHeader/>
  <!-- <CoinBubbles/> -->
   <!-- <SpiralAnimation/> -->
    <!-- <AnimationTest/> -->
  <PageMain/>
  <BottomRight/>
  <BottomLeft/>

</template>

<script>
import PageHeader from './components/PageHeader.vue'
import PageMain from './components/PageMain.vue'
import BottomLeft from './components/BottomLeft.vue'
import BottomRight from './components/BottomRight.vue'
// import CoinBubbles from './components/CoinBubbles.vue'
// import SpiralAnimation from './components/SpiralAnimation.vue'
// import AnimationTest from './components/AnimationTest.vue'




export default {
  name: 'App',
  components: {
    PageHeader,
    PageMain,
    BottomLeft,
    BottomRight,
    // CoinBubbles,
    // SpiralAnimation,
    // AnimationTest
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap');


body{
  /* background: #2f4887; */
  /* background: white; */
  /* background: #e7e286; */
  background: #f3f5d3;
  
}

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: 'CustomFont', 'sans-serif'; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-family: "IBM Plex Mono", sans-serif;
  /* margin-top: 60px; */
}
</style>
