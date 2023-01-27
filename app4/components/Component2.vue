<script setup>
  import { ref } from 'vue'
  const textColor = ref("black")

  function toggleColor() {
  textColor.value = (textColor.value == 'blue') ? "red" : "blue"
}
  function returnColor(){
    if (textColor.value = 'blue' || 'red') {
      textColor.value = 'black'
    } }

</script>

<template>
<div id="component2">
  <br>
<span v-bind:class="textColor">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor ultrices sapien et vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer non justo dui. Sed id porta lectus. Fusce pulvinar mi tellus, nec euismod lectus cursus eget.</span>
  <p>Proin gravida commodo velit, ut consequat lectus mattis et. In porta vitae sem id rutrum. Suspendisse vitae erat cursus, venenatis nisi vitae, consequat est. Donec nec egestas elit, quis tristique metus. Vivamus vel dolor posuere, malesuada nunc ut, vehicula ipsum. Nulla luctus malesuada sodales. </p>
  <p>Duis non ligula est. Vivamus blandit mattis mi, sed ullamcorper velit sollicitudin et. Suspendisse in turpis pulvinar purus commodo dignissim. Vivamus sagittis nec purus in suscipit. In pulvinar pharetra velit, sit amet fringilla purus egestas eget. Nullam diam urna, scelerisque ac porttitor non, faucibus eget massa. </p>
<button class="button"  @click="toggleColor">Change Color</button>
<button class="button"  @click="returnColor">Original Color</button>


</div>


</template>

<style>
.blue {
  color: blue;
}
.red {
  color: red;
}

</style>