const STORAGE_KEY = "lowerBackExerciseLog.v1";
const STORAGE_MODE_KEY = "lowerBackExerciseLog.storageMode.v1";
const MEDIA_DB_NAME = "lowerBackExerciseMedia.v1";
const MEDIA_STORE_NAME = "exerciseMedia";

const exercises = [
  ["hyperextension", "Гиперэкстензия без отрыва ног", "15-20 повторений", "01-hyperextension", "Ляг на живот, ноги вместе, руки у затылка. Поднимай грудь и плечи без рывка, таз и ноги оставляй на полу.", "Укрепляет разгибатели спины, ягодицы и заднюю поверхность бедра."],
  ["down-up-dog", "Собака вниз в собаку вверх", "10-15 повторений", "02-down-up-dog", "Из положения на руках уведи таз вверх, затем плавно опусти корпус и раскрой грудь в прогибе.", "Мягко вытягивает позвоночник, раскрывает грудной отдел и плечи."],
  ["bird-dog", "Вытягивание рук и ног", "10-15 на каждую сторону", "03-bird-dog", "На четвереньках вытягивай противоположные руку и ногу в одну линию, затем спокойно меняй сторону.", "Развивает стабильность корпуса, координацию и мышцы поясницы."],
  ["glute-bridge", "Мостик, подъем таза лежа", "15-20 повторений", "04-glute-bridge", "Ляг на спину, стопы ближе к тазу. Поднимай таз до прямой линии от плеч до коленей и опускайся плавно.", "Укрепляет ягодицы и нижнюю часть спины, помогает стабилизировать таз."],
  ["boat", "Лодочка с руками вдоль тела", "10-15 повторений", "05-boat", "Ляг на живот, руки вдоль корпуса. Одновременно чуть поднимай грудь и ноги, не запрокидывая голову.", "Включает мышцы спины, ягодицы и улучшает контроль корпуса."],
  ["plank-touch", "Касание рукой ноги из планки", "10-15 на каждую сторону", "06-plank-touch", "Из планки на прямых руках уведи таз назад-вверх и тянись рукой к противоположной стопе.", "Нагружает кор, плечи, спину и заднюю поверхность ног."],
  ["cobra", "Низкая кобра в высокую", "10-15 повторений", "07-cobra", "Лежа на животе, поставь ладони рядом с грудью и плавно поднимай корпус, сохраняя мягкий прогиб.", "Раскрывает грудную клетку, улучшает подвижность спины."],
  ["wipers", "Дворники с согнутыми ногами", "10-15 на каждую сторону", "08-wipers", "Ляг на спину, руки в стороны, колени согнуты. Переводи ноги вправо и влево, контролируя поясницу.", "Мягко включает косые мышцы живота и снимает напряжение со спины."],
  ["reverse-plank", "Подъем таза из обратной планки", "10-15 повторений", "09-reverse-plank", "Сядь, поставь руки позади таза, ноги вперед. Поднимай таз до прямой линии корпуса и опускай обратно.", "Укрепляет заднюю цепь, ягодицы, кор и поясничный отдел."],
  ["leg-raise", "Подъем ног лежа на животе", "10-15 на каждую сторону", "10-leg-raise", "Ляг на живот, голову положи на предплечья. Поочередно поднимай прямые ноги без резкого маха.", "Укрепляет ягодицы, заднюю поверхность бедра и мышцы поясницы."],
].map(([id, name, target, asset, technique, benefit]) => ({
  id,
  name,
  target,
  image: `exercise-media/${asset}.gif`,
  video: `exercise-media/${asset}.mp4`,
  technique,
  benefit,
}));

const moodLabels = { 5: "Отлично", 4: "Хорошо", 3: "Нормально", 2: "Тяжело", 1: "Плохо" };
const $ = (selector) => document.querySelector(selector);

const state = {
  sessions: readSessions(),
  selectedDate: localDateKey(new Date()),
  calendarMonth: new Date(),
};

