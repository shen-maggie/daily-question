const form = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const answerLabel = document.querySelector("#answer-label");
const characterCount = document.querySelector("#character-count");
const answerCount = document.querySelector("#answer-count");
const lockedState = document.querySelector("#locked-state");
const revealedState = document.querySelector("#revealed-state");
const yourAnswer = document.querySelector("#your-answer");
const privacyInputs = document.querySelectorAll('input[name="privacy"]');
const privacyResult = document.querySelector("#privacy-result");
const questionHeading = document.querySelector("#question-heading");
const dailyLabel = document.querySelector("#daily-label");
const worldNote = document.querySelector("#world-note");
const streakStatus = document.querySelector("#streak-status");
const jamieAnswer = document.querySelector("#jamie-answer");
const alexAnswer = document.querySelector("#alex-answer");
const conversationPrompt = document.querySelector("#conversation-prompt");
const modeButtons = document.querySelectorAll(".choice-button");
const shareButtons = [
  document.querySelector("#share-button"),
  document.querySelector("#share-chat-button"),
];
const toast = document.querySelector("#toast");

const privacyLabels = {
  friends: "Friends only",
  public: "Public today",
  private: "Just me",
};

const dailyModes = {
  fun: {
    label: "Today's worldwide fun question",
    question: "If our friend group had a ridiculous mascot, what would it be?",
    note: "People everywhere get the same question. Pick whatever makes you laugh first.",
    answerLabel: "Your answer",
    placeholder: "The more specific, the better...",
    jamie: "A tiny horse wearing our apartment keys like a necklace.",
    alex: "A very judgmental pigeon named Denise.",
    followUp: "Okay, who is drawing the mascot?",
  },
  reflective: {
    label: "Today's worldwide reflective challenge",
    question: "Take a ten-minute walk without your phone. What did you notice first?",
    note: "Try the small challenge, then come back and share one thing that stayed with you.",
    answerLabel: "What you noticed",
    placeholder: "A sound, a thought, a person, a tiny detail...",
    jamie: "How many people on my street have flowers by their doors.",
    alex: "I kept reaching for a podcast, then the quiet actually felt good.",
    followUp: "What is somewhere nearby we have all walked past but never explored together?",
  },
};

const savedMode = localStorage.getItem("sidequest-active-mode-001");
let activeMode = dailyModes[savedMode] ? savedMode : "fun";

function storageKey(type, mode = activeMode) {
  return `sidequest-${type}-001-${mode}`;
}

function getSaved(mode = activeMode) {
  return {
    answer: localStorage.getItem(storageKey("answer", mode)),
    privacy: localStorage.getItem(storageKey("privacy", mode)) || "friends",
  };
}

function hasCompletedToday() {
  return Boolean(getSaved("fun").answer || getSaved("reflective").answer);
}

function setFormLocked(locked) {
  answerInput.disabled = locked;
  form.querySelector("button").disabled = locked;
  privacyInputs.forEach((input) => { input.disabled = locked; });
}

function showLockedState() {
  answerInput.value = "";
  answerCount.textContent = "2 of 4";
  characterCount.textContent = "0 / 280";
  form.querySelector("button").innerHTML = 'Lock in answer <span aria-hidden="true">→</span>';
  privacyInputs.forEach((input) => { input.checked = input.value === "friends"; });
  setFormLocked(false);
  lockedState.hidden = false;
  revealedState.hidden = true;
}

function reveal(answer, privacy) {
  answerInput.value = answer;
  form.querySelector("button").textContent = "Completed today";
  characterCount.textContent = `${answer.length} / 280`;
  answerCount.textContent = "3 of 4";
  yourAnswer.textContent = answer;
  privacyResult.textContent = privacyLabels[privacy] || privacyLabels.friends;
  privacyInputs.forEach((input) => { input.checked = input.value === privacy; });
  setFormLocked(true);
  lockedState.hidden = true;
  revealedState.hidden = false;
}

function renderMode(mode) {
  activeMode = mode;
  localStorage.setItem("sidequest-active-mode-001", mode);
  const content = dailyModes[mode];
  const saved = getSaved(mode);

  modeButtons.forEach((button) => {
    const selected = button.dataset.mode === mode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  dailyLabel.textContent = content.label;
  questionHeading.textContent = content.question;
  worldNote.textContent = content.note;
  answerLabel.textContent = content.answerLabel;
  answerInput.placeholder = content.placeholder;
  jamieAnswer.textContent = content.jamie;
  alexAnswer.textContent = content.alex;
  conversationPrompt.textContent = content.followUp;

  if (hasCompletedToday()) {
    streakStatus.textContent = "Today's streak kept";
    streakStatus.classList.add("complete");
  } else {
    streakStatus.textContent = "6 day group streak";
    streakStatus.classList.remove("complete");
  }

  if (saved.answer) reveal(saved.answer, saved.privacy);
  else showLockedState();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

async function shareResults() {
  const content = dailyModes[activeMode];
  const shareData = {
    title: "Today's Sidequest",
    text: `${content.label}: ${content.question}\n\nConversation spark: ${content.followUp}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast("Conversation spark copied");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("Couldn't share this time");
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => renderMode(button.dataset.mode));
});

answerInput.addEventListener("input", () => {
  characterCount.textContent = `${answerInput.value.length} / 280`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();
  if (!answer) return;
  const privacy = form.elements.privacy.value;
  localStorage.setItem(storageKey("answer"), answer);
  localStorage.setItem(storageKey("privacy"), privacy);
  reveal(answer, privacy);
  streakStatus.textContent = "Today's streak kept";
  streakStatus.classList.add("complete");
  document.querySelector("#reveal-panel").scrollIntoView({ behavior: "smooth" });
  showToast("Sidequest complete. Your streak is safe.");
});

shareButtons.forEach((button) => button.addEventListener("click", shareResults));

renderMode(activeMode);
