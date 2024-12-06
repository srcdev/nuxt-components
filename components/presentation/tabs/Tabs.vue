<template>
  <div role="tablist" aria-labelledby="channel-name" ref="navContainerRef">
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="1" data-nav-item role="tab" aria-selected="true">Home</button>
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="2" data-nav-item role="tab" aria-selected="false">Functional Components</button>
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="3" data-nav-item role="tab" aria-selected="false">Static UI Components</button>
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="4" data-nav-item role="tab" aria-selected="false">Example Form</button>
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="5" data-nav-item role="tab" aria-selected="false">Buttons</button>
    <button @click.prevent="navItemClicked($event)" @mouseover="navItemHovered($event)" data-tab-index="6" data-nav-item role="tab" aria-selected="false">Typography</button>
  </div>
</template>

<script setup lang="ts">
const navContainerRef = ref<HTMLElement | null>(null);

const { initNavDecorators, navItemClicked, navItemHovered } = useNavDecoration(navContainerRef);

onMounted(() => {
  initNavDecorators();
});
</script>

<style lang="css">
[role='tablist'] {
  position: relative;
  display: flex;
  width: fit-content;
  border-bottom: 1px solid hsl(0 0% 30%);
  margin-block: 3rem;
}

[role='tablist']::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  scale: var(--_width-hovered, 0.125) 1;
  translate: var(--_left-hovered, 0) 0;
  transform-origin: left;
  transition: scale var(--_transition-duration), translate var(--_transition-duration);
  background: green;
  z-index: 1;
}

[role='tablist']::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  border-bottom: 4px solid white;
  scale: var(--_width-active, 0.125) 1;
  translate: var(--_left-active, 0) 0;
  transform-origin: left;
  transition: scale var(--_transition-duration), translate var(--_transition-duration);
  background: transparent;
  z-index: 3;
}

[role='tab'] {
  color: #fff;
  background: lightblue;
  background: transparent;
  padding: 1em 2em;
  border: 0;
  font: inherit;
  text-transform: uppercase;
  font-weight: 500;
  opacity: 0.7;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

[role='tab']:hover {
  opacity: 1;
}

[role='tab'][aria-selected='true'] {
  opacity: 1;
}
</style>
