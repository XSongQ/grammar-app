<template>
    <!-- 外层v-card负责背景色 -->
    <v-card class="background-card">
        <!-- 内层v-card负责内容布局 -->
        <v-card class="content-card" flat>
            <v-card-text>
                <div class="display_part">
                    <p class="english-paragraph" v-html="processedSentence"></p>
                    <p class="chinese-paragraph"></p>  <!-- [! ++ 添加class ++] -->
                    <hr style="margin-top: 20px;"/>
                </div>

                <div class="operation-section">
                    <v-container>
                        <v-row align="end" no-gutters>
                            <v-col 
                                v-for="(word, index) in words" 
                                :key="index" 
                                cols="1"
        
                            >
                                <WordCard :class="word.position" :word="word" :status="false" />
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-card-text>
        </v-card>
    </v-card>
</template>

<style scoped>
/* 外层卡片样式 */
.background-card {
    background-color: #D9ECFF;
    padding: 20px;
    margin: 20px;
    /* [! -- 移除min-height: 700px; --] */
}

/* 内层卡片样式 */
.content-card {
    background: transparent !important;  /* 移除内层背景色 */
    /* [! -- 移除min-height: 700px; --] */
}

.display_part .english-paragraph  {
    margin: auto 20px;
    text-align: left;
}

/* 新增样式 */
.display_part .chinese-paragraph {
    min-height: 1.5em;  /* [! ++ 保持与第一段相同高度 ++] */
}

.v-card__text {
    padding: 0 !important;  /* 移除内层卡片的默认padding */
}

.operation-section {
    padding: 15px 0;  /* 增加操作区域的内间距 */
}

/* 保持原有其他样式不变 */
</style>

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
            components: [],  // [! -- 这个属性未被使用 --]
            words: []        // [! ++ 新增响应式数据 ++]
        }
    },
    computed: {
        processedSentence() {
            return this.words
                .map((word, index) => 
                    `<span class="word-${index}">${word.text}</span>`
                ).join(' ') || ''
        },
        sectionHeight() {
            const rows = Math.ceil(this.words.length / 6); // [! -- 原components改为words --]
            return `calc(${rows} * (var(--word-card-height) + var(--row-gap)))`;
        }
    },
    watch: {
        analysisResult: {
            immediate: true,
            handler(newVal) {
                try {
                    const result = JSON.parse(newVal);
                    this.words = (result.components || []).flatMap(component => {
                        const words = component.text.split(' ');
                        return words.map((text, splitIndex) => ({
                            ...component,   // 保留原始属性
                            text,           // 拆分后的单词
                            splitIndex      // 记录拆分索引
                        }));
                    });
                    console.log('处理后的单词数组:', this.words)
                } catch (error) {
                    console.error('解析出错:', error);
                    this.words = [];  // [! ++ 保持数据一致性 ++]
                }
            }
        }
    }
}
</script>

