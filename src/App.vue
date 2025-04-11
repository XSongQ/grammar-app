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

          <v-card-actions class="justify-space-between">
            <v-btn @click="dialog = false">取消</v-btn>
            <v-btn color="primary" @click="primaryAnalysis">提交</v-btn>
          </v-card-actions>
        </v-card>
        
      </v-dialog>

      <!-- <Paragraph
        :analysisResult="apiResponse"
      /> -->
      
      <div v-if="showParagraphs" class="mt-4">
        <div style="position: relative; min-height: 300px;">
          <!-- 
            v-show vs keep-alive + v-if：
            v-show 内存占用大，切换快，实现简单；
            keep-alive + v-if 内存占用小，切换慢，可精准控制生命周期（activated / deactivated）
          -->

          <Paragraph
            v-for="(analysisResult, index) in secondaryResults"
            :key="index"
            :analysisResult="analysisResult"
            v-show="currentIndex === index"
          />
        </div>
        
        <div class="switch-buttons">
          <v-btn 
            icon="mdi-chevron-left"
            color="primary"
            variant="flat"
            @click="currentIndex = Math.max(0, currentIndex - 1)"
            :disabled="currentIndex === 0"
            class="rounded-pill"
          ></v-btn>
          
          <v-btn 
            icon="mdi-chevron-right"
            color="primary"
            variant="flat"
            @click="currentIndex = Math.min(secondaryResults.length - 1, currentIndex + 1)"
            :disabled="currentIndex === secondaryResults.length - 1"
            class="rounded-pill"
          ></v-btn>
        </div>
      </div>


      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'  
import Paragraph from './components/unitTest2.vue'
import { prompt1, prompt2 } from './prompt'


const dialog = ref(false)
const userInput = ref('')
// const apiResponse = ref(null)
const loading = ref(false)
const apiKey = ref('')

// 在原有响应式变量后添加
const secondaryResults = ref([])
const currentIndex = ref(0)
const showParagraphs = ref(false)

function checkAPIKey() {
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
}

// 添加的代码：检查并提示输入API Key
onMounted(() => {
  checkAPIKey()
})


const primaryAnalysis = async () => {
  if (!apiKey.value) {
    checkAPIKey()
    return
  }

  // 新增重置逻辑
  secondaryResults.value = []
  showParagraphs.value = false

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey.value}` 
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: prompt1(userInput.value),
        temperature: 0.6, // 对响应影响较大
        max_tokens: 2000 
      })
    })

    dialog.value = false
    userInput.value = '' 
    loading.value = true

    const data = await response.json()
    const primaryResponse = data.choices[0].message.content


    // 处理收到的数据
    const sentences = JSON.parse(primaryResponse)
    // 新增数据格式验证
    if (!Array.isArray(sentences)) {
      throw new Error(`解析错误：${primaryResponse}`)
    }

    // 遍历数组并存入 sessionStorage
    sessionStorage.clear()  // 清除之前的记录
    sentences.forEach((sentence, index) => {
      const key = `sentence${index + 1}` // 生成键名：sentence1, sentence2...
      sessionStorage.setItem(key, sentence)
    })

    console.log("数据成功存入sessionStorage！")
    requestSecondaryAnalysis()

  } catch (err) {
    alert(err.message)
    loading.value = false  
  } 
}


// 异步请求分句
// 修改空的 requestSecondaryAnalysis 函数
async function requestSecondaryAnalysis() {
  try {
    // 获取所有句子键并按顺序排序
    const sentenceKeys = Object.keys(sessionStorage)
      .filter(key => key.startsWith('sentence'))
      .sort((a, b) => parseInt(a.replace('sentence', '')) - parseInt(b.replace('sentence', '')))

    secondaryResults.value = [] // 清空之前的结果

    for (const key of sentenceKeys) {
      const sentence = sessionStorage.getItem(key)

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.value}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: prompt2(sentence),
          temperature: 0.6,
          max_tokens: 2000
        })
      })

      const data = await response.json()
      const analysisResult = data.choices[0].message.content // 直接使用字符串测试，之后改为JSON.parse
      
      secondaryResults.value.push(analysisResult)  // [!code ++] 直接存储字符串
      showParagraphs.value = true
      loading.value = false
    }

  } catch (err) {
    console.log(`详细分析失败: ${err.message}`)
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>

.switch-buttons {
  display: flex;
  justify-content: space-around;
}

</style>
