<template>
  <div>
    <i a></i>
    <i b></i>
    <i c></i>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'CSS Battle',
  meta: [{ name: 'description', content: 'CSS Battle' }],
  bodyAttrs: {
    class: '',
  },
});
</script>

<style scoped lang="css">
html * {
  margin: 0;
  padding: 0;
}
div {
  height: 300px;
  width: 400px;
  background: #0b2429;
  display: grid;
  grid-template-areas: stack;
  place-content: center;

  i {
    grid-area: stack;
    margin: auto;
  }

  i[a] {
    background: #998235;
    height: 300px;
    width: 90px;
  }

  i[b] {
    background: #0b2429;
    height: 130px;
    width: 100%;
  }

  i[c] {
    background: #f3ac3c;
    height: 90px;
    width: 130px;
    border-radius: 5rem;
    outline: 1rem solid #0b2429;
  }
}
</style>
