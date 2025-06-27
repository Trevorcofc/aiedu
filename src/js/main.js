// login logic
function login(role) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    if (role === "student") {
      window.location.href = "../student_dash/index.html";
    } else if (role === "teacher") {
      window.location.href = "../teacher_dash/index.html";
    }
  } else {
    alert("Please enter both username and password.");
  }
}

