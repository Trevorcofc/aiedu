// teacher_dash.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ✅ Your Firebase config from Firebase Console
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

// ✅ Firestore function to save a new class
async function addNewClass(title, description, classCode) {
  try {
    await addDoc(collection(db, "classes"), {
      title: title,
      description: description,
      classCode: classCode,
      createdAt: new Date().toISOString()
    });
    console.log("Class saved to Firestore!");
  } catch (e) {
    console.error("Error adding class:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addNewBtn = document.querySelector(".add-class button");
  const addCourseModal = document.getElementById("add-course-modal");
  const closeAddCourse = document.getElementById("close-add-course");
  const addCourseForm = document.getElementById("add-course-form");
  const successModal = document.getElementById("success-modal");
  const closeSuccessModal = document.getElementById("close-success-modal");
  const successOkBtn = document.getElementById("success-ok-btn");
  const classList = document.querySelector(".class-list");
  const classCodeSpan = document.getElementById("generated-class-code");

  // Show Add New Course modal
  addNewBtn.addEventListener("click", () => {
    addCourseModal.style.display = "block";
  });

  // Close Add Course modal
  closeAddCourse.addEventListener("click", () => {
    addCourseModal.style.display = "none";
  });

  // Handle Add Course form submission
  addCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("course-title").value.trim();
    const description = document.getElementById("course-description").value.trim();

    if (title === "") {
      alert("Course title is required.");
      return;
    }

    const classCode = generateClassCode();

    // Add new course to sidebar UI
    const newLi = document.createElement("li");
    const newBtn = document.createElement("button");
    newBtn.textContent = `📚 ${title}`;
    newLi.appendChild(newBtn);
    classList.insertBefore(newLi, classList.querySelector(".add-class"));

    // Show success modal with generated code
    classCodeSpan.textContent = classCode;
    addCourseModal.style.display = "none";
    successModal.style.display = "block";

    // ✅ Save new class to Firestore
    await addNewClass(title, description, classCode);

    // Reset form
    addCourseForm.reset();
  });

  // Close success modal
  closeSuccessModal.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  successOkBtn.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  // Utility: generate random class code
  function generateClassCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let code = "";
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }
});

