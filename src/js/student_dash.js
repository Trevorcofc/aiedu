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

document.addEventListener("DOMContentLoaded", () => {
  const addNewBtn = document.querySelector(".add-class button");
  const joinClassModal = document.getElementById("join-class-modal");
  const closeJoinClass = document.getElementById("close-join-class");
  const joinClassForm = document.getElementById("join-class-form");
  const successModal = document.getElementById("student-success-modal");
  const closeSuccessModal = document.getElementById("close-student-success");
  const successOkBtn = document.getElementById("student-success-ok-btn");
  const classList = document.querySelector(".class-list");

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

    // ✅ Check Firestore for matching class
    const matchedClass = await checkClassCode(classCode);

    if (matchedClass) {
      // ✅ Add class to sidebar
      const newLi = document.createElement("li");
      const newBtn = document.createElement("button");
      newBtn.textContent = `📚 ${matchedClass.title}`;
      newLi.appendChild(newBtn);
      classList.insertBefore(newLi, classList.querySelector(".add-class"));

      joinClassModal.style.display = "none";
      successModal.style.display = "block";
    } else {
      alert("Invalid class code. Please try again.");
    }

    // Reset form
    joinClassForm.reset();
  });

  // Close success modal
  closeSuccessModal.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  successOkBtn.addEventListener("click", () => {
    successModal.style.display = "none";
  });
});
