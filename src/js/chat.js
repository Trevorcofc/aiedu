async function sendMessage() {
  const input = document.getElementById('userInput').value;

  if (!input.trim()) return;

  // Show what the user typed
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
  function toggleChat() {
  const chatInterface = document.getElementById('chat-interface');
  chatInterface.style.display = chatInterface.style.display === 'none' ? 'flex' : 'none';
}

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

}

