<template>
    <div class="bottomLeft">
        <a href="https://www.x.com/mememix_app" target="_blank"><img src="@/assets/xlogo.webp" style="width:50px;"></a>
    </div>
</template>


<script>
export default {
    name: 'BottomLeft'
}
</script>

<style scoped>

.bottomLeft{
    position:fixed;
    bottom: 0;
    right:0;
    cursor:pointer;
}

@media (max-width: 768px) {
  
  .bottomLeft{
      display: none;
  }
}

</style>