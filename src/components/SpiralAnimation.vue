<template>

<div class="scene">
  <div class="wrap">
      <div class="wall wall-right"></div>
      <div class="wall wall-left"></div>   
      <div class="wall wall-top"></div>
      <div class="wall wall-bottom"></div> 
      <div class="wall wall-back"></div>    
  </div>
  <div class="wrap">
      <div class="wall wall-right"></div>
      <div class="wall wall-left"></div>   
      <div class="wall wall-top"></div>
      <div class="wall wall-bottom"></div>   
      <div class="wall wall-back"></div>    
  </div>
</div>


</template>

<script>
  
  export default {
    name: 'SpiralAnimation',
  }
</script>

<style>

.wall{
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/18515/PIA09959-1280x800_copy.jpg);
  background-size: cover;
}

/* html, body{
  height: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
}

body{
  background: #000 !important;
  text-align: center !important;
} */
/* 
body:before{
  content: '' !important;
  display: inline-block !important;
  height: 100% !important;
  vertical-align: middle !important;
} */

.scene{
    z-index: -1;
  display: inline-block;
  vertical-align: middle;
  perspective: 5px;
  perspective-origin: 50% 50%;
  position: absolute;
}

.wrap{
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: -50vw;
  top: -50vh;
  transform-style: preserve-3d;
  animation: move 12s infinite linear;
  animation-fill-mode: forwards;
  
}

.wrap:nth-child(2){
  animation: move 12s infinite linear;
  animation-delay: 6s;
}

.wall {
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  animation: fade 12s infinite linear;
  animation-delay: 0;
}

.wrap:nth-child(2) .wall {
  animation-delay: 6s;
}

.wall-right {
  transform: rotateY(90deg) translateZ(500px);
}

.wall-left {
  transform: rotateY(-90deg) translateZ(500px);
}

.wall-top {
  transform: rotateX(90deg) translateZ(500px);
}

.wall-bottom {
  transform: rotateX(-90deg) translateZ(500px);
}

.wall-back {
  transform: rotateX(180deg) translateZ(500px);
}

@keyframes move {
  0%{
    transform: translateZ(-500px) rotate(0deg);
  }
  100%{
    transform: translateZ(500px) rotate(0deg);
  }
}

@keyframes fade {
  0%{
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}












































/* 
.scene { 
  animation: 🤫 300s infinite linear;
}

@keyframes 🤫 {
  0%{
    filter: hue-rotate(0)
  }
  50% {
    filter: hue-rotate(180deg) saturation(5);
    transform: scaleX(4000);
    perspective: 50px;
  }
 
  100%{
    filter: hue-rotate(360deg);
  }
} 
*/

</style>