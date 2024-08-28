<template>

    <wallet-multi-button></wallet-multi-button>

       
   <!--<button @click="this.$store.dispatch('sampleTransaction')" name="lo" value="lo"/> -->
</template>


<script>
import { WalletMultiButton } from 'solana-wallets-vue'


export default {

name: 'WalletWrapper',
components:{ WalletMultiButton},
props: {
  msg: String
},
created(){
       this.$store.commit('newWallet')
       this.$store.dispatch('tryGMGN')
}
}


</script> 

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.swv-modal-wrapper .swv-button:not([disabled]):hover {
  background:   rgb(100, 102, 255)!important;
}

/* .swv-modal-button-close{
border: 2px solid rgb(100, 102, 255)!important;
}

.swv-modal-button-close svg{
color: rgb(100, 102, 255)!important;
} */

  

.swv-modal-wrapper{
background-color: black!important;
color: white !important;
/* font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; */
font-family: "IBM Plex Mono", sans-serif!important;
}
.swv-button {
  /* border-top-left-radius: var(--swv-button-radius)!important;
  border-bottom-left-radius: var(--swv-button-radius)!important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important; */
  /* font-family: "IBM Plex Mono", sans-serif!important;
  background-color: black!important;
  height: 2rem!important;
  font-size: 0.8rem!important;
  color:white!important; */

}

.swv-button {
color: black !important;
background-color: white!important;
border: 3px solid black !important;
padding: 15px 20px;
font-size: 20px;
box-shadow: 0 4px 0 rgb(211, 1, 211) !important;
cursor: pointer;
text-align: center;
flex-grow: 1;
text-align: center;
border-radius: 10px !important; /* Same border radius as header buttons */
transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease;
font-family: "IBM Plex Mono", sans-serif!important;
}

.swv-button:hover {
background-color: #dedede;
}

.swv-button p {
/* font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; */
/* font-family: "IBM Plex Mono", sans-serif!important; */
}

.swv-modal-title{
/* font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; */
font-family: "IBM Plex Mono", sans-serif!important;
}


.swv-button-icon, .swv-button-icon img{
    width: 1.2rem!important;
    height: 1.2rem!important;
    padding-right: 0.1rem!important;
}



.stangerBoldBlack{
font-size: 1rem;
/* font-family: StangerCursive; */
font-family: "IBM Plex Mono", sans-serif!important;
}

.sketchy {

display: inline-block;
border: 3px solid #333333;
font-size: 1.3rem;
border-radius: 2% 6% 5% 4%/1% 1% 2% 4%;
text-transform: uppercase;
letter-spacing: 0.3ch;
background: #ffffff;

}
.sketchy::before {
content: "";
border: 2px solid #353535;
display: block;
width: 100%;
height: 100%;

border-radius: 1% 1% 2% 4%/2% 6% 5% 4%;
}
</style>