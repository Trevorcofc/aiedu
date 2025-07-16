// login.js (or main.js)

// Login logic
function login(role) {
  const usernameField = document.getElementById("username");
  const passwordField = document.getElementById("password");

  if (!usernameField || !passwordField) {
    alert("Login form fields are missing!");
    return;
  }

  const username = usernameField.value.trim();
  const password = passwordField.value.trim();

  if (username && password) {
    //  Save username to local storage
    localStorage.setItem("username", username);

    //  Optionally save the user role (student / teacher)
    localStorage.setItem("userRole", role);

    //  Redirect based on user role
    if (role === "student") {
      window.location.href = "../student_dash/index.html";
    } else if (role === "teacher") {
      window.location.href = "../teacher_dash/index.html";
    } else {
      alert("Invalid user role.");
    }
  } else {
    alert("Please enter both username and password.");
  }
}