const els = {
  screens: document.querySelectorAll(".screen"),
  navButtons: document.querySelectorAll(".bottom-nav button"),
  exerciseList: $("#exerciseList"),
  exerciseTemplate: $("#exerciseTemplate"),
  sessionDate: $("#sessionDate"),
  moodSelect: $("#moodSelect"),
  painRange: $("#painRange"),
  painValue: $("#painValue"),
  sessionNote: $("#sessionNote"),
  saveButton: $("#saveButton"),
  ringReps: $("#ringReps"),
  ringDone: $("#ringDone"),
  ringPain: $("#ringPain"),
  legendReps: $("#legendReps"),
  legendDone: $("#legendDone"),
  legendPain: $("#legendPain"),
  todayDateLabel: $("#todayDateLabel"),
  todayHeadline: $("#todayHeadline"),
  todayHint: $("#todayHint"),
  statSessions: $("#statSessions"),
  statReps: $("#statReps"),
  statStreak: $("#statStreak"),
  statPain: $("#statPain"),
  chart: $("#chart"),
  chartHint: $("#chartHint"),
  monthTitle: $("#monthTitle"),
  calendar: $("#calendar"),
  dayDetail: $("#dayDetail"),
  prevMonth: $("#prevMonth"),
  nextMonth: $("#nextMonth"),
  historyList: $("#historyList"),
  backupButton: $("#backupButton"),
  manualBackupButton: $("#manualBackupButton"),
  restoreButton: $("#restoreButton"),
  restoreInput: $("#restoreInput"),
  clearButton: $("#clearButton"),
  storageInputs: document.querySelectorAll('input[name="storageMode"]'),
  storageNote: $("#storageNote"),
  backupStatus: $("#backupStatus"),
};

init();

function init() {
  els.sessionDate.value = localDateKey(new Date());
  state.selectedDate = els.sessionDate.value;
  renderExercises();
  bindEvents();
  setStorageMode(localStorage.getItem(STORAGE_MODE_KEY) || "device");
  renderAll();
}

function bindEvents() {
  els.navButtons.forEach((button) => button.addEventListener("click", () => switchScreen(button.dataset.screen)));
  els.painRange.addEventListener("input", () => {
    els.painValue.textContent = `${els.painRange.value}/10`;
    updateTodayPreview();
  });
  els.sessionDate.addEventListener("change", () => {
    state.selectedDate = els.sessionDate.value || localDateKey(new Date());
    updateTodayPreview();
  });
  els.saveButton.addEventListener("click", saveSession);
  els.prevMonth.addEventListener("click", () => shiftMonth(-1));
  els.nextMonth.addEventListener("click", () => shiftMonth(1));
  els.backupButton.addEventListener("click", shareBackup);
  els.manualBackupButton.addEventListener("click", shareBackup);
  els.restoreButton.addEventListener("click", () => els.restoreInput.click());
  els.restoreInput.addEventListener("change", restoreBackup);
  els.clearButton.addEventListener("click", clearData);
  els.storageInputs.forEach((input) => input.addEventListener("change", () => setStorageMode(input.value)));
}

function renderExercises() {
  els.exerciseList.innerHTML = "";
  exercises.forEach((exercise, index) => {
    const node = els.exerciseTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.exerciseId = exercise.id;
    node.querySelector(".exercise-index").textContent = index + 1;
    node.querySelector("strong").textContent = exercise.name;
    node.querySelector("small").textContent = exercise.target;
    const defaultMedia = node.querySelector(".default-media");
    const sourceLink = node.querySelector(".source-link");
    defaultMedia.src = exercise.image;
    defaultMedia.alt = exercise.name;
    sourceLink.href = exercise.image;
    defaultMedia.addEventListener("load", () => {
      if (!node.dataset.personalMedia) node.querySelector(".media-fallback").hidden = true;
    });
    defaultMedia.addEventListener("error", () => {
      if (!node.dataset.personalMedia) node.querySelector(".media-fallback").hidden = false;
    });
    node.querySelector(".technique").textContent = exercise.technique;
    node.querySelector(".benefit").textContent = exercise.benefit;

    const input = node.querySelector('.stepper input');
    input.value = 0;
    input.dataset.exerciseId = exercise.id;
    input.setAttribute("aria-label", `${exercise.name}, повторы`);
    input.addEventListener("input", updateTodayPreview);
    node.querySelector(".minus").addEventListener("click", () => step(input, -1));
    node.querySelector(".plus").addEventListener("click", () => step(input, 1));
    node.querySelector(".exercise-info").addEventListener("click", () => node.classList.toggle("open"));
    node.querySelector(".media-input").addEventListener("change", (event) => saveExerciseMedia(node, exercise.id, event));
    node.querySelector(".reset-media").addEventListener("click", () => resetExerciseMedia(node, exercise.id));
    els.exerciseList.append(node);
    hydrateExerciseMedia(node, exercise.id);
  });
}

async function hydrateExerciseMedia(node, exerciseId) {
  const media = await readExerciseMedia(exerciseId);
  if (!media) return;
  showPersonalMedia(node, media);
}

