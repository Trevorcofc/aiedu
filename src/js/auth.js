// src/js/auth.js
import { firebaseConfig } from "./firebase.js"; // same folder

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ========== SIGN UP ==========
async function handleSignUp(e) {
  e?.preventDefault();
  const username = document.getElementById("username")?.value.trim();
  const email    = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (username) await updateProfile(user, { displayName: username });
    await sendEmailVerification(user);
    alert("Account created! Check your inbox to verify your email.");
    await signOut(auth); // force verify before login
    window.location.href = "index.html";
  } catch (err) {
    alert(prettyAuthError(err));
  }
}

// ========== LOGIN ==========
async function handleLogin(e, role) {
  e?.preventDefault();
  const email    = document.getElementById("username")?.value.trim(); // email field
  const password = document.getElementById("password")?.value;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    if (!user.emailVerified) {
      alert("Please verify your email first (check your inbox).");
      await signOut(auth);
      return;
    }
    sessionStorage.setItem("userRole", role || "student");
    if (role === "teacher") {
      window.location.href = "../teacher_dash/index.html";
    } else {
      window.location.href = "../student_dash/index.html";
    }
  } catch (err) {
    alert(prettyAuthError(err));
  }
}

// ========== GUARD ==========
function requireAuthAndVerified(redirect = "../login/index.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user || !user.emailVerified) {
      window.location.href = redirect;
    }
  });
}

// ========== UTILS ==========
function prettyAuthError(err) {
  switch (err?.code) {
    case "auth/invalid-email": return "That email looks invalid.";
    case "auth/missing-password": return "Enter your password.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/email-already-in-use": return "An account already exists for this email.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Email or password is incorrect.";
    default: return err?.message || "Something went wrong.";
  }
}

// Expose for HTML pages to use
window.__auth = { handleSignUp, handleLogin, requireAuthAndVerified };
