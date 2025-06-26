// Toggles the visibility of the chat interface
function toggleChat() {
  const chatBox = document.querySelector('.chat-box');
  chatBox.classList.toggle('active');
}

// Handles the form-based chat flow
async function handleChat(event) {
  event.preventDefault();
  const input = document.getElementById('user-input').value;
  if (!input.trim()) return;

  const chatLog = document.getElementById('chat-log');
  chatLog.innerHTML += `You: ${input}\n`;

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: input }],
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t respond.";
    chatLog.innerHTML += `AI: ${reply}\n\n`;
    document.getElementById('user-input').value = '';
    chatLog.scrollTop = chatLog.scrollHeight;

  } catch (err) {
    chatLog.innerHTML += `AI: Error talking to server.\n`;
    console.error(err);
  }
}

// Optional: legacy textarea-only approach, if you use it elsewhere
async function sendMessage() {
  const input = document.getElementById('userInput').value;

  if (!input.trim()) return;

  const responseBox = document.getElementById('response');
  responseBox.textContent = `You: ${input}\nAI: ...`;

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: input }]
      })
    });

    const data = await res.json();

    const aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn’t respond.";
    responseBox.textContent = `You: ${input}\nAI: ${aiResponse}`;
  } catch (err) {
    responseBox.textContent = `You: ${input}\nAI: Sorry, there was an error.`;
    console.error(err);
  }
}


