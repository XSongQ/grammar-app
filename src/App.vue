<template>
  <v-app>
    <v-main>
      <v-dialog v-model="dialog" width="500">
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

      <ParagraphBox 
        :analysisResult="apiResponse"
      />
      
      <v-alert v-if="error" type="error" class="ma-4">{{ error }}</v-alert>
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ParagraphBox from './components/ParagraphBox.vue'

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
  {
  "instruction": "分析英语句子，按顺序输出每个成分的语法角色。严格遵循以下规则：",
  "output_format": {
    "fields": [
      {"text": "单词/短语/标点"},
      {
        "grammar_role": ["主语", "谓语", "宾语", "定语", "状语", "补语", "插入语", "连接1", "连接2", "连接3", "空"],
        "rules": {
          "连接1": "连接独立分句（如 and/but/or 连接主句）",
          "连接2": "引导从句或分割意群（如 when/that/逗号/分号）",
          "连接3": "连接句子内成分（如 and 连接并列名词）"
        }
      },
      {"clause": "主句1 / 从句1-1 / 从句1-2..."},
      {
        "info": {
          "规则": "根据成分的词性填充对应字段，其他字段留空",
          "名词": {"数": "单/复", "格": "主/宾/所有", "解释": "词义"},
          "动词": {"时态": "现在/过去/...", "语态": "主动/被动"},
          "定语/状语": {"修饰对象": "被修饰词", "用法": "to do/doing/介词短语..."},
          "连接词": {"功能": "并列/从属/插入..."}
        }
      }
    ]
  },
  "example": {
    "input": "If you study hard, you will pass the exam and get a reward.",
    "output": [
      {
        "text": "If",
        "grammar_role": "连接2",
        "clause": "从句1-1",
        "info": {"功能": "引导条件状语从句"}
      },
      {
        "text": "you",
        "grammar_role": "主语",
        "clause": "从句1-1",
        "info": {"数": "单/复", "格": "主", "解释": "你"}
      },
      {
        "text": "study",
        "grammar_role": "谓语",
        "clause": "从句1-1",
        "info": {"时态": "现在", "语态": "主动"}
      },
      {
        "text": "hard",
        "grammar_role": "状语",
        "clause": "从句1-1",
        "info": {"修饰对象": "study", "用法": "副词"}
      },
      {
        "text": ",",
        "grammar_role": "连接2",
        "clause": "边界",
        "info": {"功能": "分隔主从句"}
      },
      {
        "text": "you",
        "grammar_role": "主语",
        "clause": "主句1",
        "info": {"数": "单/复", "格": "主", "解释": "你"}
      },
      {
        "text": "will pass",
        "grammar_role": "谓语",
        "clause": "主句1",
        "info": {"时态": "将来", "语态": "主动"}
      },
      {
        "text": "the",
        "grammar_role": "定语",
        "clause": "主句1",
        "info": {"修饰对象": "exam", "用法": "冠词"}
      },
      {
        "text": "exam",
        "grammar_role": "宾语",
        "clause": "主句1",
        "info": {"数": "单", "格": "宾", "解释": "考试"}
      },
      {
        "text": "and",
        "grammar_role": "连接3",
        "clause": "主句1",
        "info": {"功能": "并列谓语"}
      },
      {
        "text": "get",
        "grammar_role": "谓语",
        "clause": "主句1",
        "info": {"时态": "将来", "语态": "主动"}
      },
      {
        "text": "a",
        "grammar_role": "定语",
        "clause": "主句1",
        "info": {"修饰对象": "reward", "用法": "冠词"}
      },
      {
        "text": "reward",
        "grammar_role": "宾语",
        "clause": "主句1",
        "info": {"数": "单", "格": "宾", "解释": "奖励"}
      },
      {
        "text": ".",
        "grammar_role": "空",
        "clause": "边界",
        "info": {}
      }
    ]
  }
}
  注意：直接输出JSON格式，不包含任何额外信息。
  去掉开头的\`\`\`json\\n和结尾的\`\`\`，只输出JSON内容。
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
        model: "deepseek-chat",
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