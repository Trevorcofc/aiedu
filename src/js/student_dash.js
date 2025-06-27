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

  // Handle form submission
  joinClassForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const classCode = document.getElementById("join-class-code").value.trim();

    if (classCode === "") {
      alert("Please enter a class code.");
      return;
    }

    // Here you’d normally validate against a database.
    // For MVP, we’ll assume any code is valid:
    const newLi = document.createElement("li");
    const newBtn = document.createElement("button");
    newBtn.textContent = `📚 ${classCode}`;
    newLi.appendChild(newBtn);
    classList.insertBefore(newLi, classList.querySelector(".add-class"));

    joinClassModal.style.display = "none";
    successModal.style.display = "block";

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
