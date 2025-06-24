// login logic
function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username && password) {
    window.location.href = "../student_dash/index.html";
  } else {
    alert("Please enter both username and password.");
  }
}
