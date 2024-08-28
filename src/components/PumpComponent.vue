<template>
  <div>
    <span>What Market Cap do you want</span>
  </div>
    <div class="mc-select-container">
      <div class="select-wrapper">
        <select class="select-style" v-model="selectedMin" @change="updateMin" required>
          <option value="" disabled>Select min</option>
          <option v-for="option in filteredMinOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <h2>To</h2>

      <div class="select-wrapper">
        <select class="select-style" v-model="selectedMax" @change="updateMax" required>
          <option value="" disabled>Select max</option>
          <option v-for="option in filteredMaxOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div style="margin-top: 2rem;">
      <span>How many coins from the selected range do you want</span>
    </div>

    <div class="select-tokens">
      <NumberSlider @numCoins="handleSliderInput" :maxCoins= calculateMaxPumpCoins() />
    </div>

    <div style="margin-top: 2rem;">
      <span>How much SOL do you want to spend in total</span>
    </div>

    <div class="buttons-grid">
      <button
        v-for="(item, index) in amounts"
        :key="index"
        :class="['grid-button', { active: isActive(index) && !isInputActive() }]"
        @click="setActiveButton(index)"
      >
        <div class="button-content">
          <img src="@/assets/solana-logo.png" alt="Icon" style="width: 30px;">
          {{ item }}
        </div>
      </button>
    </div>

    <div style="margin-top: 1rem;">
      <span>Or enter custom amount</span>
    </div>

    <div class="input-sol">
      <button
        :class="['input-button-image', { 'input-button-image-selected': isInputActive(customAmount) }]"
        @click="increment"
      >
        <img src="@/assets/solana-logo.png" alt="Icon" style="width: 30px;">
      </button>
      <input
        type="text"
        v-model="customAmount"
        placeholder="ex. 5"
        @input="handleInputChange"
        :class="{ 'input-active': isInputActive(customAmount) }"
      >
    </div>

    <div style="margin-top: 2.5rem;">
      <button
        class="button-style"
        @click="triggerRandomize"
      >
        Randomize
      </button>
    </div>

</template>

<script>
import NumberSlider from './NumberSlider.vue';
import { mapGetters } from "vuex";

export default {
  name: 'PumpComponent',
  components: {
    NumberSlider,
  },
  data() {
    return {
      activeButton: null, // Index of the active button
      selectedMin: "", // No initial value, placeholder will be shown
      selectedMax: "", // No initial value, placeholder will be shown
      amounts: ["0.02", ".25", "0.5", "1", "2", "5"],
      customAmount: null,
      options: [
        { value: "10000", label: "$10,000" },
        { value: "20000", label: "$20,000" },
        { value: "30000", label: "$30,000" },
        { value: "40000", label: "$40,000" },
        { value: "50000", label: "$50,000" }
      ],
      showModal: false,
      numCoins: 1,
    };
  },
  computed: {
    filteredMinOptions() {
      return this.options.filter(option => !this.selectedMax || parseFloat(option.value) < parseFloat(this.selectedMax));
    },
    filteredMaxOptions() {
      return this.options.filter(option => !this.selectedMin || parseFloat(option.value) > parseFloat(this.selectedMin));
    },
    ...mapGetters(['numberPumpCoinsForRange']),

  
  },
  methods: {
    updateMin() {
      if (this.selectedMax && parseFloat(this.selectedMin) >= parseFloat(this.selectedMax)) {
        this.selectedMax = ""; // Reset max if min is greater than or equal to max
      }

      if (this.selectedMax != ""){
        this.getMaxCoinsForRange()
      }
    },
    updateMax() {
      if (this.selectedMin && parseFloat(this.selectedMax) <= parseFloat(this.selectedMin)) {
        this.selectedMin = ""; // Reset min if max is less than or equal to min
      }

      if (this.selectedMin != ""){
        this.getMaxCoinsForRange()
      }

    },
    setActiveButton(index) {
      this.activeButton = index;
      this.customAmount = null;
    },
    isActive(index) {
      return this.activeButton === index;
    },
    isInputActive() {
      return this.customAmount != null;
    },
    handleInputChange(event) {
      let value = event.target.value.trim();
      if (value == '') {
        this.customAmount = null;
      } else if (value.substr(value.length - 1) == '.') {
        // Ignore trailing dot
      } else {
        if (value == "0") {
          // Ignore zero
        } else if (parseFloat(value) < 0.1) {
          alert("0.1 is minimum buy");
        }
        this.customAmount = parseFloat(value);
      }
      this.activeButton = null;
    },
    handleSliderInput(value) {
      this.numCoins = parseInt(value); // Update the parent component's data
    },
    increment() {
      this.customAmount = this.customAmount ? this.customAmount + 1 : 1;
    },
    getMaxCoinsForRange(){

      let payload = {
        "min" : this.selectedMin,
        "max" : this.selectedMax
      }

      this.$store.dispatch('getPumpFunCoins' , payload)
    },
    calculateMaxPumpCoins(){
        console.log(this.numberPumpCoinsForRange)
        if (this.numberPumpCoinsForRange > 10){
          return 10
        }
        else {
          return this.numberPumpCoinsForRange
        }
    },
    triggerRandomize() {
      // this.$emit('open-modal');
      let amount = 0;
      if (this.customAmount != null){
        amount = this.customAmount
      }
      else if (this.activeButton != null ){
        amount = parseFloat(this.amounts[this.activeButton])
      }
      else {
        alert("Select amount of SOL")
        return
      }

      let payload = {}
      if (this.selectedMin != "" && this.selectedMax != ""){
          payload = {
          "amount" : amount,
          "numCoins" : this.numCoins,
          "type" : "P",
          "minMC" : parseInt(this.selectedMin),
          "maxMC" : parseInt(this.selectedMax)
        }
      }
      else{
        alert("Select Market Cap range")
        return
      }


    //   this.$store.dispatch("getBoughtCoins", "5LYYZCchQjdDvvCBJznsUDRBUfoSguW8G6KbRP8XXzHdmV1tk12TdUQz1K3Lab9r85GsRQKppEeHm5vhQpP8Evmf")
      this.$store.dispatch('buyCoins', payload)
    }
  }
};
</script>


