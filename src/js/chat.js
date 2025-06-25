async function handleChat(event) {
  event.preventDefault();

  const input = document.getElementById("user-input").value;
  document.getElementById("user-input").value = "";

  const chatLog = document.getElementById("chat-log");
  chatLog.innerHTML += `<p><strong>You:</strong> ${input}</p>`;

  try {
    const response = await fetch("/api/chat", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await response.json();
    chatLog.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
  } catch (err) {
    chatLog.innerHTML += `<p><strong>AI:</strong> Sorry, I couldn’t respond right now.</p>`;
  }
}
