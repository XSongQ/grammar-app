<template>
  <v-app>
    <v-main style="max-width: 1200px; min-width: 100vh; margin: 0 auto;">  <!-- [! ++ 添加最大宽度和居中 ++] -->
      <v-dialog v-model="dialog" width="500px">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props" class="ma-4">
            分析句子
          </v-btn>
        </template>

        <v-card>
          <v-card-text>
            <v-textarea
              v-model="userInput"
              label="请输入英文句子"
              outlined
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="analyzeSentence">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 以下为测试，正式：:analysisResult="apiResponse" -->
      <ParagraphBox 
        :analysisResult="testMessage"
      />
      
      <v-alert v-if="error" type="error" class="ma-4">{{ error }}</v-alert>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ParagraphBox from './components/ParagraphBox.vue'

import { testMessage } from './unitTest.js'

const dialog = ref(false)
const userInput = ref('')
const apiResponse = ref(null)
const loading = ref(false)
const error = ref(null)
const apiKey = ref('')

// 添加的代码：检查并提示输入API Key
onMounted(() => {
  const storedKey = localStorage.getItem('deepseek-api-key')
  if (!storedKey) {
    const key = prompt('请输入您的DeepSeek API Key:')
    if (key) {
      localStorage.setItem('deepseek-api-key', key)
      apiKey.value = key
    }
  } else {
    apiKey.value = storedKey
  }
})


const analyzeSentence = async () => {
  if (!apiKey.value) {
    error.value = '请先输入API Key'
    return
  }

  let system_prompt = `
  你是一个严谨的JSON输出机器人，所有响应必须严格符合以下要求：
  1. 直接输出纯净JSON对象，不包含任何额外符号或解释
  2. 不使用\`\`\`json或\`\`\`代码块格式
  3. 确保JSON结构始终以{开始，以}结束
  4. 字符串值保持最小转义，内容字段直接包含有效JSON结构

  {
  "instruction": "分析英语句子，以符合洗手学习者理解的方式，输出语法成分及理解顺序队列。遵循：",
  "output_format": {
    "components": [
      {
        "text": "单词/短语/标点",
        "position": "在原句中的序号（从0开始）",
        "grammar_role": ["主语", "谓语", "宾语", "定语", "状语", "补语", "插入语", "连接词", "标点"],
        "clause": "主句1/从句1-1/边界...",
        "info": {}
      }
    ],
    "sequence_queue": [
      ["边界成分的position"],
      ["主句1成分position顺序"],
      ["从句1-1成分position顺序"]
    ]
  },
  "rules": {
    "定位系统": {
      "position规则": "每个单词/短语分配唯一position，短语取首词序号",
      "示例": "『the exam』取'the'的position"
    },
    "连接处理": {
      "连接词": "并列连词（and/but/or）、从属连词（if/when）",
      "标点": ", ; . ? ! 等标点符号",
      "边界层": "连接词和标点按原序放在sequence_queue[0]"
    },
    "顺序逻辑": {
      "第一层": "边界层position按出现顺序排列",
      "后续层": "主句按SVO顺序→从句按出现顺序"
    }
  },
  "validation_rules": {
    "唯一性校验": "所有position值必须唯一且连续",
    "完整性校验": "原句所有token必须有对应component",
    "队列映射": "sequence_queue中的所有position必须存在于components"
  }
}
  `

  try {
    loading.value = true
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.value}` 
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: "system", 
            content: system_prompt
          },
          { role: "user", content: userInput.value }
        ],
        temperature: 0.3, // 添加temperature参数
        max_tokens: 2000 // 添加max_tokens参数
      })
    });

    const data = await response.json();
    apiResponse.value = data.choices[0].message.content
    dialog.value = false
    userInput.value = '' // 清空输入框
  } catch (err) {
    error.value = '请求失败: ' + err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>