// 本文件用于调试对于DeepSeek的prompt，获取最佳的messages数组。与程序本体无关。

import { createInterface } from 'readline';

const apiUrl = "https://api.deepseek.com/v1/chat/completions"
const apiKey = "sk-42a20269625348a385c2c6d761650ad7"  // 调试用的 DeepSeek apiKey


const system_prompt = `
你是一个严谨的JSON输出机器人，所有响应必须严格符合以下要求：
1. 直接输出纯净JSON对象，不包含任何额外符号或解释
2. 不使用\`\`\`json或\`\`\`代码块格式
3. 确保JSON结构始终以{开始，以}结束
4. 字符串值保持最小转义，内容字段直接包含有效JSON结构

英文句子成分解析任务：用户输入一个英文句子。首先给出wholeSentence和translation属性，分别为完整的英文句子和中文翻译。之后句子成分拆解和分析都放在components属性当中，包括：

以句子的语法成分为基本单位：components数组中的每个元素都是句子的一个语法成分，“普通成分”包含以下几个属性：
1. text：成分的英文原文，可以为单词或短语；
2. grammar_role：成分的语法角色；
3. target（可选）：如果是修饰成分，给出其修饰对象；
4. more_info（可选）：成分的更多语法用法的介绍，比如成分的时态语态、单复数等，十个字之内；
5. prepositive_punctuation / trailing_punctuation（可选）：如果该成分在原句中之前或之后有标点符号，则值为该标点符号。

*除以上“普通成分”的格式，components数组的元素也可以是“子句成分”（subSentence）。子句成分必须包含至少一个kernel_sentence（具有最小的的主谓宾/主系表成分的结构），比如完整的从句或者并列句。非谓语动词短语这种不算。

子句成分包含以下属性：
1. subSentence：该子句的英文原文；
2. grammar_role（可选）：如果是修饰主句的从句，则给出其语法角色；
2. components数组：该子句包含的语法成分，规则按照上述components数组的规则。

总体来说，结构大致如下：
{
  "wholeSentence": "This is original English Sentence.",
  "translation": "这里为原句的中文翻译",
  "components": [
    {
      "text": "This",
      "grammar_role": "主语",
      "translation": "这"
      // “普通成分”不应包含components数组属性
    },
    {
      ...
    },
    { 
      // 这是子句成分。如果其内部还有子子句成分，则也应作为本子句成分的子成分，放在下面的components数组中。
      "subSentence": "（子句成分完整的英文原文，包括内部的子句成分和标点，如果有的话）",
      "grammar_role": "（可选，如果为修饰主句的从句，则写明在主句中的成分）",
      "components": []
    },
    {
      ...
    }
  ]
}

最后提醒：原句以及每个子句中所有成分均应该在其components数组中出现，成分前后的标点符号也不要落下。
`

async function streamChat() {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // 初始化 messages 数组（包含系统提示）
  const messages = [{
    role: "system",
    content: system_prompt
  }];



  while (true) {
    console.log('请输入你的问题（输入;;结束，输入exit退出）：');
    let userInput = '';
    while (true) {
      const line = await new Promise(resolve => {
        readline.question('', resolve);
      });
      if (line === ';;') break;
      if (line === 'exit') {
        readline.close();
        console.log(JSON.stringify(messages, null, 2));
        return;
      }
      userInput += line + '\n';
    }
    userInput = userInput.trim(); // 去除最后一个换行符

    if (userInput.toLowerCase() === 'exit') {
      readline.close();
      console.log(JSON.stringify(messages, null, 2)); // 打印完整对话记录
      break;
    }

    // 添加用户消息到上下文
    messages.push({ role: "user", content: userInput });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        //model: "deepseek-chat",
        model: "deepseek-reasoner",   // 调用一次V3分析句子会有很多错误，需要二次V3检查，或者使用R1
        messages: messages,
        temperature: 0.6,
        max_tokens: 2000,
        stream: false,
      })
    });

    const data = await response.json();
    const assistantResponse = data.choices[0].message.content;
    
    // 添加助手回复到上下文
    messages.push({ 
      role: "assistant",
      content: assistantResponse
    });

    console.log(assistantResponse);
  }
}

streamChat().catch(console.error);