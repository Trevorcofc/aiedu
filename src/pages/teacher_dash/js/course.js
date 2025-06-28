document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const courseName = params.get("course");

  if (!courseName) {
    alert("No course selected!");
    return;
  }

  // Dummy data for now
  const coursesData = {
    history: {
      classCode: "HX2345",
      amountAdmitted: 24,
      materials: [
        "The Rise of Ancient Civilizations",
        "Medieval Europe Overview",
        "Modern History Timeline",
      ]
    },
    math: {
      classCode: "MX1010",
      amountAdmitted: 18,
      materials: [
        "Algebra Basics",
        "Geometry Theorems",
        "Calculus Introduction",
      ]
    },
    english: {
      classCode: "EN5678",
      amountAdmitted: 30,
      materials: [
        "Grammar Essentials",
        "Essay Writing",
        "Poetry Analysis",
      ]
    }
  };

  const data = coursesData[courseName];

  if (data) {
    document.getElementById("course-title").textContent =
      courseName.charAt(0).toUpperCase() + courseName.slice(1);

    document.getElementById("admitted-count").textContent = data.amountAdmitted;
    document.getElementById("class-code").textContent = data.classCode;

    const list = document.getElementById("materials-list");
    list.innerHTML = "";
    data.materials.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  } else {
    document.getElementById("course-title").textContent = "Course Not Found";
  }
});
