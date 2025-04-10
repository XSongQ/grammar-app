<template>
    <Paragraph
        :analysisResult="testValue"
    />
</template>

<script>
import Paragraph from './Paragraph.vue';

export default {
    components: {
        Paragraph
    },
    data() {
        return {
            testValue: JSON.stringify(
            {       
                "sentence": "However, boxing was very crude, for there were no rules and a prizefighter could be seriously injured or even killed during a match.",
                "translation": "然而，拳击运动非常粗野，因为没有规则，职业拳击手可能会在比赛中严重受伤，甚至丧命。",
                "kernel_sentence": {
                    "sentence": "boxing was crude",
                    "translation": "拳击运动是粗野的。"
                },
                "components": [
                    {
                        "text": "However",
                        "grammar_role": "状语",
                        "target": "全句",
                        "translation": "然而",
                        "trailing_punctuation": ","
                    },
                    {
                        "text": "boxing",
                        "grammar_role": "主语",
                        "translation": "拳击运动"                    
                    },
                    {
                        "text": "was",
                        "grammar_role": "谓语", // 注意：LLM可能输出“系动词”
                        "translation": "是"
                    },
                    {
                        "text": "very",
                        "grammar_role": "状语",
                        "target": "crude",
                        "translation": "非常"
                    },
                    {
                        "text": "crude",
                        "grammar_role": "表语",
                        "translation": "粗野的",
                        "trailing_punctuation": ","
                    },
                    {
                        "text": "for there were no rules and a prizefighter could be seriously injured or even killed during a match",
                        "grammar_role": "状语",
                        "translation": "因为没有规则，职业拳击手可能会在比赛中严重受伤，甚至丧命",
                        "components": [
                            {
                                "text": "for",
                                "grammar_role": "连词",
                                "translation": "因为"
                            },
                            {
                                "sentence": "there were no rules",
                                "translation": "没有规则",
                                "kernel_sentence": "there were no rules",
                                "components": [
                                    {
                                        "text": "there",
                                        "grammar_role": "主语",
                                        "translation": "（存在句型）"
                                    },
                                    {
                                        "text": "were",
                                        "grammar_role": "系动词",
                                        "translation": "有"
                                    },
                                    {
                                        "text": "no rules",
                                        "grammar_role": "表语",
                                        "translation": "没有规则"
                                    }
                                ]
                            },
                            {
                                "text": "and",
                                "grammar_role": "连词",
                                "translation": "而且"
                            },
                            {
                                "sentence": "a prizefighter could be seriously injured or even killed during a match",
                                "translation": "职业拳击手可能会在比赛中严重受伤，甚至丧命",
                                "kernel_sentence": "a prizefighter could be injured or killed",
                                "components": [
                                    {
                                        "text": "a prizefighter",
                                        "grammar_role": "主语",
                                        "translation": "职业拳击手"
                                    },
                                    {
                                        "text": "could be",
                                        "grammar_role": "谓语",
                                        "translation": "可能会被"
                                    },
                                    {
                                        "text": "seriously",
                                        "grammar_role": "状语",
                                        "target": "injured",
                                        "translation": "严重地"
                                    },
                                    {
                                        "text": "injured",
                                        "grammar_role": "表语",
                                        "translation": "受伤"
                                    },
                                    {
                                        "text": "or",
                                        "grammar_role": "连词",
                                        "translation": "或"
                                    },
                                    {
                                        "text": "even",
                                        "grammar_role": "状语",
                                        "target": "killed",
                                        "translation": "甚至"
                                    },
                                    {
                                        "text": "killed",
                                        "grammar_role": "表语",
                                        "translation": "丧命"
                                    },
                                    {
                                        "text": "during a match",
                                        "grammar_role": "状语",
                                        "translation": "在比赛中",
                                        "trailing_punctuation": "."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })            
        }
    }
}
</script>