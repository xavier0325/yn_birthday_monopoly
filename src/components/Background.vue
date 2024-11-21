<template>
  <div class="background">
    <div class="stars"></div>
    <div class="clouds">
      <div v-for="n in 8" :key="`cloud-${n}`" class="cloud" :style="getCloudStyle(n)"></div>
    </div>
    <div class="floating-items">
      <div v-for="n in 20" :key="n" class="item" :style="getItemStyle(n)">
        {{ getRandomEmoji() }}
      </div>
    </div>
    <div class="decorations">
      <div class="corner-decoration top-left">🎀</div>
      <div class="corner-decoration top-right">🎈</div>
      <div class="corner-decoration bottom-left">🎪</div>
      <div class="corner-decoration bottom-right">🎨</div>
    </div>
    <div class="bubbles">
      <div v-for="n in 20" :key="`bubble-${n}`" class="bubble" :style="getBubbleStyle(n)">
        <div class="bubble-inner"></div>
      </div>
    </div>
    <div class="gradient-overlay"></div>
  </div>
</template>

<script setup lang="ts">
const emojis = ['🎂', '🎁', '🎈', '🎊', '✨', '🎯', '🎪', '🎨', '🎭', '🎡', '🎢', '🎵', '🎶', '🌟', '🍰', '🧁', '🍭', '🍬', '🎪', '🎠'];

const getRandomEmoji = () => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getItemStyle = (index: number) => {
  return {
    left: `${(index * 5)}%`,
    animationDelay: `${-(index * 0.5)}s`,
    animationDuration: `${6 + index * 0.5}s`,
    fontSize: `${1.2 + Math.random()}rem`,
    filter: `hue-rotate(${index * 20}deg)`,
  };
};

const getBubbleStyle = (index: number) => {
  const size = 15 + Math.random() * 40;
  return {
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${-(index * 0.2)}s`,
    animationDuration: `${3 + Math.random() * 4}s`,
  };
};

const getCloudStyle = (index: number) => {
  return {
    left: `${(index * 30 - 20)}%`,
    top: `${10 + Math.random() * 20}%`,
    transform: `scale(${0.8 + Math.random() * 0.4})`,
    animationDelay: `${-index * 10}s`,
    animationDuration: `${30 + Math.random() * 20}s`,
  };
};
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(135deg, #FFE5F9 0%, #E0F4FF 50%, #FFF0E5 100%);
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, @primary-light, rgba(99, 102, 241, 0)),
    radial-gradient(2px 2px at 40px 70px, @secondary-light, rgba(236, 72, 153, 0)),
    radial-gradient(2px 2px at 50px 160px, @primary-light, rgba(99, 102, 241, 0)),
    radial-gradient(2px 2px at 90px 40px, @secondary-light, rgba(236, 72, 153, 0)),
    radial-gradient(2px 2px at 130px 80px, @primary-light, rgba(99, 102, 241, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: twinkle 4s infinite;
  opacity: 0.3;
}

.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .cloud {
    position: absolute;
    width: 100px;
    height: 40px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    animation: floatCloud linear infinite;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));

    &::before,
    &::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
    }

    &::before {
      width: 50px;
      height: 50px;
      top: -20px;
      left: 15px;
    }

    &::after {
      width: 40px;
      height: 40px;
      top: -15px;
      right: 15px;
    }
  }
}

.floating-items {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .item {
    position: absolute;
    animation: floatItem 6s infinite;
    opacity: 0.8;
    transform-origin: center;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
}

.decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .corner-decoration {
    position: absolute;
    font-size: 3rem;
    animation: bounce 2s infinite;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

    &.top-left {
      top: 20px;
      left: 20px;
      animation-delay: 0s;
    }
    &.top-right {
      top: 20px;
      right: 20px;
      animation-delay: 0.5s;
    }
    &.bottom-left {
      bottom: 20px;
      left: 20px;
      animation-delay: 1s;
    }
    &.bottom-right {
      bottom: 20px;
      right: 20px;
      animation-delay: 1.5s;
    }
  }
}

.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .bubble {
    position: absolute;
    bottom: -100px;
    border-radius: 50%;
    animation: rise linear infinite;

    .bubble-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.2)
      );
      box-shadow: 
        inset -2px -2px 4px rgba(0, 0, 0, 0.1),
        0 0 10px rgba(255, 255, 255, 0.5);
    }
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.2) 100%
  );
  pointer-events: none;
}

@keyframes floatCloud {
  from { transform: translateX(-120%); }
  to { transform: translateX(120vw); }
}

@keyframes floatItem {
  0% {
    transform: translateY(-100%) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
    transform: translateY(-80%) rotate(45deg) scale(1);
  }
  90% {
    opacity: 0.8;
    transform: translateY(80%) rotate(315deg) scale(1);
  }
  100% {
    transform: translateY(100%) rotate(360deg) scale(0.8);
    opacity: 0;
  }
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) scale(1.2) rotate(360deg);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .decorations .corner-decoration {
    font-size: 2rem;
  }
}
</style> 