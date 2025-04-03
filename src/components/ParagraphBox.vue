<template>
    <v-card>
        <v-card-text>
            <div class="operation-section">
                <v-container>
                    <v-row
                    align="end"
                    style="height: 150px;"
                    no-gutters
                    >
                        <v-col v-for="(word, index) in words" :key="index" cols="2">
                            <WordCard :word="word" />
                        </v-col>
                    </v-row>
                </v-container>
            </div>

            <div class="display_part">
                <p v-html="processedSentence"></p>
                <p></p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import WordCard from './WordCard.vue'

export default {
    components: {
        WordCard
    },
    props: {
        analysisResult: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            words: []
        }
    },
    computed: {
        processedSentence() {
            return this.words.map((word, index) => 
                `<span class="word-${index}">${word.text}</span>`
            ).join(' ') || ''
        },
        sectionHeight() {
            const rows = Math.ceil(this.words.length / 6); // 每行6个卡片
            return `calc(${rows} * (var(--word-card-height) + var(--row-gap)))`;
        }
    },
    watch: {
        analysisResult: {
            immediate: true,
            handler(newVal) {
                try {
                    // const jsonString = newVal
                        // .replace(/```json\n/, '')
                        // .replace(/\n```/, '')
                        // .replace(/\\n/g, '')
                        // .replace(/\\"/g, '"');
                    
                    const result = JSON.parse(newVal);
                    this.words = result.output || [];
                } catch (error) {
                    console.error('解析出错:', error);
                    this.words = [];
                }
            }
        }
    }
}
</script>

<style scoped>
  .v-card {
    background-color: #D9ECFF;
    padding: 20px;
    margin: 20px;
  }

  .operation-section {
    min-height: v-bind(sectionHeight); /* 使用计算属性动态设置高度 */
    min-width: var(--section-width);
    }

  .display_part p {
    min-width: var(--section-width);
    background-color: white;
    border: 1px solid #ccc;
    padding: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
