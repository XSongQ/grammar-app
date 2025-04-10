<template>
  <v-app>
    <v-main style="max-width: 1200px; min-width: 100vh; margin: 0 auto;">  <!-- [! ++ 添加最大宽度和居中 ++] -->
      <v-dialog v-model="dialog" width="500px">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props" class="ma-4">
            分析段落
          </v-btn>
        </template>

        <v-card>
          <v-card-text>
            <v-textarea
              v-model="userInput"
              label="请输入英文句子或段落"
              outlined
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="primaryAnalysis">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <ParagraphBox 
        :analysisResult="apiResponse"
      /> -->
      
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
// const apiResponse = ref(null)
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


const primaryAnalysis = async () => {
  if (!apiKey.value) {
    error.value = '请先输入API Key'
    return
  }

  let prompt = `
  你是一个严谨的JSON输出机器人，所有响应必须严格符合以下要求：
  1. 直接输出纯净JSON对象，不包含任何额外符号或解释
  2. 不使用\`\`\`json或\`\`\`代码块格式
  3. 确保JSON结构始终以[开始，以]结束
  4. 字符串值保持最小转义，内容字段直接包含有效JSON结构

  下面我将输出一个英文段落或文章，根据英语的规则，将这个段落或文章按句划分并以如下JSON格式输出：
[
  "This is the first sentence",
  "This is the second sentence.",
  ...
]
  原英文段落：${userInput.value}
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
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // 添加temperature参数
        max_tokens: 2000 // 添加max_tokens参数
      })
    });

    const data = await response.json();
    const primaryResponse = data.choices[0].message.content

    dialog.value = false
    userInput.value = '' // 清空输入框

    // 处理收到的数据
    secondaryAnalysis(primaryResponse)

  } catch (err) {
    error.value = '请求失败: ' + err.message
  } finally {
    loading.value = false
  }
}

function secondaryAnalysis(primaryResponse) {
  try {
    const sentences = JSON.parse(primaryResponse);
    console.log(sentences)

    // 遍历数组并存入 sessionStorage
    sentences.forEach((sentence, index) => {
      const key = `sentence${index + 1}`; // 生成键名：sentence1, sentence2...
      sessionStorage.setItem(key, sentence);
    });

    console.log("数据成功存入sessionStorage！");
  } catch (error) {
    console.error("JSON处理错误：", error.message);
  }
}


</script>

<style scoped>

</style>