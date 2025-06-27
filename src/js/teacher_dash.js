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
  addCourseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("course-title").value.trim();
    const description = document.getElementById("course-description").value.trim();

    if (title === "") {
      alert("Course title is required.");
      return;
    }

    const classCode = generateClassCode();

    // Add new course to sidebar
    const newLi = document.createElement("li");
    const newBtn = document.createElement("button");
    newBtn.textContent = `📚 ${title}`;
    newLi.appendChild(newBtn);
    classList.insertBefore(newLi, classList.querySelector(".add-class"));

    // Show success modal
    classCodeSpan.textContent = classCode;
    addCourseModal.style.display = "none";
    successModal.style.display = "block";

    // Optionally store your class somewhere (local storage, database, etc.)
    // For MVP you could simply log:
    console.log({
      title,
      description,
      classCode
    });

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
    // Generates something like ABC123
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
