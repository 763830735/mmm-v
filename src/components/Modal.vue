<script setup>

</script>

<template>
  <div class="mmm-container">
    <div class="mmm-overlay">
        <slot/>
    </div>
  </div>
</template>

<style scoped>
  .mmm-container{
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .mmm-overlay{
    width: 100%;
    height: 100%;
    background-color: #00000080;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
