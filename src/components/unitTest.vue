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
  "wholeSentence": "One night, the gaoler decided to play a joke on his colleague to find out if, after so many performances, he had managed to learn the contents of the letter by heart.",
  "translation": "一天晚上，狱卒决定跟同事开个玩笑，想看看经过这么多次表演后，他是否已经能把信的内容背下来了。",
  "components": [
    {
      "text": "One night",
      "grammar_role": "状语",
      "translation": "一天晚上",
      "target": "全句",
      "more_info": "时间状语"
    },
    {
      "text": ",",
      "grammar_role": "标点符号",
      "translation": "，"
    },
    {
      "text": "the gaoler",
      "grammar_role": "主语",
      "translation": "狱卒"
    },
    {
      "text": "decided",
      "grammar_role": "谓语",
      "translation": "决定",
      "more_info": "过去式"
    },
    {
      "text": "to play a joke on his colleague",
      "grammar_role": "宾语",
      "translation": "跟同事开个玩笑",
      "more_info": "不定式短语"
    },
    {
      "text": "to find out",
      "grammar_role": "状语",
      "translation": "想看看",
      "target": "decided",
      "more_info": "目的状语"
    },
    {
      "subSentence": "if, after so many performances, he had managed to learn the contents of the letter by heart",
      "grammar_role": "宾语从句",
      "components": [
        {
          "text": "if",
          "grammar_role": "连词",
          "translation": "是否"
        },
        {
          "text": ",",
          "grammar_role": "标点符号",
          "translation": "，"
        },
        {
          "text": "after so many performances",
          "grammar_role": "状语",
          "translation": "经过这么多次表演后",
          "target": "had managed",
          "more_info": "时间状语"
        },
        {
          "text": "he",
          "grammar_role": "主语",
          "translation": "他"
        },
        {
          "text": "had managed",
          "grammar_role": "谓语",
          "translation": "已经能",
          "more_info": "过去完成时"
        },
        {
          "text": "to learn the contents of the letter by heart",
          "grammar_role": "宾语",
          "translation": "把信的内容背下来",
          "more_info": "不定式短语"
        }
      ]
    },
    {
      "text": ".",
      "grammar_role": "标点符号",
      "translation": "。"
    }
  ]
}


            )
        }
    }



    // data() {
    //     return {
    //         testValue: JSON.stringify(
    //         {       
    //             "sentence": "However, boxing was very crude, for there were no rules and a prizefighter could be seriously injured or even killed during a match.",
    //             "translation": "然而，拳击运动非常粗野，因为没有规则，职业拳击手可能会在比赛中严重受伤，甚至丧命。",
    //             "kernel_sentence": {
    //                 "subSentence": "boxing was crude",
    //                 "translation": "拳击运动是粗野的。"
    //             },
    //             "components": [
    //                 {
    //                     "text": "However",
    //                     "grammar_role": "状语",
    //                     "target": "全句",
    //                     "translation": "然而",
    //                     "trailing_punctuation": ","
    //                 },
    //                 {
    //                     "text": "boxing",
    //                     "grammar_role": "主语",
    //                     "translation": "拳击运动"                    
    //                 },
    //                 {
    //                     "text": "was",
    //                     "grammar_role": "谓语", // 注意：LLM可能输出“系动词”
    //                     "translation": "是"
    //                 },
    //                 {
    //                     "text": "very",
    //                     "grammar_role": "状语",
    //                     "target": "crude",
    //                     "translation": "非常"
    //                 },
    //                 {
    //                     "text": "crude",
    //                     "grammar_role": "表语",
    //                     "translation": "粗野的",
    //                     "trailing_punctuation": ","
    //                 },
    //                 {
    //                     "text": "for there were no rules and a prizefighter could be seriously injured or even killed during a match",
    //                     "grammar_role": "状语",
    //                     "translation": "因为没有规则，职业拳击手可能会在比赛中严重受伤，甚至丧命",
    //                     "components": [
    //                         {
    //                             "text": "for",
    //                             "grammar_role": "连词",
    //                             "translation": "因为"
    //                         },
    //                         {
    //                             "subSentence": "there were no rules",
    //                             "translation": "没有规则",
    //                             "kernel_sentence": "there were no rules",
    //                             "components": [
    //                                 {
    //                                     "text": "there",
    //                                     "grammar_role": "主语",
    //                                     "translation": "（存在句型）"
    //                                 },
    //                                 {
    //                                     "text": "were",
    //                                     "grammar_role": "系动词",
    //                                     "translation": "有"
    //                                 },
    //                                 {
    //                                     "text": "no rules",
    //                                     "grammar_role": "表语",
    //                                     "translation": "没有规则"
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             "text": "and",
    //                             "grammar_role": "连词",
    //                             "translation": "而且"
    //                         },
    //                         {
    //                             "subSentence": "a prizefighter could be seriously injured or even killed during a match",
    //                             "translation": "职业拳击手可能会在比赛中严重受伤，甚至丧命",
    //                             "kernel_sentence": "a prizefighter could be injured or killed",
    //                             "components": [
    //                                 {
    //                                     "text": "a prizefighter",
    //                                     "grammar_role": "主语",
    //                                     "translation": "职业拳击手"
    //                                 },
    //                                 {
    //                                     "text": "could be",
    //                                     "grammar_role": "谓语",
    //                                     "translation": "可能会被"
    //                                 },
    //                                 {
    //                                     "text": "seriously",
    //                                     "grammar_role": "状语",
    //                                     "target": "injured",
    //                                     "translation": "严重地"
    //                                 },
    //                                 {
    //                                     "text": "injured",
    //                                     "grammar_role": "表语",
    //                                     "translation": "受伤"
    //                                 },
    //                                 {
    //                                     "text": "or",
    //                                     "grammar_role": "连词",
    //                                     "translation": "或"
    //                                 },
    //                                 {
    //                                     "text": "even",
    //                                     "grammar_role": "状语",
    //                                     "target": "killed",
    //                                     "translation": "甚至"
    //                                 },
    //                                 {
    //                                     "text": "killed",
    //                                     "grammar_role": "表语",
    //                                     "translation": "丧命"
    //                                 },
    //                                 {
    //                                     "text": "during a match",
    //                                     "grammar_role": "状语",
    //                                     "translation": "在比赛中",
    //                                     "trailing_punctuation": "."
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 }
    //             ]
    //         })            
    //     }
    // }
}
</script>