async function saveExerciseMedia(node, exerciseId, event) {
  const [file] = event.target.files;
  event.target.value = "";
  if (!file) return;
  try {
    await writeExerciseMedia({
      id: exerciseId,
      blob: file,
      type: file.type,
      name: file.name,
      updatedAt: new Date().toISOString(),
    });
    showPersonalMedia(node, { blob: file, type: file.type, name: file.name });
  } catch {
    alert("Не удалось сохранить медиа. Попробуй файл меньшего размера.");
  }
}

async function resetExerciseMedia(node, exerciseId) {
  await deleteExerciseMedia(exerciseId);
  clearPersonalMedia(node);
}

function showPersonalMedia(node, media) {
  clearObjectUrl(node);
  const url = URL.createObjectURL(media.blob);
  const type = media.type || media.blob.type || "";
  const defaultMedia = node.querySelector(".default-media");
  const personalImage = node.querySelector(".personal-image");
  const personalVideo = node.querySelector(".personal-video");
  const fallback = node.querySelector(".media-fallback");
  node.dataset.personalMedia = "true";
  node.dataset.objectUrl = url;
  defaultMedia.hidden = true;
  fallback.hidden = true;
  node.querySelector(".reset-media").hidden = false;

  if (type.startsWith("video/")) {
    personalImage.hidden = true;
    personalImage.removeAttribute("src");
    personalVideo.src = url;
    personalVideo.hidden = false;
    personalVideo.load();
    personalVideo.play().catch(() => {});
  } else {
    personalVideo.hidden = true;
    personalVideo.removeAttribute("src");
    personalImage.src = url;
    personalImage.alt = media.name || "Мое упражнение";
    personalImage.hidden = false;
  }
}

function clearPersonalMedia(node) {
  clearObjectUrl(node);
  node.dataset.personalMedia = "";
  const defaultMedia = node.querySelector(".default-media");
  const personalImage = node.querySelector(".personal-image");
  const personalVideo = node.querySelector(".personal-video");
  defaultMedia.hidden = false;
  personalImage.hidden = true;
  personalImage.removeAttribute("src");
  personalVideo.hidden = true;
  personalVideo.removeAttribute("src");
  node.querySelector(".reset-media").hidden = true;
  node.querySelector(".media-fallback").hidden = defaultMedia.complete && defaultMedia.naturalWidth > 0;
}

function clearObjectUrl(node) {
  if (node.dataset.objectUrl) URL.revokeObjectURL(node.dataset.objectUrl);
  node.dataset.objectUrl = "";
}

function openMediaDb() {
  if (!("indexedDB" in window)) return Promise.reject(new Error("IndexedDB unavailable"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEDIA_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        request.result.createObjectStore(MEDIA_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readExerciseMedia(id) {
  try {
    const db = await openMediaDb();
    return await idbRequest(db.transaction(MEDIA_STORE_NAME, "readonly").objectStore(MEDIA_STORE_NAME).get(id));
  } catch {
    return null;
  }
}

async function writeExerciseMedia(media) {
  const db = await openMediaDb();
  const transaction = db.transaction(MEDIA_STORE_NAME, "readwrite");
  await idbRequest(transaction.objectStore(MEDIA_STORE_NAME).put(media));
}

async function deleteExerciseMedia(id) {
  const db = await openMediaDb();
  const transaction = db.transaction(MEDIA_STORE_NAME, "readwrite");
  await idbRequest(transaction.objectStore(MEDIA_STORE_NAME).delete(id));
}

function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function step(input, delta) {
  input.value = Math.max(0, Math.min(200, Number(input.value || 0) + delta));
  updateTodayPreview();
}

function getEntries() {
  return exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    reps: clampReps($(`input[data-exercise-id="${exercise.id}"]`).value),
  }));
}

function saveSession() {
  const entries = getEntries();
  const totalReps = entries.reduce((sum, entry) => sum + entry.reps, 0);
  const session = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: els.sessionDate.value || localDateKey(new Date()),
    mood: Number(els.moodSelect.value),
    pain: Number(els.painRange.value),
    note: els.sessionNote.value.trim(),
    entries,
    totalReps,
    savedAt: new Date().toISOString(),
  };

  const existingIndex = state.sessions.findIndex((item) => item.date === session.date);
  if (existingIndex >= 0) state.sessions[existingIndex] = session;
  else state.sessions.push(session);

  state.sessions.sort((a, b) => a.date.localeCompare(b.date));
  state.selectedDate = session.date;
  state.calendarMonth = parseLocalDate(session.date);
  writeSessions();
  renderAll();
  flashSaved();
  if (getStorageMode() === "icloud") shareBackup();
}

