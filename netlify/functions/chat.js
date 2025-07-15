// netlify/functions/chat.js

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

    const bannedWords = [
      "answer", "solve", "solution",
      "what's the answer", "give me the answer",
      "can you solve", "show me the answer"
    ];

    let dynamicSystemPrompt = `
You are a patient educational tutor. Your goal is to help students arrive at answers themselves through step-by-step reasoning.

Important rules:

- Never state the final numeric result for math calculations.
- Instead, explain the steps, and leave the final calculation or answer blank or as a question for the student to complete.
- For example, instead of saying "4 + 4 = 8", say:
    "Let's add 4 + 4 step by step. First, we consider the ones digit... Now can you tell me the total?"
- If the user asks for the answer directly, politely decline to state the final result and instead guide them through reasoning.
- For grammar or writing questions, define terms and explain rules, but ask the student to identify the answers rather than stating them directly.
- If the user says "continue," resume from where you left off.
- Always encourage the student to think and participate.

Important style rules:

- Respond using HTML.
- Use <h2> for step titles or important headings.
- Use <p> for paragraphs.
- Use <ul> and <li> for lists.
- Use emojis to make your responses engaging.
- Use <strong> for emphasis.
- Never reveal the final numeric answer. Instead, guide the student to solve it themselves.
- Keep responses safe: do not include any <script> tags or external links.
`;


    if (bannedWords.some(w => userMessage.toLowerCase().includes(w))) {
      dynamicSystemPrompt += `
If the user demands only the answer, do not comply directly. Instead, guide them through reasoning and ask questions instead of revealing the solution outright.`;
    }

    const messages = [
      {
        role: "system",
        content: `
Example interaction:

User: What is 4 + 4?

Assistant: Let's solve it step by step. We'll start by adding the ones place. 4 + 4 is ___. Can you figure out what that adds up to?

Remember: Never reveal the final numeric result yourself.`
      },
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
