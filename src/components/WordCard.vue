<template>
  <v-card 
    class="word-card"
    :class="{ 'is-flipped': isFlipped, 'error-state': showError }"
    @click="handleClick"
  >
    <div class="card-inner">
      <div class="card-front">
        <v-card-text style="padding: 0;" class="text-center">
          {{ word.text }}  <!-- 修改为显示word对象的text属性 -->
        </v-card-text>
      </div>
      <div class="card-back">
        <v-card-text class="text-center">
          <div>语法角色: {{ word.grammar_role }}</div>
          <div>从句: {{ word.clause }}</div>
          <!-- 可以根据需要添加更多信息展示 -->
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    word: {
      type: Object,
      required: true
    },
    status: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isFlipped: false,
      showError: false
    }
  },
  methods: {
    handleClick() {
      if (!this.status) {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 500); // 动画持续时间
        return;
      }
      this.toggleFlip();
    },
    toggleFlip() {
      this.isFlipped = !this.isFlipped;
    }
  },
  // 调试信息，确保接收到的word对象被正确解析
  mounted() {
    console.log('Received word:', this.word);
  }
}
</script>

<style scoped>
.word-card {
  background-color: #ffffff !important;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  perspective: 1000px;
  min-width: 50px;
  height: 100px;
}


.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.is-flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}


@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.v-card-text {
  padding: 12px;
  overflow: visible;
  white-space: normal;
}

.error-state {
  background-color: #ffebee !important;
  animation: shake 0.5s;
}
</style>
