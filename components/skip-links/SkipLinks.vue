<template>
  <ul class="home-link-navigation" aria-label="Home Navigation">
    <li class="home-link"><a href="/">Logo</a></li>
    <li class="skip-links">
      <ul class="skip-links-nav">
        <li class="skip-link-item"><a href="#main-content" class="skip-link" ref="skipLink">Skip to main content</a></li>
        <li class="skip-link-item"><a href="#footer" class="skip-link">Skip to footer</a></li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts" setup></script>

<style lang="css">
.home-link-navigation {
  position: relative;
  list-style: none;
  padding: 0;

  .skip-links {
    list-style: none;
    background-color: black;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 40px;
    left: 0;
    height: 0;
    overflow: hidden;
    transition: height 0.3s ease-in-out;

    &:focus-within {
      height: auto;
      z-index: 1000;
    }

    .skip-links-nav {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      background-color: black;

      border: 1px solid white;

      list-style: none;
      padding: 0.2rem;
      margin: 0;

      .skip-link-item {
        padding: 0.2rem;

        .skip-link {
          display: block;
          color: white;
          text-decoration: none;
          margin: 0.2rem;

          padding: 0.8rem 1.2rem;
          text-wrap: nowrap;

          &:focus-visible {
            outline: 2px solid white;
          }
        }
      }
    }
  }
}

/* .skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 12px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
} */
</style>
