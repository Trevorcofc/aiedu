// student_dash.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAN5bczyFGapDT9vcqOAxI473SLUDfSHxA",
  authDomain: "ethicadmey.firebaseapp.com",
  projectId: "ethicadmey",
  storageBucket: "ethicadmey.firebasestorage.app",
  messagingSenderId: "281835928268",
  appId: "1:281835928268:web:49d817295d84b409c6e069",
  measurementId: "G-P860XXWVPR"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// ✅ Function to check class code in Firestore
async function checkClassCode(code) {
  const classesRef = collection(db, "classes");
  const q = query(classesRef, where("classCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let matchedClass;
    querySnapshot.forEach((doc) => {
      matchedClass = doc.data();
    });
    return matchedClass;
  } else {
    return null;
  }
}

// Storage for joined classes
const joinedClasses = [];

document.addEventListener("DOMContentLoaded", () => {
  const addNewBtn = document.querySelector(".add-class button");
  const joinClassModal = document.getElementById("join-class-modal");
  const closeJoinClass = document.getElementById("close-join-class");
  const joinClassForm = document.getElementById("join-class-form");
  const successModal = document.getElementById("student-success-modal");
  const closeSuccessModal = document.getElementById("close-student-success");
  const successOkBtn = document.getElementById("student-success-ok-btn");
  const classList = document.querySelector(".class-list");

  const chatLog = document.getElementById("chat-log");
  const userInput = document.getElementById("user-input");

  let currentClassContext = null;

  // Show Join Class modal
  addNewBtn.addEventListener("click", () => {
    joinClassModal.style.display = "block";
  });

  // Close Join Class modal
  closeJoinClass.addEventListener("click", () => {
    joinClassModal.style.display = "none";
  });

  // Handle Join Class form submit
  joinClassForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const classCode = document.getElementById("join-class-code").value.trim();

    if (classCode === "") {
      alert("Please enter a class code.");
      return;
    }

    const matchedClass = await checkClassCode(classCode);

    if (matchedClass) {
      if (joinedClasses.some((cls) => cls.classCode === matchedClass.classCode)) {
        alert("Class already added.");
      } else {
        addClassToSidebar(matchedClass);
        joinedClasses.push(matchedClass);
        joinClassModal.style.display = "none";
        successModal.style.display = "block";
      }
    } else {
      alert("Invalid class code. Please try again.");
    }

    joinClassForm.reset();
  });

  closeSuccessModal.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  successOkBtn.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  function addClassToSidebar(classData) {
    const newLi = document.createElement("li");
    const newBtn = document.createElement("button");
    newBtn.textContent = `📚 ${classData.title}`;
    newBtn.dataset.classCode = classData.classCode;

    newBtn.addEventListener("click", () => {
      switchClassContext(classData);
    });

    newLi.appendChild(newBtn);
    classList.insertBefore(newLi, classList.querySelector(".add-class"));
  }

  function switchClassContext(classData) {
    currentClassContext = classData;

    const headerTitle = document.querySelector(".chat-header h1");
    headerTitle.innerHTML = `Welcome,<br><span class="username-highlight">&lt;username&gt;</span><br><small>Class: ${classData.title}</small>`;

    chatLog.innerHTML = "";

    document.querySelector(".chat-panel").style.display = "flex";
  }

  function addMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.classList.add(sender === "user" ? "user" : "ai");
    bubble.textContent = sender === "user" ? `User: ${text}` : `AI: ${text}`;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ✅ NEW → Add an image message bubble
  function addImageMessage(sender, imageUrl) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble");
    bubble.classList.add(sender === "user" ? "user" : "ai");

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "AI generated image";
    img.style.maxWidth = "300px";
    img.style.borderRadius = "8px";

    bubble.appendChild(img);
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  window.handleChat = async function (event) {
    event.preventDefault();

    const text = userInput.value.trim();
    if (!text) return;

    addMessage("user", text);

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }]
        })
      });

      const data = await res.json();

      if (data.image_url) {
        addImageMessage("ai", data.image_url);
      } else if (data.choices?.[0]?.message?.content) {
        addMessage("ai", data.choices[0].message.content);
      } else {
        addMessage("ai", "Sorry, I didn’t understand the request.");
      }
    } catch (error) {
      console.error(error);
      addMessage("ai", "Sorry, there was an error talking to the AI.");
    }

    userInput.value = "";
  };

});

