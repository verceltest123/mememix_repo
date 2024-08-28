<template>
  <div class="slider-wrapper">
    <div class="sliderContainer">
      <input type="range" value="1" min="1" :max=maxCoins id="slider" @input="updateValue">
      <span id="output">{{ sliderValue }}</span>
    </div>
  </div>
</template>

<script>
export default {

  name: 'NumberSlider',
  props: ['maxCoins'],
  data() {
    return {
      sliderValue: 1, // This will hold the current slider value
    };
  },
  mounted() {
    // Access DOM elements after the component is mounted
    var slider = document.getElementById("slider");
    var output = document.getElementById("output");
    output.innerHTML = slider.value;
  },
  methods: {
    updateValue(event) {
      this.sliderValue = event.target.value;
      this.$emit('numCoins', this.sliderValue); // Emit the value to the parent
    },
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&display=swap');


.slider-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: center;
}

div.sliderContainer {
 width: 25em;
 text-align: center;
}

#slider {
  -webkit-appearance: none;
  appearance: none;
  height: 18px !important;
  width: 100%;
  border-radius: 10em;
  background-color: black;
  outline: none;
  margin-bottom: 14px;
}

#slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 3px solid black;
}


#slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #dbc500;
  cursor: pointer;
  border: 3px solid #f4f4f4;
}

#slider:active::-webkit-slider-thumb {
    transform: scale(1.2);
}

#slider:active::-moz-range-thumb {
    transform: scale(1.2);
}

#output {
 font-family: "IBM Plex Mono", sans-serif;
 color: black;
 /* font-family: 'Roboto', sans-serif; */
 letter-spacing: 1.5px;
 font-size: 20px;
 margin-left: 5px;
 transition: color 0.3s ease;
}


</style>