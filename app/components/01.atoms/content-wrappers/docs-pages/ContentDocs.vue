<template>
  <component :is="tag" class="content-docs" :class="[elementClasses]">
    <div class="inner">
      <div v-if="hasDocsNav" class="docs-nav">
        <slot name="docsNav"></slot>
      </div>
      <div v-if="hasDocsContent" class="docs-content">
        <slot name="docsContent"></slot>
      </div>
      <div v-if="hasDocsPageNav" class="docs-page-nav">
        <slot name="docsPageNav"></slot>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: "div" | "section" | "article" | "main";
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  styleClassPassthrough: () => [],
});

const slots = useSlots();
const hasDocsNav = computed(() => !!slots.docsNav);
const hasDocsContent = computed(() => !!slots.docsContent);
const hasDocsPageNav = computed(() => !!slots.docsPageNav);

const { elementClasses, resetElementClasses } = useStyleClassPassthrough(props.styleClassPassthrough);

watch(
  () => props.styleClassPassthrough,
  () => {
    resetElementClasses(props.styleClassPassthrough);
  }
);
</script>

<style lang="css">
@layer components {
  .content-docs {
    container-type: inline-size;
    container-name: contentDocs;

    .inner {
      display: grid;
      grid-template-areas:
        "docsNav"
        "docsPageNav"
        "docsContent";
      gap: 1.6rem;
      align-items: start;

      @container contentDocs (width >= 768px) {
        grid-template-areas:
          "docsNav docsPageNav"
          "docsContent docsPageNav";
        gap: 1.6rem;
        grid-template-columns: 1fr 200px;
        grid-template-rows: auto 1fr;
      }

      @container contentDocs (width >= 1024px) {
        grid-template-areas: "docsNav docsContent  docsPageNav";
        gap: 1.6rem;
        grid-template-columns: 23rem 1fr 22rem;
      }

      .docs-nav {
        grid-area: docsNav;
        align-items: start;
      }
      .docs-content {
        grid-area: docsContent;
        align-items: start;
      }
      .docs-page-nav {
        grid-area: docsPageNav;
        align-items: start;
      }
    }
  }
}
</style>
