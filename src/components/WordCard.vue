<template>
  <!-- max-width配合父元素no-gutters正确调控布局间距 -->
  <v-card class="word-card"
    :style="{ backgroundColor: currentColor }"
    :class="{ 'is-flipped': isFlipped, 'error-state': showError }"
    @click="handleClick"
    @contextmenu.prevent="handleRightClick"
  >
    <div class="card-inner">
      <div class="card-front">
        <v-card-text style="padding: 0;" class="text-center">
          {{ wordDetails.constituent }}  <!-- 修改为显示word对象的text属性 -->
        </v-card-text>
      </div>

      <div class="card-back">
        <v-card-text class="text-center">
          <div>{{ wordDetails.constituent }}</div>
          <p>{{ wordDetails.translation }}</p>
          <p>语法角色: {{ wordDetails.grammar_role }}</p>
          <p v-if="wordDetails.target">修饰了：{{ wordDetails.target }}</p>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    wordDetails: {
      type: Object,
      required: true
    },
    curSentenceNum: {
      type: Number,
      required: true
    },
    kernelCount: {
      type: Number,
      required: true,
      default: false
    },

    turn_card_processed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isFlipped: false,
      showError: false,
      currentColor: 'var(--color-card-default)' 
    }
  },
  methods: {
    handleClick() {
      if(!this.isFlipped) {
        if(this.curSentenceNum !== this.wordDetails.sentenceNum 
        || this.kernelCount > 0 && !/[主谓动宾表连]/.test(this.wordDetails.grammar_role)) {
          this.showError = true
          setTimeout(() => {
            this.showError = false
          }, 500) // 动画持续时间
        } else {
          if(this.wordDetails.grammar_role.includes('主')) {
            this.currentColor = 'var(--color-subject)'
          } else if(/[谓动]/.test(this.wordDetails.grammar_role)) {
            this.currentColor = 'var(--color-predicate)'
          } else if(this.wordDetails.grammar_role.includes('宾')) {
            this.currentColor = 'var(--color-object)'
          } else if(this.wordDetails.grammar_role.includes('表')) {
            this.currentColor = 'var(--color-predicative)'
          } else if(this.wordDetails.grammar_role.includes('连')) {
            this.currentColor = 'var(--color-conjunction)'
          } else if(this.wordDetails.grammar_role.includes('定')) {
            this.currentColor = 'var(--color-attribute)'
          } else if(this.wordDetails.grammar_role.includes('状')) {
            this.currentColor = 'var(--color-adverbial)'
          } else if(this.wordDetails.grammar_role.includes('补')) {
            this.currentColor = 'var(--color-complement)'
          } else if(this.wordDetails.grammar_role.includes('插')) {
            this.currentColor = 'var(--color-parenthesis)'
          } else if(this.wordDetails.grammar_role.includes('同位语')) {
            this.currentColor = 'var(--color-appositive)'
          } else {
            // other未分类
            this.currentColor = 'var(--color-other)'
          }

          // isFlipped控制翻面动画
          this.isFlipped = true
          this.$emit('check', this.wordDetails.part_id, this.wordDetails.grammar_role)
        }

      }
    },
    handleRightClick() {
      if(!this.isFlipped) {
        if(this.curSentenceNum !== this.wordDetails.sentenceNum) {
          this.currentColor = 'var(--color-unprocessed)'
        } else if(!/[主谓动宾表连]/.test(this.wordDetails.grammar_role)) {
          this.currentColor = 'var(--color-inactive-clause)'
        }
      }
    },
  },

  watch: {
    kernelCount(newVal) {
      if(newVal === 0 && !this.isFlipped) {
        if(this.wordDetails.grammar_role.includes('定')){
          this.currentColor = 'var(--color-attribute)'
        } else if(this.wordDetails.grammar_role.includes('状')){
          this.currentColor = 'var(--color-adverbial)'
        } else if(this.wordDetails.grammar_role.includes('补')){
          this.currentColor = 'var(--color-complement)'
        } else if(this.wordDetails.grammar_role.includes('插入语')){
          this.currentColor = 'var(--color-parenthesis)'
        } else if(this.wordDetails.grammar_role.includes('连')) {
          this.currentColor = 'var(--color-conjunction)'
        }

        this.isFlipped = true
      }
    },

    turn_card_processed(newVal) {
      if(newVal && this.wordDetails.sentenceNum < this.curSentenceNum) this.currentColor = 'var(--color-processed)' 
    }
  },

  // 调试信息，确保接收到的word对象被正确解析
  // mounted() {
  //   console.log('Received word:', this.wordDetails.text, this.wordDetails.part_id)
  //   console.log(this.wordDetails.sentenceNum)
  // }
}
</script>

<style scoped>
.word-card {
  /* background-color: var(--color-card-default) !important; */
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  perspective: 1000px;
  min-width: 50px;
  height: 150px;
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
