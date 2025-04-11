<template>
    <span v-if="needFlip">
        <span v-if="modifier_symbol.length"> {{ modifier_symbol[0] }} </span>
        <span>{{ wordDetails.prepositive_punctuation || " " }}</span>
        <span :class="underlineClass">
            {{ wordDetails.text }}
        </span>
        <span>{{ wordDetails.trailing_punctuation || " " }}</span>
        <span v-if="modifier_symbol.length"> {{ modifier_symbol[1] }} </span>
    </span>
    <!-- 圈画后的内容⬆；原始内容⬇ -->
    <span v-else>
        {{ `${wordDetails.prepositive_punctuation || ' '}${wordDetails.text}${wordDetails.trailing_punctuation || ' '}` }}
    </span>
</template>

<script>
    export default {
        props: {
            wordDetails: {
                type: Object,
                required: true
            },

            needFlip: {
                type: Boolean,
                required: true
            },
        },

        // mounted() {
        //     console.log(this.wordDetails)
        // },

        data() {
            return {
                modifier_symbol: []
            }
        },

        created() {
            if(this.wordDetails.grammar_role.includes('定语')){
                this.modifier_symbol.push('(', ')')
            } else if(this.wordDetails.grammar_role.includes('状')){
                this.modifier_symbol.push('[', ']')
            } else if(this.wordDetails.grammar_role.includes('补')){
                this.modifier_symbol.push('<', '>')
            } else if(this.wordDetails.grammar_role.includes('插入语')){
                this.modifier_symbol.push('^', '^')
            } else if(this.wordDetails.grammar_role.includes('同位语')){
                this.modifier_symbol.push('{', '}')
            }
        },

        computed: {
            underlineClass() {
                return {
                    'subject': this.wordDetails.grammar_role.includes('主'),
                    'predicate_verb': this.wordDetails.grammar_role.includes('谓') || this.wordDetails.grammar_role.includes('动'),
                    'object': this.wordDetails.grammar_role.includes('宾'),
                    'predicative': this.wordDetails.grammar_role.includes('表'),
                    'conjunction': this.wordDetails.grammar_role.includes('连')
                }
            }
        },
    }

</script>

<style scoped>
.subject {
    text-decoration: underline double var(--color-subject);
}

.predicate_verb {
    text-decoration: underline wavy var(--color-predicate);    
}

.object {
    text-decoration: underline var(--color-object);     
}

.predicative {
    text-decoration: underline dotted var(--color-predicative);     
}

.conjunction {
    font-weight: bold;   
}

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
  