function renderAll() {
  updateTodayPreview();
  renderStats();
  drawChart();
  renderCalendar();
  renderDayDetail();
  renderHistory();
}

function updateTodayPreview() {
  const entries = getEntries();
  const total = entries.reduce((sum, entry) => sum + entry.reps, 0);
  const done = entries.filter((entry) => entry.reps > 0).length;
  const pain = Number(els.painRange.value);
  const saved = state.sessions.find((session) => session.date === (els.sessionDate.value || state.selectedDate));

  els.ringReps.textContent = total;
  els.ringDone.textContent = `${done}/10`;
  els.ringPain.textContent = pain;
  els.legendReps.textContent = total;
  els.legendDone.textContent = `${done} из 10`;
  els.legendPain.textContent = `${pain} из 10`;
  $(".ring-reps").style.setProperty("--value", Math.min(100, total / 1.5).toFixed(0));
  $(".ring-done").style.setProperty("--value", (done * 10).toFixed(0));
  $(".ring-pain").style.setProperty("--value", (pain * 10).toFixed(0));
  els.todayDateLabel.textContent = formatDate(els.sessionDate.value || state.selectedDate);
  els.todayHeadline.textContent = saved ? `${saved.totalReps} повторений сохранено` : total ? `${total} повторений набрано` : "Тренировка не сохранена";
  els.todayHint.textContent = done ? `${done} из 10 упражнений с повторами` : "Выстави повторы и сохрани занятие.";
}

function renderStats() {
  const total = state.sessions.reduce((sum, session) => sum + session.totalReps, 0);
  const avgPain = state.sessions.length ? state.sessions.reduce((sum, session) => sum + session.pain, 0) / state.sessions.length : 0;
  els.statSessions.textContent = state.sessions.length;
  els.statReps.textContent = total;
  els.statStreak.textContent = calculateStreak();
  els.statPain.textContent = avgPain.toFixed(1);
}

function drawChart() {
  const ctx = els.chart.getContext("2d");
  const days = lastDays(14);
  const values = days.map((date) => state.sessions.find((session) => session.date === date)?.totalReps || 0);
  const max = Math.max(20, ...values);
  const width = els.chart.width;
  const height = els.chart.height;
  ctx.clearRect(0, 0, width, height);

  const padding = 34;
  const plotHeight = height - padding * 2;
  const barWidth = (width - padding * 2) / days.length - 8;
  values.forEach((value, index) => {
    const x = padding + index * ((width - padding * 2) / days.length);
    const barHeight = Math.max(3, (value / max) * plotHeight);
    const y = padding + plotHeight - barHeight;
    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, value ? "#ff2d55" : "rgba(255,255,255,.18)");
    gradient.addColorStop(1, value ? "#ff9f0a" : "rgba(255,255,255,.08)");
    roundRect(ctx, x, y, barWidth, barHeight, 10, gradient);
  });

  ctx.fillStyle = "rgba(255,255,255,.46)";
  ctx.font = "22px -apple-system, sans-serif";
  ctx.textAlign = "center";
  days.forEach((date, index) => {
    if (index % 3 === 0 || index === days.length - 1) {
      ctx.fillText(date.slice(8), padding + index * ((width - padding * 2) / days.length) + barWidth / 2, height - 10);
    }
  });
  els.chartHint.textContent = values.filter(Boolean).length ? `${values.filter(Boolean).length} активных дней` : "Нет данных";
}

function renderCalendar() {
  els.calendar.innerHTML = "";
  const year = state.calendarMonth.getFullYear();
  const month = state.calendarMonth.getMonth();
  const sessions = state.sessions.filter((session) => {
    const date = parseLocalDate(session.date);
    return date.getFullYear() === year && date.getMonth() === month;
  });
  const max = Math.max(1, ...sessions.map((session) => session.totalReps));
  els.monthTitle.textContent = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(state.calendarMonth);

  const first = new Date(year, month, 1);
  const blanks = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  for (let index = 0; index < blanks; index += 1) els.calendar.append(createBlankDay());
  for (let day = 1; day <= days; day += 1) {
    const key = localDateKey(new Date(year, month, day));
    const session = state.sessions.find((item) => item.date === key);
    const button = document.createElement("button");
    button.className = "day";
    button.type = "button";
    button.textContent = day;
    if (session) {
      button.classList.add("has-session");
      button.style.setProperty("--load", Math.max(0.22, session.totalReps / max).toFixed(2));
    }
    if (key === state.selectedDate) button.classList.add("selected");
    button.addEventListener("click", () => {
      state.selectedDate = key;
      renderCalendar();
      renderDayDetail();
    });
    els.calendar.append(button);
  }
}

