<template>
    <!-- 外层v-card负责背景色 -->
    <v-card class="background-card">
        <!-- 内层v-card负责内容布局 -->
        <v-card class="content-card">
            <v-card-text>
                <div class="display-part">
                    <p class="english">
                        <!-- WordSpan状态由WordCard决定，通过isCardNotFlipped数组 -->
                        <WordSpan 
                            v-for="(wordDetails, index) in parts"
                            v-bind:key="index"
                            v-bind:wordDetails="wordDetails"
                            v-bind:needFlip="!Boolean(isCardNotFlipped[index]) || kernel_count[wordDetails.sentenceNum] === 0"
                            ref="wordSpans"
                        />
                    </p>
                    <p class="chinese"></p>
                    <hr v-show="words.length" style="margin-top: 20px;"/>
                </div>

                <div class="operation-part">
                    <v-container>
                        <v-row no-gutters>
                            <v-col
                                v-for="(wordDetails, index) in words"
                                v-bind:key="index"
                                cols="2"                            
                            >
                                <WordCard
                                    v-bind:wordDetails="wordDetails" 
                                    v-bind:curSentenceNum="curSentenceNum" 
                                    v-on:check="checkSentence"  
                                    v-bind:isKernelComplete="kernel_count[wordDetails.sentenceNum] === 0"
                                    v-bind:turn_card_processed="turn_card_processed"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-card-text>
        </v-card>
    </v-card>
</template>

<script>
import WordCard from './WordCard.vue'
import WordSpan from './WordSpan.vue'

export default {
    props: {
        // JSON格式传入
        analysisResult: {
            type: String,
        }
    },

    data() {
        return {
            words: [],  // WordCard
            parts: [],  // WordSpan
            curSentenceNum: 1,
            isCardNotFlipped: [],
            kernel_count: [],
            clause_role_signals: [],

            turn_card_processed: false
        }
    },

    components: {
        WordCard,
        WordSpan
    },

    created() {
        try{
            // 将传入的JSON格式结果转换成对象
            const result = JSON.parse(this.analysisResult) 
            
            // 创建n个子组件WordCard和子组件WordSpan，前序遍历
            // 初始化状态记录数组isCardNotFlipped和curSentenceNum
            // 确保每一层的components是数组
            // sentenceSeq系列用于初始化，sentenceNum系列用于后续更新
            let sentenceSeq = 0
            const traverse = element => {
                if(element.hasOwnProperty('sentence')) sentenceSeq++  // 对sentence的定义很重要：本句中包含完整的主谓宾/表（而不把components中的算在内）
                let curSentenceSeq = sentenceSeq
                element.components.forEach(e => {
                    if(e.hasOwnProperty('components')) {
                        if(e.grammar_role) this.clause_role_signals.push({
                            sentenceNum: curSentenceSeq,
                            grammar_role: e.grammar_role,
                            part_id: this.isCardNotFlipped.length,
                            position: 'before'
                        })

                        traverse(e)

                        if(e.grammar_role) this.clause_role_signals.push({
                            sentenceNum: curSentenceSeq,
                            grammar_role: e.grammar_role,
                            part_id: this.isCardNotFlipped.length - 1,
                            position: 'after'
                        })
                    }
                    else {
                        let constituent_num = 0
                        this.parts.push({...e, sentenceNum: curSentenceSeq})
                        this.words.push(...e.text.split(' ').map(constituent => {
                            constituent_num++
                            return {
                                ...e,
                                constituent,
                                sentenceNum: curSentenceSeq,
                                part_id: this.isCardNotFlipped.length
                            }
                        }))
                        if(/[主谓动宾表]/.test(e.grammar_role)) {
                            this.kernel_count[curSentenceSeq] = this.kernel_count[curSentenceSeq] ? this.kernel_count[curSentenceSeq] + 1 : 1
                        } 
                        // 初始化状态记录数组isCardNotFlipped，共有constituent_num个没翻的同类WordCard
                        this.isCardNotFlipped.push(constituent_num)
                    }
                })
            }
            
            traverse(result)
        } catch(error) {
            console.error('解析出错：', error)
        }
    },

    methods: {
        checkSentence(part_id) {
            // this.isCardNotFlipped[part_id] === 0 时WordSpan会自动更新status
            this.isCardNotFlipped[part_id]--
            // console.log(part_id, this.parts[part_id].text,this.isCardNotFlipped[part_id])

            // 判断一个部分是否全部点开
            if(this.isCardNotFlipped[part_id] === 0 && /[主谓动宾表]/.test(this.parts[part_id].grammar_role)) {
                // 判断本句话kernel部分是否完成
                this.kernel_count[this.curSentenceNum]--
                if(this.kernel_count[this.curSentenceNum] === 0) {
                    this.curSentenceNum++
                    this.turn_card_processed = false
                } else {
                    this.turn_card_processed = true
                }      
            } 

            console.log(part_id, this.parts[part_id], this.turn_card_processed)
        }
    },

    watch: {
        curSentenceNum(newVal) {
            console.log(this.clause_role_signals)
            this.clause_role_signals.forEach(signal => {
                if (newVal > signal.sentenceNum) {
                    const wordSpan = this.$refs.wordSpans[signal.part_id].$el
                    const span = document.createElement('span')
                    span.className = 'clause-role'

                    if (signal.position === 'before') {
                        if(signal.grammar_role.includes('定')){
                            span.textContent = '('
                        } else if(signal.grammar_role.includes('状')){
                            span.textContent = '['
                        } else if(signal.grammar_role.includes('补')){
                            span.textContent = '<'
                        } else if(signal.grammar_role.includes('插入语')){
                            span.textContent = '^'
                        } else if(signal.grammar_role.includes('同位语')){
                            span.textContent = '{'
                        }
                        wordSpan.before(span)
                    } else {
                        if(signal.grammar_role.includes('定')){
                            span.textContent = ')'
                        } else if(signal.grammar_role.includes('状')){
                            span.textContent = ']'
                        } else if(signal.grammar_role.includes('补')){
                            span.textContent = '>'
                        } else if(signal.grammar_role.includes('插入语')){
                            span.textContent = '^'
                        } else if(signal.grammar_role.includes('同位语')){
                            span.textContent = '}'
                        }
                        wordSpan.after(span)
                    }

                    signal.sentenceNum = Infinity   // 确保只执行一次
                }
            })
        }
    }
}
</script>


<style scoped>
/* 外层卡片样式 */
.background-card {
    background-color: var(--color-background);
    /* background-color: #D9ECFF; */
    padding: 20px;
    margin: 20px;
}

/* 调整WordCard容器样式 */
.operation-part {
    padding: 15px 0;
    max-width: 1200px; 
    min-width: 100vh;
    margin: 0 auto;    
}

/* 内层卡片样式 */
.content-card {
    background: transparent !important;  /* 移除内层背景色 */
    /* [! -- 移除min-height: 700px; --] */
}

.display_part .english  {
    margin: auto 20px;
    text-align: left;
}

/* 新增样式 */
.display_part .chinese {
    min-height: 1.5em;  /* [! ++ 保持与第一段相同高度 ++] */
}

.v-card__text {
    padding: 0 !important;  /* 移除内层卡片的默认padding */
}


/* 保持原有其他样式不变 */
</style>