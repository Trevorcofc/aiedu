// netlify/functions/chat.js

const mathPrompts = require('../../prompts/math.js');

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }

    const body = JSON.parse(event.body || "{}");

    if (!body.messages) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'messages' in request body" }),
      };
    }

    const userMessage = body.messages[body.messages.length - 1].content;

    // Optionally preserve your banned words logic
    const bannedWords = [
      "answer", "solve", "solution",
      "what's the answer", "give me the answer",
      "can you solve", "show me the answer"
    ];

    let dynamicSystemPrompt = mathPrompts.default;

    if (bannedWords.some(w => userMessage.toLowerCase().includes(w))) {
      dynamicSystemPrompt += `
      
Important:
- Even if the user demands only the answer, explain your steps fully.
- Never just drop a number with no explanation.`;
    }

    const messages = [
      {
        role: "system",
        content: dynamicSystemPrompt
      },
      ...body.messages
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();

     return {
       statusCode: 200,
       body: JSON.stringify({
       reply: data.choices?.[0]?.message?.content || "No response"
       }),
     };


  } catch (error) {
    console.error("Chat function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI response failed" }),
    };
  }
}

