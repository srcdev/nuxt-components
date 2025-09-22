<template>
  <component :is="tag" class="magnetic-navigation" :class="[elementClasses]">
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: "div",
    validator(value: string) {
      return ["div", "header", "footer", "nav"].includes(value)
    },
  },
  styleClassPassthrough: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
})

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough)

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough)
  }
)
</script>

<style lang="css">
.magnetic-navigation {
  /*
  --_background-image: url("/images/rotating-carousel/image-3.webp");

  background-image: var(--_background-image);
  background-size: cover;
  background-position: 0 -400px;
  background-attachment: fixed;
*/
  /* padding-block: 200px 2000px; */

  nav {
    width: fit-content;
    margin: 3rem auto;
    background: hsl(0 0% 0% / 0.8);

    padding: 8px;
    border-radius: 8px;

    isolation: isolate;

    anchor-name: --hovered-link;

    li:hover {
      anchor-name: --hovered-link;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: calc(anchor(bottom) - 10px);
      left: calc(anchor(left) + 1rem);
      right: calc(anchor(right) + 1rem);
      bottom: calc(anchor(bottom) + 5px);
      border-radius: 10px;

      position-anchor: --hovered-link;

      transition: 500ms
        linear(
          0,
          0.029 1.6%,
          0.123 3.5%,
          0.651 10.6%,
          0.862 14.1%,
          1.002 17.7%,
          1.046 19.6%,
          1.074 21.6%,
          1.087 23.9%,
          1.086 26.6%,
          1.014 38.5%,
          0.994 46.3%,
          1
        );
    }

    &::before {
      z-index: -1;
      background: rgb(0 0 0 / 0.2);
      backdrop-filter: blur(2px);
    }

    &::after {
      z-index: -2;
      background-image: var(--_background-image);
      background-size: cover;
      background-position: var(--_background-position);
      background-attachment: fixed;
    }

    &:has(a:hover)::before,
    &:has(a:hover)::after {
      top: anchor(top);
      left: anchor(left);
      right: anchor(right);
      bottom: anchor(bottom);

      @supports (corner-shape: squircle) {
        corner-shape: squircle;
        border-radius: 50%;
      }
    }

    &:has(li:first-of-type a:hover)::before,
    &:has(li:first-of-type a:hover)::after {
      @supports (corner-shape: squircle) {
        border-radius: 32px 50% 50% 32px;
      }
    }

    &:has(li:last-of-type a:hover)::before,
    &:has(li:last-of-type a:hover)::after {
      @supports (corner-shape: squircle) {
        border-radius: 50% 32px 32px 50%;
      }
    }

    @supports (corner-shape: squircle) {
      border-radius: 24px;
      corner-shape: squircle;
    }

    > ul {
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      gap: 24px;

      a {
        display: block;
        padding: 1rem;
        text-decoration: none;
        color: white;
        font-size: var(--step-7);
      }
    }
  }
}
</style>
