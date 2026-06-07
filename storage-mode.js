(() => {
  const modeKey = "lowerBackExerciseLog.storageMode.v1";
  const oldKey = "lowerBackExerciseLog.autoBackup.v1";
  const oldToggle = document.querySelector("#autoBackupToggle");
  const inputs = document.querySelectorAll('input[name="storageMode"]');
  const note = document.querySelector("#storageNote");
  const status = document.querySelector("#backupStatus");

  if (!oldToggle || !inputs.length || !note || !status) return;

  function applyMode(mode) {
    const normalizedMode = mode === "icloud" ? "icloud" : "device";
    inputs.forEach((input) => {
      input.checked = input.value === normalizedMode;
    });
    oldToggle.checked = normalizedMode === "icloud";
    localStorage.setItem(modeKey, normalizedMode);
    localStorage.setItem(oldKey, String(oldToggle.checked));

    if (normalizedMode === "icloud") {
      note.textContent =
        "После каждой тренировки откроется меню iPhone. Выбери «Сохранить в Файлы» и нужную папку в iCloud Drive.";
      status.textContent = "Выбран iCloud Drive";
    } else {
      note.textContent = "Статистика хранится в браузере на этом iPhone.";
      status.textContent = "Хранится на этом устройстве";
    }
  }

  const previousMode = localStorage.getItem(modeKey);
  const legacyMode = localStorage.getItem(oldKey) === "true" ? "icloud" : "device";
  applyMode(previousMode || legacyMode);

  inputs.forEach((input) => {
    input.addEventListener("change", () => applyMode(input.value));
  });
})();
