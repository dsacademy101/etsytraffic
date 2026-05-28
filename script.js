/* ============================================================
   PREMIUM 30-DAY ETSY CHALLENGE ENGINE
   Clean, scalable, production-ready
============================================================ */

// -------------------------------
// 1. Challenge Data (30 Days)
// -------------------------------
const challengeDays = [
  {
    title: "Day 1 — Kickoff & Baseline",
    intro: "Start your challenge by setting your baseline and goals.",
    tasks: [
      "Log into Etsy Seller Dashboard",
      "Record 30-day stats",
      "Identify top 3 listings",
      "Write your 30-day goal"
    ]
  },
  {
    title: "Day 2 — Traffic Pillars",
    intro: "Understand where your traffic comes from.",
    tasks: [
      "List current traffic sources",
      "Choose 3 new channels",
      "Pick your main lever",
      "Save 5 competitor shops"
    ]
  },
  {
    title: "Day 3 — Shop Foundation",
    intro: "Improve branding and trust signals.",
    tasks: [
      "Update banner",
      "Rewrite announcement",
      "Add 3 shop sections",
      "Add 5 FAQs"
    ]
  }
];

// (You can paste all 30 days here — this JS supports unlimited days)


// -------------------------------
// 2. Local Storage
// -------------------------------
let state = JSON.parse(localStorage.getItem("challengeState") || "{}");

if (!state.tasks) state.tasks = {};
if (!state.currentDay) state.currentDay = 0;


// -------------------------------
// 3. Save State
// -------------------------------
function saveState() {
  localStorage.setItem("challengeState", JSON.stringify(state));
}


// -------------------------------
// 4. Render Sidebar Day List
// -------------------------------
function renderDayList() {
  const list = document.getElementById("dayList");
  list.innerHTML = "";

  challengeDays.forEach((day, index) => {
    const div = document.createElement("div");
    div.textContent = `${index + 1}. ${day.title}`;
    div.dataset.id = index;

    if (state.currentDay === index) div.classList.add("active");
    if (isDayComplete(index)) div.classList.add("completed");

    div.onclick = () => {
      state.currentDay = index;
      saveState();
      renderAll();
    };

    list.appendChild(div);
  });
}


// -------------------------------
// 5. Check if Day is Complete
// -------------------------------
function isDayComplete(dayIndex) {
  const tasks = state.tasks[dayIndex] || {};
  return challengeDays[dayIndex].tasks.every((_, i) => tasks[i]);
}


// -------------------------------
// 6. Render Current Day
// -------------------------------
function renderDay() {
  const day = challengeDays[state.currentDay];

  document.getElementById("dayTitle").textContent = day.title;
  document.getElementById("dayIntro").textContent = day.intro;

  const container = document.getElementById("taskContainer");
  container.innerHTML = "";

  const savedTasks = state.tasks[state.currentDay] || {};

  day.tasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = savedTasks[i] || false;
    checkbox.dataset.index = i;

    checkbox.onchange = () => {
      if (!state.tasks[state.currentDay]) state.tasks[state.currentDay] = {};
      state.tasks[state.currentDay][i] = checkbox.checked;
      saveState();
      updateStats();
      renderDayList();
    };

    const label = document.createElement("label");
    label.textContent = task;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}


// -------------------------------
// 7. Update Stats (Points, Streak, Days Done)
// -------------------------------
function updateStats() {
  let points = 0;
  let streak = 0;
  let daysDone = 0;

  challengeDays.forEach((day, index) => {
    const tasks = state.tasks[index] || {};
    let allDone = true;

    day.tasks.forEach((_, i) => {
      if (tasks[i]) points++;
      else allDone = false;
    });

    if (allDone) {
      points += 2; // daily bonus
      daysDone++;
      streak++;
    } else {
      streak = 0;
    }
  });

  state.points = points;
  state.streak = streak;
  state.daysDone = daysDone;

  document.getElementById("points").textContent = points;
  document.getElementById("streak").textContent = streak;
  document.getElementById("done").textContent = daysDone;

  saveState();
}


// -------------------------------
// 8. Render Everything
// -------------------------------
function renderAll() {
  renderDayList();
  renderDay();
  updateStats();
}


// -------------------------------
// 9. Go To Today Button
// -------------------------------
document.getElementById("todayBtn").onclick = () => {
  renderAll();
  window.scrollTo({ top: 0, behavior: "smooth" });
};


// -------------------------------
// 10. Initialize App
// -------------------------------
renderAll();
