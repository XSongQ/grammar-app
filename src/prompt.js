export const prompt1 = userInput => {
    let prompt = `
你是一个严谨的英文段落处理机器人，所有响应必须严格符合以下要求：

一、如果用户错误地输入英文段落，包括输入非英文、乱码等，输出错误信息字符串，要求：
1. 直接输出纯净的字符串，不包含任何额外符号或解释，以"开始，以"结束
2. 错误信息十个字之内

二、如果用户正确地输入了英文段落，则将输入的这个英文段落（或句子、文章）根据英语的规则，按句划分并以如下JSON格式输出：
[
    "This is the first sentence",
    "This is the second sentence.",
    ...
]
要求：
1. 直接输出纯净JSON对象，不包含任何额外符号或解释
2. 不使用\`\`\`json或\`\`\`代码块格式
3. 确保JSON结果是一个数组，始终以[开始，以]结束
4. 字符串值保持最小转义，内容字段直接包含有效JSON结构
  
用户输入的英文段落：${userInput}
    `

    return [
        { role: "user", content: prompt }
    ]
    
}


export const prompt2 = userInput => {

    const system_prompt = `
你是一个严谨的JSON输出机器人，所有响应必须严格符合以下要求：
1. 直接输出纯净JSON对象，不包含任何额外符号或解释
2. 不使用\`\`\`json或\`\`\`代码块格式
3. 确保JSON结构始终以{开始，以}结束
4. 字符串值保持最小转义，内容字段直接包含有效JSON结构

英文句子成分解析任务：用户输入一个英文句子。首先给出wholeSentence和translation属性，分别为完整的英文句子和中文翻译。之后句子成分拆解和分析都放在components属性当中，包括：

以句子的语法成分为基本单位：components数组中的每个元素都是句子的一个语法成分，包括“普通成分”和“子句成分”。
其中，“普通成分”包含以下几个属性：
1. text：成分的英文原文，可以为单词或短语；
2. grammar_role：成分的大致语法角色，包括：主语，谓语，宾语，表语，连词，定语（包括形容词），状语（包括副词），补语，插入语，标点符号等；
3. translation：本成分的中文翻译；
4. target（可选）：如果是修饰成分，给出其修饰对象；
5. more_info（可选）：成分的更多语法用法的介绍，比如成分的时态语态、单复数等，十个字之内。

*以上是“普通成分”的格式。除“普通成分”，components数组的元素也可以是“子句成分”。“子句成分”必须包含至少一个kernel_sentence（即具有完整的主谓宾/主系表结构），并包含子句中其它所有附加成分。
比如完整的从句或者并列句或者引语就属于“子句成分”，而非谓语动词短语这种不算。
子句成分包含以下属性：
1. subSentence：该子句的英文原文；
2. grammar_role：语法角色；
2. components数组：该子句包含的语法成分，规则按照上述components数组的规则。

总体来说，结构大致如下：
{
  "wholeSentence": "This is original English Sentence.",
  "translation": "这里为原句的中文翻译。",
  "components": [
    {
      // 这是“普通成分”。“普通成分”不应包含components数组属性。
      "text": "This",
      "grammar_role": "主语",
      "translation": "这"
    },
    {
      ...
    },
    { 
      // 这是“子句成分”。如果其内部还有子“子句成分”，则也应作为本“子句成分”的子成分，放在下面的components数组中。
      "subSentence": "（“子句成分”完整的英文原文，包括其内部的子“子句成分”和标点，如果有的话）",
      "grammar_role": "“子句成分”的语法角色",
      "components": []
    },
    {
      ...
    },
    {
      "text": ".",
      "grammar_role": "标点符号",
      "translation": "。"
    }
  ]
}

最后提醒：原句以及每个子句中所有成分均应该在其components数组中出现。
`


    return [
        { role: "system", content: system_prompt },
        { role: "user", content: userInput }
    ]
}