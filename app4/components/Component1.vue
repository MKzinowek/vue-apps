<script setup>
  import { ref } from 'vue'
  const imgSrc = ref("Snapchat-1925431080.jpg")
  const title = ref("My camping trip in west Virginia")

  function changeImg(){
    if (imgSrc.value === "Snapchat-1925431080.jpg"){
      title.value = "One of my favorite pieces of art"
      imgSrc.value = "640px-Tsunami_by_hokusai_19th_century.jpg"
    }

    else {
      (imgSrc.value === "640px-Tsunami_by_hokusai_19th_century.jpg")
      title.value = "My camping trip in west Virginia"
      imgSrc.value = "Snapchat-1925431080.jpg"
    }
  }

</script>

<template>
<div id="component1">
  <div>
<h1 id="title"> {{ title }}</h1>
<img :src="imgSrc">
<br>
<button class="button" @click="changeImg" role="button">Toggle</button>


</div>
</div>


</template>

<style>
img {
  border-radius: 8px;
  width: auto;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CSS */
.button {
  appearance: none;
  background-color: #2ea44f;
  border: 1px solid rgba(27, 31, 35, .15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
}

.button:focus:not(:focus-visible):not(.focus-visible) {
  box-shadow: none;
  outline: none;
}

.button:hover {
  background-color: #2c974b;
}

.button:focus {
  box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
  outline: none;
}

.button:disabled {
  background-color: #94d3a2;
  border-color: rgba(27, 31, 35, .1);
  color: rgba(255, 255, 255, .8);
  cursor: default;
}

.button:active {
  background-color: #298e46;
  box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
}

</style>

