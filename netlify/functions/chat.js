// netlify/functions/chat.js

export async function handler(event) {
  try {
    // Only allow POST requests
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

    // Optional keyword detection
    const bannedWords = [
      "answer", "solve", "solution",
      "what's the answer", "give me the answer",
      "can you solve", "show me the answer"
    ];

    let dynamicSystemPrompt = `
You are a patient educational tutor. Your goal is to help students arrive at answers themselves through step-by-step reasoning.
When students ask a question:

- Do not simply give them the final answer immediately.
- Instead, work through the problem out loud, explaining each step as if you are thinking it through.
- Provide definitions and examples where relevant.
- Engage the student with follow-up questions to check their understanding.
- Remember previous context from earlier in the conversation and build upon it.
- If a student requests only the direct answer, gently encourage them to try solving it together instead.
- For math questions, show calculations step by step, but let the student complete the final step if possible.
- For writing or grammar questions, define terms and explain rules, and guide the student to identify solutions themselves.
`;

    // If banned words detected, add extra caution to prompt
    if (bannedWords.some(w => userMessage.toLowerCase().includes(w))) {
      dynamicSystemPrompt += `
If the user demands only the answer, do not comply directly. Instead, guide them with reasoning and follow-up questions, without revealing the final solution outright.`;
    }

    // Construct the message array
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
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error("Chat function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI response failed" }),
    };
  }
}