<style scoped>

.mc-select-container {
  justify-content: center;
  display: flex; /* Align items in a row */
  align-items: center; /* Vertically center items */
  gap: 1rem; /* Space between items */
  margin-top: 2.5rem;
  width: 100%; /* Full width of the parent */
  max-width: 1000px; /* Optional: Max width for better control */
}

.select-wrapper {
  position: relative;
  width: 33%; /* Each select box takes up 33% of the container width */
}

.select-style {
  color: black;
  background-color: white;
  border: 3px solid black;
  padding: 10px 15px; /* Adjust padding for a smaller select */
  font-size: 16px; /* Smaller font size for the select box */
  box-shadow: 0 4px 0 black;
  cursor: pointer;
  border-radius: 10px; /* Same border radius as the button */
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease;
  appearance: none; /* Remove default arrow */
  -webkit-appearance: none; /* Remove default arrow for Safari */
  width: 100%;
  text-align: left; /* Align text to the left for a typical select box */
  padding-right: 40px; /* Space for the custom arrow */
}

.select-style:hover {
  background-color: #dedede;
}

.select-style:active {
  transform: translateY(4px);
  box-shadow: none;
}

/* Custom arrow styling */
.select-wrapper::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 15px; /* Adjusted right position */
  transform: translateY(-50%);
  width: 0; 
  height: 0; 
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid black;
  pointer-events: none; /* Allow clicks to pass through to the select element */
}




.input-sol{
margin-top: 1rem;
display: flex;
justify-content: center;
}

.input-button-image{
color: black;
background-color: white;
border: 3px solid black;
border-right: 0;
padding: 1px 10px;
font-size: 20px;
box-shadow: 0 4px 0 black;
cursor: pointer;
flex-grow: 0;
text-align: center;
border-top-left-radius: 10px !important;
border-bottom-left-radius: 10px;

}


.input-button-image-selected{
border-color: #d4a300; /* Darker yellow border for active state */
box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.5); /* Reflection effect */
background: linear-gradient(145deg, #ffcc00, #f7f700); /* Gradient effect for active button */
}

.input-sol input {
background-color: white;
color: black;
border: 3px solid black;
padding: 10px 20px;
font-size: 17px;
box-shadow: 0 4px 0 black;
outline: none;
/* border-top-left-radius: 10px; */
border-top-right-radius: 10px;
/* border-bottom-left-radius: 10px; */
border-bottom-right-radius: 10px;
width: 32%;
text-align: center;

&:hover {
background-color: #dedede;
}
&::selection {
color: white;
background-color: black;
}
}

.input-sol input.input-active {
border-color: #d4a300; /* Darker yellow border for active state */
box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.5); /* Reflection effect */
background: linear-gradient(145deg, #ffcc00, #f7f700); /* Gradient effect for active button */
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

.buttons-grid {
display: grid;
grid-template-columns: repeat(3, 1fr); /* 3 columns */
gap: 10px; /* Gap between buttons */
width: 100%;
max-width: 300px; /* Limit the width for large screens */
margin-top: 2rem; /* Space between slider and grid */
}

/* Grid Button Styles */
.grid-button {
display: flex;
flex-direction: row;
gap: 10px;
align-items: center;
justify-content: center;
background-color: white;
border: 3px solid black;
border-radius: 10px;
padding: 10px;
font-size: 1.2rem;
color: black;
cursor: pointer;
text-align: center;
box-shadow: 0 4px 0 black;
transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease;
}

/* Grid Button Hover State */
.grid-button:hover {
background-color: #dedede; /* Light gray background on hover */
}

/* Grid Button Active State */
.grid-button:active {
background-color: #cccccc; /* Slightly darker gray when button is pressed */
transform: translateY(4px); /* Button moves down on click */
box-shadow: 0 2px 2px black; /* Reduced shadow when pressed */
}

/* Optional: Active class for selected state */
.grid-button.active {
background: linear-gradient(145deg, #ffcc00, #f7f700); /* Gradient effect for active button */
border-color: #d4a300; /* Darker yellow border for active state */
color: black; /* Text color */
box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.5); /* Reflection effect */
}



.select-tokens{
padding-top:3rem;
width: 100%;
}

.trending-container{
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;


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
/* height: 50vh; Adjusted height to be more flexible */
background-color: white;
box-shadow: 0 4px 0 black;
border-bottom-left-radius: 10px;
border-bottom-right-radius: 10px;
}

.main-section {
margin-top: 5vw;
display: flex;
flex-direction: row;
justify-content: center;
width: 100%;
}

.header-text {
font-size: 3rem;
color: black;
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
</style>