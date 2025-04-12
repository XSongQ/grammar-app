<template>
    <!-- 外层v-card负责背景色 -->
    <v-card class="background-card">
        <!-- 内层v-card负责内容布局 -->
        <v-card class="content-card">
            <v-card-text>
                <div class="display-part">
                    <p class="english">
                        <template v-for="(part, index) in parts" :key="index">
                            <WordSpan 
                                v-if="!part.isRoleMarker"
                                v-bind:wordDetails="part"
                                v-bind:needFlip="!Boolean(isCardNotFlipped[part.part_id]) || kernel_count[part.sentenceNum] === 0"
                            />
                            <span 
                                v-else-if="curSentenceNum > part.sentenceNum"
                                class="clause-role"
                            >
                                {{ part.symbol }}
                            </span>
                        </template>
                    </p>
                    <transition name="fade">
                        <p class="chinese" v-if="curSentenceNum > totalSentenceNum">
                            {{ translation }}
                        </p>
                    </transition>
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
                                    v-bind:kernelCount="kernel_count[wordDetails.sentenceNum]"
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

// 在文件顶部添加工具函数
function getRoleSymbol(grammar_role, position) {
    if (grammar_role.includes('定')) {
        return position === 'before' ? '(' : ')'
    } else if (grammar_role.includes('状')) {
        return position === 'before' ? '[' : ']'
    } else if (grammar_role.includes('补')) {
        return position === 'before' ? '<' : '>'
    } else if (grammar_role.includes('插入语')) {
        return '^'
    } else if (grammar_role.includes('同位语')) {
        return position === 'before' ? '{' : '}'
    } 
    else if (grammar_role.includes('宾语从句') || grammar_role.includes('表语从句')) return position === 'before' ? '«' : '»';
    else if (grammar_role.includes('主语从句')) return '§';
    else if(grammar_role.includes('引语')) return '"';
    return ''
}

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
            translation: "",

            curSentenceNum: 1,
            totalSentenceNum: 0,

            isCardNotFlipped: [],
            kernel_count: [],

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
            console.log(result)
            
            // 创建n个子组件WordCard和子组件WordSpan，前序遍历
            // 初始化状态记录数组isCardNotFlipped和curSentenceNum
            // 确保每一层的components是数组
            // sentenceSeq系列用于初始化，sentenceNum系列用于后续更新
            let sentenceSeq = 1
            // 用于处理标点逻辑：
            let real_component

            const traverse = element => {
                if(element.hasOwnProperty('subSentence')) sentenceSeq++  // 对sentence的定义很重要：本句中包含完整的主谓宾/表（而不把components中的算在内）
                let curSentenceSeq = sentenceSeq
                let subordinatePartCount = 0     // 主谓（动）宾（表）之外的成分数量
                element.components.forEach(e => {
                    // 标点符号处理
                    if(e.grammar_role.includes('标点')) {
                        if(e.text.includes('"') || e.text.includes("'")) return // 忽略引号
                        if(real_component) {
                            // 后置标点逻辑
                            this.parts[real_component].trailing_punctuation = e.text
                        } 
                        // console.log('标点位置' + real_component)
                        return
                    }

                    if(e.hasOwnProperty('components')) {
                        if(e.grammar_role) {
                            // 添加前括号到parts
                            this.parts.push({
                                isRoleMarker: true,
                                symbol: getRoleSymbol(e.grammar_role, 'before'),
                                sentenceNum: curSentenceSeq
                            })
                        }

                        traverse(e)

                        if(e.grammar_role) {
                            // 添加后括号到parts
                            this.parts.push({
                                isRoleMarker: true,
                                symbol: getRoleSymbol(e.grammar_role, 'after'),
                                sentenceNum: curSentenceSeq
                            })
                        }
                    }
                    else {
                        real_component = this.parts.length
                        // console.log(real_component)
                        
                        let constituent_num = 0
                        this.parts.push({
                            ...e, 
                            sentenceNum: curSentenceSeq,
                            part_id: this.isCardNotFlipped.length
                        })

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
                        } else {
                            subordinatePartCount++
                        }
                        // 初始化状态记录数组isCardNotFlipped，共有constituent_num个没翻的同类WordCard
                        this.isCardNotFlipped.push(constituent_num)
                    }
                })
                // kernel_count为正时句子具备主干结构，值为主干成分的count，为负时不具备主干，绝对值为所有其他次要成分的count
                if(!this.kernel_count[curSentenceSeq]) this.kernel_count[curSentenceSeq] = -subordinatePartCount
            }
            traverse(result)
            this.translation = result.translation
            this.totalSentenceNum = sentenceSeq
            // console.log(this.parts)

        } catch(error) {
            console.error('解析出错：', error)
        }
    },

    methods: {
        checkSentence(part_id, grammar_role) {
            // this.isCardNotFlipped[part_id] === 0 时WordSpan会自动更新status
            this.isCardNotFlipped[part_id]--
            // console.log(part_id, this.parts[part_id].text,this.isCardNotFlipped[part_id])

            // 判断一个部分是否全部点开
            if(this.isCardNotFlipped[part_id] === 0) {
                if(this.kernel_count[this.curSentenceNum] < 0) {
                    this.kernel_count[this.curSentenceNum]++
                } else if(/[主谓动宾表]/.test(grammar_role)) {
                    this.kernel_count[this.curSentenceNum]--    
                }
            } 


            // 判断本句话kernel部分是否完成
            if(this.kernel_count[this.curSentenceNum] === 0) {
                this.curSentenceNum++
                this.turn_card_processed = false
            } else {
                this.turn_card_processed = true
            }  

            console.log(this.curSentenceNum, this.totalSentenceNum)
            console.log(this.kernel_count)
        }
    },

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

/* 新增动画效果 */
.fade-enter-active {
    transition: opacity 1.5s ease;
}
.fade-enter-from {
    opacity: 0;
}
.fade-enter-to {
    opacity: 1;
}

/* 保持原有其他样式不变 */
.clause-role {
    color: #888;
    font-weight: bold;
    margin: 0 2px;
}
</style>