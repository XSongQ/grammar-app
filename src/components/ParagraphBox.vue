<template>
    <v-btn color="primary">Vuetify 按钮</v-btn>
    
    <v-card>
        <v-card-text>
            <div class="operation-section">
                <v-container>
                    <v-row>
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
    data() {
        return {
            words: ['This', 'is', 'a', 'sample', 'sentence','with','some','words','in','it']
        }
    },
    computed: {
        processedSentence() {
            return this.words.map(word => `<span>${word}</span>`).join(' ')
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
    min-height: var(--section-height);
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
