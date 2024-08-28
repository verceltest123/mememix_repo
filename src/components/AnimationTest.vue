<template>
    <div class="animation-wrapper">
      <div ref="staggerVisualizer" class="stagger-visualizer">
        <div class="cursor"></div>
        <div ref="dotsWrapper" class="dots-wrapper"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import anime from 'animejs/lib/anime.es.js';
  
  const staggerVisualizer = ref(null);
  const dotsWrapper = ref(null);
  
  function fitElementToParent(el, padding) {
    let timeout = null;
  
    function resize() {
      if (timeout) clearTimeout(timeout);
      anime.set(el, { scale: 1 });
      const pad = padding || 0;
      const parentEl = el.parentNode;
      const elOffsetWidth = el.offsetWidth - pad;
      const parentOffsetWidth = parentEl.offsetWidth;
      const ratio = parentOffsetWidth / elOffsetWidth;
      timeout = setTimeout(() => anime.set(el, { scale: ratio }), 10);
    }
  
    resize();
    window.addEventListener('resize', resize);
  
    // Cleanup on component unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize);
      if (timeout) clearTimeout(timeout);
    });
  }
  
  onMounted(() => {
    const staggerVisualizerEl = staggerVisualizer.value;
    const dotsWrapperEl = dotsWrapper.value;
    const dotsFragment = document.createDocumentFragment();
    const grid = [20, 10];
    const cell = 55;
    const numberOfElements = grid[0] * grid[1];
    let animation;
    // eslint-disable-next-line
    let paused = true;
  
    fitElementToParent(staggerVisualizerEl, 0);
  
    // Image URL for dots
    // const dotImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZzJvrmYm2fWhrpyQFjolMGG46XrAc9lfeMA&s';
  
    for (let i = 0; i < numberOfElements; i++) {
      const dotEl = document.createElement('div');
      dotEl.classList.add('dot');
    //   dotEl.style.backgroundImage = `url('${dotImageUrl}')`;
    //   dotEl.style.backgroundSize = 'cover';
    //   dotEl.style.backgroundPosition = 'center';
    //   dotEl.style.backgroundRepeat = 'no-repeat';
      dotsFragment.appendChild(dotEl);
    }
  
    dotsWrapperEl.appendChild(dotsFragment);
  
    let index = anime.random(0, numberOfElements - 1);
    let nextIndex = 0;
  
    anime.set('.stagger-visualizer .cursor', {
      translateX: anime.stagger(-cell, { grid, from: index, axis: 'x' }),
      translateY: anime.stagger(-cell, { grid, from: index, axis: 'y' }),
      translateZ: 0,
      scale: 1.5,
    });
  
    function play() {
      paused = false;
      if (animation) animation.pause();
  
      nextIndex = anime.random(0, numberOfElements - 1);
  
      animation = anime
        .timeline({
          easing: 'easeInOutQuad',
          complete: play,
        })
        .add({
          targets: '.stagger-visualizer .cursor',
          keyframes: [
            { scale: 0.75, duration: 120 },
            { scale: 2.5, duration: 220 },
            { scale: 1.5, duration: 450 },
          ],
          duration: 300,
        })
        .add(
          {
            targets: '.stagger-visualizer .dot',
            keyframes: [
              {
                translateX: anime.stagger('-2px', {
                  grid,
                  from: index,
                  axis: 'x',
                }),
                translateY: anime.stagger('-2px', {
                  grid,
                  from: index,
                  axis: 'y',
                }),
                duration: 100,
              },
              {
                translateX: anime.stagger('4px', {
                  grid,
                  from: index,
                  axis: 'x',
                }),
                translateY: anime.stagger('4px', {
                  grid,
                  from: index,
                  axis: 'y',
                }),
                scale: anime.stagger([2.6, 1], { grid, from: index }),
                duration: 225,
              },
              {
                translateX: 0,
                translateY: 0,
                scale: 1,
                duration: 1200,
              },
            ],
            delay: anime.stagger(80, { grid, from: index }),
          },
          30
        )
        .add(
          {
            targets: '.stagger-visualizer .cursor',
            translateX: {
              value: anime.stagger(-cell, {
                grid,
                from: nextIndex,
                axis: 'x',
              }),
            },
            translateY: {
              value: anime.stagger(-cell, {
                grid,
                from: nextIndex,
                axis: 'y',
              }),
            },
            scale: 1.5,
            easing: 'cubicBezier(.075, .2, .165, 1)',
          },
          '-=800'
        );
  
      index = nextIndex;
    }
  
    play();
  });
  </script>
  
  <style scoped>
  .animation-wrapper {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
  
  .stagger-visualizer {
    position: absolute;
    width: 1100px;
    height: 550px;
    transform-origin: left top;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .stagger-visualizer .dots-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(20, 1fr);
    grid-template-rows: repeat(10, 1fr);
    gap: 10px;
  }
  
  .stagger-visualizer .dot {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .stagger-visualizer .cursor {
    background: url('@/assets/fire.png')
      no-repeat center center;
    background-size: cover;
    position: absolute;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    z-index: 2;
  }
  </style>
  