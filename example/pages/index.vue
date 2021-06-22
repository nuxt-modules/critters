<template>
  <div :class="toggle ? 'sample-class' : 'sample-unused-class'">
    some text
    <button @click="toggle = !toggle">Toggle class</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    toggle: true
  }),
}
</script>

<style>
.sample-class {
background: blue;
}
.sample-unused-class {
background: red;
}
</style>
