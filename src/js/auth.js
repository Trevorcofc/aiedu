<!-- src/js/auth.js -->
<script type="module">
  import { firebaseConfig } from "../js/firebase.js";

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
  export const auth = getAuth(app);

  // =========== SIGN UP ===========
  export async function handleSignUp(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Store display name
      if (username) await updateProfile(user, { displayName: username });

      // Send verification email
      await sendEmailVerification(user);

      alert("Account created! Check your inbox to verify your email before logging in.");
      // Optional: sign out immediately so they must verify first
      await signOut(auth);
      window.location.href = "index.html";
    } catch (err) {
      alert(prettyAuthError(err));
    }
  }

  // =========== LOGIN ===========
  export async function handleLogin(e, role) {
    if (e) e.preventDefault();
    const email    = document.getElementById("username").value.trim(); // use email field
    const password = document.getElementById("password").value;

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        alert("Please verify your email first. We’ve sent you a link when you signed up.");
        await signOut(auth);
        return;
      }

      // Save role in sessionStorage (not sensitive, just for UI routing)
      sessionStorage.setItem("userRole", role);

      // Redirect based on role
      if (role === "student") {
        window.location.href = "../student_dash/index.html";
      } else if (role === "teacher") {
        window.location.href = "../teacher_dash/index.html";
      } else {
        alert("Invalid user role.");
      }
    } catch (err) {
      alert(prettyAuthError(err));
    }
  }

  // =========== GUARD PAGES ===========
  // Call this on protected pages (dashboards) to block unauthenticated/unverified users
  export function requireAuthAndVerified(redirect = "../login/index.html") {
    onAuthStateChanged(auth, (user) => {
      if (!user || !user.emailVerified) {
        window.location.href = redirect;
      }
    });
  }

  // =========== UTILS ===========
  function prettyAuthError(err) {
    const code = err?.code || "";
    switch (code) {
      case "auth/invalid-email": return "That email looks invalid.";
      case "auth/missing-password": return "Enter your password.";
      case "auth/weak-password": return "Password should be at least 6 characters.";
      case "auth/email-already-in-use": return "An account already exists for this email.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found": return "Email or password is incorrect.";
      default: return err.message || "Something went wrong.";
    }
  }

  // Make functions callable from HTML onclick/onsubmit
  window.__auth = { handleSignUp, handleLogin, requireAuthAndVerified };
</script>
