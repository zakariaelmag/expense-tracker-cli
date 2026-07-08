const STORAGE_KEY = "embers.habits.v1";
const DAY_MS = 24 * 60 * 60 * 1000;

/** @typedef {{ id: string, name: string, days: Record<string, boolean> }} Habit */

/** @type {Habit[]} */
let habits = loadHabits();

const listEl = document.getElementById("habitList");
const emptyEl = document.getElementById("emptyState");
const formEl = document.getElementById("addForm");
const inputEl = document.getElementById("habitInput");
const templateEl = document.getElementById("habitTemplate");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = inputEl.value.trim();
  if (!name) return;
  habits.push({ id: crypto.randomUUID(), name, days: {} });
  inputEl.value = "";
  saveHabits();
  render();
});

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function lastSevenDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    days.push(isoDate(new Date(Date.now() - i * DAY_MS)));
  }
  return days;
}

/** Current streak counting backward from today, breaking on the first gap. */
function currentStreak(habit) {
  let streak = 0;
  let cursor = new Date();
  while (habit.days[isoDate(cursor)]) {
    streak++;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
}

/** Longest streak ever recorded, scanning all logged dates. */
function bestStreak(habit) {
  const doneDates = Object.keys(habit.days)
    .filter((d) => habit.days[d])
    .sort();
  if (doneDates.length === 0) return 0;

  let best = 1;
  let run = 1;
  for (let i = 1; i < doneDates.length; i++) {
    const prev = new Date(doneDates[i - 1]);
    const curr = new Date(doneDates[i]);
    const gap = Math.round((curr - prev) / DAY_MS);
    run = gap === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

function render() {
  listEl.innerHTML = "";
  emptyEl.classList.toggle("visible", habits.length === 0);

  const today = isoDate(new Date());
  const week = lastSevenDays();

  for (const habit of habits) {
    const node = templateEl.content.cloneNode(true);
    const card = node.querySelector(".habit-card");
    node.querySelector(".habit-card__name").textContent = habit.name;

    const meter = node.querySelector(".habit-card__meter");
    for (const date of week) {
      const btn = document.createElement("button");
      btn.className = "day";
      btn.type = "button";
      btn.dataset.done = String(!!habit.days[date]);
      btn.dataset.today = String(date === today);
      const label = new Date(date).toLocaleDateString(undefined, { weekday: "short" });
      btn.setAttribute("aria-label", `${label}, ${habit.days[date] ? "done" : "not done"}`);
      btn.addEventListener("click", () => toggleDay(habit.id, date));
      meter.appendChild(btn);
    }

    node.querySelector(".streak__count").textContent = currentStreak(habit);
    node.querySelector(".habit-card__best").textContent = `best ${bestStreak(habit)}`;
    node.querySelector(".habit-card__delete").addEventListener("click", () => deleteHabit(habit.id));

    listEl.appendChild(node);
  }
}

function toggleDay(habitId, date) {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;
  habit.days[date] = !habit.days[date];
  saveHabits();
  render();
}

function deleteHabit(habitId) {
  habits = habits.filter((h) => h.id !== habitId);
  saveHabits();
  render();
}

render();
