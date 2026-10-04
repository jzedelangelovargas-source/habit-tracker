const form = document.querySelector("#habit-form");
const input = document.querySelector("#habit-input");
const habitList = document.querySelector("#habit-list");
const progress = document.querySelector("#progress");
const todayLabel = document.querySelector("#today");

let habits = JSON.parse(localStorage.getItem("habits") || "[]");

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function showHabits() {
  habitList.replaceChildren();

  const doneCount = habits.filter(
    habit => habit.completedOn === todayKey()
  ).length;

  progress.textContent = `${doneCount} sa ${habits.length} habits nagawa`;

  habits.forEach(habit => {
    const item = document.createElement("li");
    item.className = "habit";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = habit.completedOn === todayKey();
    checkbox.addEventListener("change", () => {
      habit.completedOn = checkbox.checked ? todayKey() : null;
      saveHabits();
      showHabits();
    });

    const name = document.createElement("span");
    name.textContent = habit.name;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Burahin";
    deleteButton.addEventListener("click", () => {
      habits = habits.filter(item => item.id !== habit.id);
      saveHabits();
      showHabits();
    });

    item.append(checkbox, name, deleteButton);
    habitList.append(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const name = input.value.trim();
  if (!name) return;

  habits.push({
    id: Date.now().toString(),
    name,
    completedOn: null
  });

  saveHabits();
  showHabits();
  form.reset();
});

todayLabel.textContent = new Date().toLocaleDateString("fil-PH", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});

showHabits();