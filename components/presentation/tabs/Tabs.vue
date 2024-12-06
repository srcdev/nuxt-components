<template>
  <div role="tablist" aria-labelledby="channel-name" ref="navContainerRef">
    <button @click.prevent="navItemClicked($event)" id="tab-1" data-tab-index="1" role="tab" aria-controls="tabPanel-1" aria-selected="true">Home</button>
    <button @click.prevent="navItemClicked($event)" id="tab-2" data-tab-index="2" role="tab" aria-controls="tabPanel-2" aria-selected="false">Videos</button>
    <button @click.prevent="navItemClicked($event)" id="tab-3" data-tab-index="3" role="tab" aria-controls="tabPanel-3" aria-selected="false">Shorts</button>
    <button @click.prevent="navItemClicked($event)" id="tab-4" data-tab-index="4" role="tab" aria-controls="tabPanel-4" aria-selected="false">Playlists</button>
    <button @click.prevent="navItemClicked($event)" id="tab-5" data-tab-index="5" role="tab" aria-controls="tabPanel-5" aria-selected="false">Community</button>
    <button @click.prevent="navItemClicked($event)" id="tab-6" data-tab-index="6" role="tab" aria-controls="tabPanel-6" aria-selected="false">Channels</button>
    <button @click.prevent="navItemClicked($event)" id="tab-7" data-tab-index="7" role="tab" aria-controls="tabPanel-7" aria-selected="false">About</button>
  </div>
  <div class="tab-panels" ref="tabPanelsRef">
    <div id="tabPanel-1" role="tabpanel" aria-labelledby="tab-1">
      <p>My intro video and some curratedfalse content</p>
    </div>

    <div id="tabPanel-2" hidden role="tabpanel" aria-labelledby="tab-2">
      <p>My hundreds of videos, all right here</p>
    </div>

    <div id="tabPanel-3" hidden role="tabpanel" aria-labelledby="tab-3">
      <p>A lot of content, all under 60 seconds</p>
    </div>

    <div id="tabPanel-4" hidden role="tabpanel" aria-labelledby="tab-4">
      <p>Binge watch some playlists here</p>
    </div>

    <div id="tabPanel-5" hidden role="tabpanel" aria-labelledby="tab-5">
      <p>Community posts and polls and whatnot</p>
    </div>

    <div id="tabPanel-6" hidden role="tabpanel" aria-labelledby="tab-6">
      <p>Channels I like go here I guess</p>
    </div>

    <div id="tabPanel-7" hidden role="tabpanel" aria-labelledby="tab-7">
      <p>About me</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const navContainerRef = ref<HTMLElement | null>(null);
const tabPanelsRef = ref<HTMLElement | null>(null);
// console.log('navContainerRef');
// console.log(navContainerRef.value);

const { initNavDecorators, navItemClicked } = useNavDecoration(navContainerRef);

onMounted(() => {
  initNavDecorators();
});

/*
const navContainerRef = document.querySelector('[role=tablist]');
const tabButtons = navContainerRef.querySelectorAll('[role=tab]');
const tabPanels = document.querySelectorAll('[role=tabpanel]');

navContainerRef.addEventListener('click', (e) => {
  const clickedTab = e.target.closest('button');
  const currentTab = navContainerRef.querySelector('[aria-selected="true"]');

  if (!clickedTab || clickedTab === currentTab) return;

  switchTab(clickedTab);
});

navContainerRef.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'Home':
      e.preventDefault();
      switchTab(tabButtons[0]);
      break;
    case 'End':
      e.preventDefault();
      switchTab(tabButtons[tabButtons.length - 1]);
      break;
  }
});

function moveLeft() {
  const currentTab = document.activeElement;

  if (!currentTab.previousElementSibling) {
    tabButtons.item(tabButtons.length - 1).focus();
  } else {
    currentTab.previousElementSibling.focus();
  }
}

function moveRight() {
  const currentTab = document.activeElement;
  if (!currentTab.nextElementSibling) {
    tabButtons.item(0).focus();
  } else {
    currentTab.nextElementSibling.focus();
  }
}

function switchTab(newTab) {
  const oldTab = navContainerRef.querySelector('[aria-selected="true"]');
  const activePanelId = newTab.getAttribute('aria-controls');
  const activePanel = navContainerRef.nextElementSibling.querySelector('#' + CSS.escape(activePanelId));
  tabButtons.forEach((button) => {
    button.setAttribute('aria-selected', false);
    button.setAttribute('tabindex', '-1');
  });

  tabPanels.forEach((panel) => {
    panel.setAttribute('hidden', true);
  });

  activePanel.removeAttribute('hidden', false);

  newTab.setAttribute('aria-selected', true);
  newTab.setAttribute('tabindex', '0');
  newTab.focus();
  moveIndicator(oldTab, newTab);
}

// move underline indicator
function moveIndicator(oldTab, newTab) {
  const newTabPosition = oldTab.compareDocumentPosition(newTab);
  const newTabWidth = newTab.offsetWidth / navContainerRef.offsetWidth;
  let transitionWidth;

  // if the new tab is to the right
  if (newTabPosition === 4) {
    transitionWidth = newTab.offsetLeft + newTab.offsetWidth - oldTab.offsetLeft;
  } else {
    // if the tab is to the left
    transitionWidth = oldTab.offsetLeft + oldTab.offsetWidth - newTab.offsetLeft;
    navContainerRef.style.setProperty('--_left', newTab.offsetLeft + 'px');
  }

  navContainerRef.style.setProperty('--_width', transitionWidth / navContainerRef.offsetWidth);

  setTimeout(() => {
    navContainerRef.style.setProperty('--_left', newTab.offsetLeft + 'px');
    navContainerRef.style.setProperty('--_width', newTabWidth);
  }, 220);
}
  */
</script>
<style lang="css">
[role='tablist'] {
  position: relative;
  display: flex;
  width: fit-content;
  border-bottom: 1px solid hsl(0 0% 30%);
  margin-block: 3rem;
}

[role='tablist']::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  scale: var(--_width, 0.125) 1;
  translate: var(--_left, 0) 0;
  transform-origin: left;
  transition: scale 200ms, translate 200ms;
  background: white;
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
}

[role='tab']:hover {
  opacity: 1;
}

[role='tab'][aria-selected='true'] {
  opacity: 1;
}
</style>
