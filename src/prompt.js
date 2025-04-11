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
    const prompt = `请用中文详细分析以下英文句子的语法结构，按JSON格式返回：
    {
      "original": "原句",
      "analysis": {
        "tenses": "时态分析",
        "clauses": "从句结构",
        "components": "句子成分",
        "key_points": "语法要点"
      }
    }
    需要分析的句子：${userInput}`

    return [
        { role: "user", content: prompt }
    ]
}