function renderDayDetail() {
  const session = state.sessions.find((item) => item.date === state.selectedDate);
  if (!session) {
    els.dayDetail.innerHTML = `<article class="day-card"><p>${formatDate(state.selectedDate)}: тренировки нет.</p></article>`;
    return;
  }
  const done = session.entries.filter((entry) => entry.reps > 0).length;
  const top = [...session.entries].sort((a, b) => b.reps - a.reps)[0];
  els.dayDetail.innerHTML = `
    <article class="day-card">
      <strong>${formatDate(session.date)} · ${session.totalReps} повторений</strong>
      <p>${done}/10 упражнений · ${moodLabels[session.mood]} · боль ${session.pain}/10</p>
      <p>Максимум: ${top.name}, ${top.reps}</p>
    </article>
  `;
}

function renderHistory() {
  const sessions = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
  els.historyList.innerHTML = sessions.length ? "" : `<article class="history-entry"><p>Записей пока нет.</p></article>`;
  sessions.forEach((session) => {
    const done = session.entries.filter((entry) => entry.reps > 0).length;
    const article = document.createElement("article");
    article.className = "history-entry";
    article.innerHTML = `
      <header><span>${formatDate(session.date)}</span><span>${session.totalReps}</span></header>
      <p>${done}/10 упражнений · ${moodLabels[session.mood]} · боль ${session.pain}/10</p>
      ${session.note ? `<p>${escapeHtml(session.note)}</p>` : ""}
    `;
    els.historyList.append(article);
  });
}

function switchScreen(screen) {
  els.screens.forEach((item) => item.classList.toggle("active", item.id === `${screen}Screen`));
  els.navButtons.forEach((button) => button.classList.toggle("active", button.dataset.screen === screen));
  if (screen === "stats") drawChart();
}

function shiftMonth(direction) {
  state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + direction, 1);
  renderCalendar();
}

function getStorageMode() {
  return document.querySelector('input[name="storageMode"]:checked')?.value || "device";
}

function setStorageMode(mode) {
  const normalized = mode === "icloud" ? "icloud" : "device";
  els.storageInputs.forEach((input) => {
    input.checked = input.value === normalized;
  });
  localStorage.setItem(STORAGE_MODE_KEY, normalized);
  if (normalized === "icloud") {
    els.storageNote.textContent = "После сохранения iPhone предложит сохранить JSON-файл в iCloud Drive.";
    els.backupStatus.textContent = "iCloud Drive";
  } else {
    els.storageNote.textContent = "Статистика хранится в браузере на этом iPhone.";
    els.backupStatus.textContent = "На iPhone";
  }
}

async function shareBackup() {
  const fileName = `poyasnica-backup-${localDateKey(new Date())}.json`;
  const file = new File([JSON.stringify({ app: "Поясница v2", version: 2, sessions: state.sessions }, null, 2)], fileName, {
    type: "application/json",
  });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title: "Резервная копия тренировок", text: "Сохрани файл в iCloud Drive.", files: [file] });
  } else {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

async function restoreBackup(event) {
  const [file] = event.target.files;
  if (!file) return;
  const parsed = JSON.parse(await file.text());
  const sessions = Array.isArray(parsed) ? parsed : parsed.sessions;
  if (!Array.isArray(sessions)) return;
  state.sessions = sessions;
  writeSessions();
  renderAll();
  event.target.value = "";
}

function clearData() {
  if (!state.sessions.length || !confirm("Удалить все записи?")) return;
  state.sessions = [];
  writeSessions();
  renderAll();
}

function flashSaved() {
  const text = els.saveButton.textContent;
  els.saveButton.textContent = "Сохранено";
  setTimeout(() => {
    els.saveButton.textContent = text;
  }, 1200);
}

function createBlankDay() {
  const blank = document.createElement("span");
  blank.className = "day blank";
  return blank;
}

function calculateStreak() {
  const dates = new Set(state.sessions.map((session) => session.date));
  let date = new Date();
  let count = 0;
  while (dates.has(localDateKey(date))) {
    count += 1;
    date.setDate(date.getDate() - 1);
  }
  return count;
}

function lastDays(count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    return localDateKey(date);
  });
}

function readSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeSessions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sessions));
}

function clampReps(value) {
  return Math.max(0, Math.min(200, Number.parseInt(value, 10) || 0));
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(parseLocalDate(value));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function roundRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}
