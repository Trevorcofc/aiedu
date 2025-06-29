import fetch from "node-fetch";

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

    // 🚫 Guard against direct answer-seeking
    const bannedWords = [
      "answer", "solve", "solution", "what's the answer",
      "give me the answer", "can you solve", "show me the answer"
    ];

    if (bannedWords.some(w => userMessage.toLowerCase().includes(w))) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          choices: [{
            message: {
              content: "Let’s try solving it together. What have you attempted so far, and where did you feel stuck?"
            }
          }]
        })
      };
    }

    // ✅ Check if the user is requesting an image
    const imageKeywords = [
      "draw", "picture", "image", "diagram", "illustrate", "visualize", "sketch"
    ];

    if (imageKeywords.some(w => userMessage.toLowerCase().includes(w))) {
      // Call DALL·E image generation
      const dalleResponse = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: userMessage,
          n: 1,
          size: "512x512"
        })
      });

      const dalleData = await dalleResponse.json();

      if (dalleData.data?.[0]?.url) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            image_url: dalleData.data[0].url
          }),
        };
      } else {
        console.error("DALL·E response error:", dalleData);
        return {
          statusCode: 200,
          body: JSON.stringify({
            choices: [{
              message: {
                content: "I tried generating an image, but something went wrong."
              }
            }]
          })
        };
      }
    }

    // 🧠 System behavior for tutoring, not solving
    const messages = [
      {
        role: "system",
        content: `You are a thoughtful educational assistant. Never give students direct answers. Instead, guide them with questions, help reframe the problem, and suggest strategies. Encourage learning through prompting and reasoning.`
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

