const form = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const answerLabel = document.querySelector("#answer-label");
const characterCount = document.querySelector("#character-count");
const answerCount = document.querySelector("#answer-count");
const lockedState = document.querySelector("#locked-state");
const privateState = document.querySelector("#private-state");
const privateAnswerText = document.querySelector("#private-answer-text");
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
const toast = document.querySelector("#toast");
const todaySections = document.querySelectorAll(".today-only");
const historyView = document.querySelector("#history-view");
const historyDetail = document.querySelector("#history-detail");
const calendarDays = document.querySelectorAll(".calendar-day[data-date]");
const routeLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a[href^="#"]');

const privacyLabels = {
  friends: "My circle",
  public: "Public today",
  private: "Just me",
};

const privacyClasses = {
  friends: "circle",
  public: "public",
  private: "private",
};

const dailyModes = {
  fun: {
    shortLabel: "Fun question",
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
    shortLabel: "Reflective question",
    label: "Today's worldwide reflective question",
    question: "What is something small that has made life feel lighter lately?",
    note: "A quieter question for noticing what is already helping, even a little.",
    answerLabel: "Your reflection",
    placeholder: "A person, a habit, a place, a tiny moment...",
    jamie: "Making coffee before I look at any notifications.",
    alex: "Calling my sister while I walk home instead of waiting for a perfect time.",
    followUp: "Is there one small thing we could make easier for each other this week?",
  },
};

const historyRecords = {
  "2026-09-18": [
    { mode: "fun", privacy: "friends", question: "What tiny inconvenience would you permanently delete from the world?", answer: "Fitted sheets. No object should be that smug and that hard to fold.", shared: "Shared with The roommates · 3 replies" },
  ],
  "2026-09-16": [
    { mode: "reflective", privacy: "private", question: "What is something you are learning to be more patient with?", answer: "Not having every part of my future figured out at once.", shared: "Saved just for you" },
  ],
  "2026-09-15": [
    { mode: "fun", privacy: "public", question: "What would your extremely specific superpower be?", answer: "Always choosing the fastest grocery-store line.", shared: "Posted publicly · Shared with The roommates" },
    { mode: "reflective", privacy: "friends", question: "Where have you felt most like yourself recently?", answer: "Cooking with everyone in the kitchen, even when nobody is helping.", shared: "Shared with The roommates · 4 replies" },
  ],
  "2026-09-13": [
    { mode: "reflective", privacy: "friends", question: "What do you wish your friends asked you about more often?", answer: "The little creative projects I keep almost starting.", shared: "Shared with The roommates · 2 replies" },
  ],
  "2026-09-12": [
    { mode: "fun", privacy: "friends", question: "Which fictional home would be the worst place to have roommates?", answer: "The Batcave. Damp, loud, and Bruce would label everything.", shared: "Shared with The roommates · 5 replies" },
  ],
  "2026-09-11": [
    { mode: "fun", privacy: "friends", question: "What food opinion would get you voted out of the group?", answer: "Cold pizza is better than fresh pizza.", shared: "Shared with The roommates · 7 replies" },
  ],
  "2026-09-10": [
    { mode: "reflective", privacy: "private", question: "What has been taking more energy than you expected?", answer: "Keeping up with everyone when I actually need one quiet night.", shared: "Saved just for you" },
  ],
  "2026-09-08": [
    { mode: "fun", privacy: "friends", question: "What should our group be banned from doing unsupervised?", answer: "Planning trips after midnight.", shared: "Shared with The roommates · 6 replies" },
    { mode: "reflective", privacy: "friends", question: "What makes you feel cared for without anyone saying anything?", answer: "When someone remembers the snack I like.", shared: "Shared with The roommates · 4 replies" },
  ],
  "2026-09-07": [
    { mode: "fun", privacy: "friends", question: "What is our group chat's unofficial emergency?", answer: "Someone spotting a chair left on the sidewalk.", shared: "Shared with The roommates · 4 replies" },
  ],
  "2026-09-06": [
    { mode: "fun", privacy: "public", question: "What is the most dramatic way to leave a boring party?", answer: "Receive a fake call from the moon.", shared: "Posted publicly" },
  ],
  "2026-09-05": [
    { mode: "reflective", privacy: "friends", question: "What is one part of your week you want to protect?", answer: "Sunday mornings with nowhere to be.", shared: "Shared with The roommates · 3 replies" },
  ],
  "2026-09-03": [
    { mode: "fun", privacy: "friends", question: "What would your warning label say?", answer: "Will reorganize your bookshelf without permission.", shared: "Shared with The roommates · 4 replies" },
  ],
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

function getTodayRecords() {
  return ["fun", "reflective"].flatMap((mode) => {
    const saved = getSaved(mode);
    if (!saved.answer) return [];
    return [{
      mode,
      privacy: saved.privacy,
      question: dailyModes[mode].question,
      answer: saved.answer,
      shared: saved.privacy === "private" ? "Saved just for you" : saved.privacy === "public" ? "Posted publicly today" : "Shared with The roommates",
    }];
  });
}

function hasCompletedToday() {
  return getTodayRecords().length > 0;
}

function setFormLocked(locked) {
  answerInput.disabled = locked;
  form.querySelector('button[type="submit"]').disabled = locked;
  privacyInputs.forEach((input) => { input.disabled = locked; });
}

function showLockedState() {
  answerInput.value = "";
  answerCount.textContent = "2 of 4";
  characterCount.textContent = "0 / 280";
  form.querySelector('button[type="submit"]').innerHTML = 'Lock in answer <span aria-hidden="true">→</span>';
  privacyInputs.forEach((input) => { input.checked = input.value === "friends"; });
  setFormLocked(false);
  lockedState.hidden = false;
  privateState.hidden = true;
  revealedState.hidden = true;
}

function showCompleted(answer, privacy) {
  answerInput.value = answer;
  form.querySelector('button[type="submit"]').textContent = "Completed today";
  characterCount.textContent = `${answer.length} / 280`;
  privacyInputs.forEach((input) => { input.checked = input.value === privacy; });
  setFormLocked(true);
  lockedState.hidden = true;

  if (privacy === "private") {
    answerCount.textContent = "2 of 4";
    privateAnswerText.textContent = answer;
    privateState.hidden = false;
    revealedState.hidden = true;
    return;
  }

  answerCount.textContent = "3 of 4";
  yourAnswer.textContent = answer;
  privacyResult.textContent = privacyLabels[privacy];
  privateState.hidden = true;
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

  streakStatus.textContent = hasCompletedToday() ? "Today's streak kept" : "6 day group streak";
  streakStatus.classList.toggle("complete", hasCompletedToday());

  if (saved.answer) showCompleted(saved.answer, saved.privacy);
  else showLockedState();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

async function shareToChat(includeFollowUp = true) {
  const content = dailyModes[activeMode];
  const followUp = includeFollowUp ? `\n\nConversation spark: ${content.followUp}` : "";
  const shareData = {
    title: "Today's Sidequest",
    text: `${content.label}: ${content.question}${followUp}`,
    url: `${window.location.origin}${window.location.pathname}#today`,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      showToast("Ready to paste into your group chat");
    }
  } catch (error) {
    if (error.name !== "AbortError") showToast("Couldn't share this time");
  }
}

function badge(text, className) {
  const item = document.createElement("span");
  item.className = `history-badge ${className}`;
  item.textContent = text;
  return item;
}

function renderHistory(date) {
  const records = date === "2026-09-19" ? getTodayRecords() : (historyRecords[date] || []);
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const fragment = document.createDocumentFragment();
  const dateLabel = document.createElement("p");
  dateLabel.className = "eyebrow";
  dateLabel.textContent = formattedDate;
  fragment.append(dateLabel);

  if (!records.length) {
    const heading = document.createElement("h2");
    heading.textContent = date === "2026-09-19" ? "Nothing chosen yet today." : "A quiet day.";
    const message = document.createElement("p");
    message.className = "history-empty";
    message.textContent = date === "2026-09-19" ? "Choose either question to keep your streak going." : "You did not answer a Sidequest on this date.";
    fragment.append(heading, message);
  } else {
    records.forEach((record, index) => {
      const entry = document.createElement("article");
      if (index > 0) entry.className = "history-entry-extra";
      const badges = document.createElement("div");
      badges.className = "history-badges";
      badges.append(
        badge(dailyModes[record.mode].shortLabel, record.mode),
        badge(privacyLabels[record.privacy], privacyClasses[record.privacy]),
      );
      const question = document.createElement("h2");
      question.textContent = record.question;
      const answer = document.createElement("blockquote");
      answer.textContent = `“${record.answer}”`;
      const shared = document.createElement("p");
      shared.className = "history-shared";
      shared.textContent = record.shared;
      entry.append(badges, question, answer, shared);
      fragment.append(entry);
    });
  }

  historyDetail.replaceChildren(fragment);
  calendarDays.forEach((day) => day.classList.toggle("selected", day.dataset.date === date));
}

function updateTodayCalendar() {
  const today = document.querySelector('[data-date="2026-09-19"]');
  const records = getTodayRecords();
  today.classList.remove("has-fun", "has-reflective", "has-both");
  if (records.length === 2) today.classList.add("has-both");
  else if (records[0]) today.classList.add(`has-${records[0].mode}`);
}

function renderRoute() {
  const historyActive = window.location.hash === "#history";
  todaySections.forEach((section) => { section.hidden = historyActive; });
  historyView.hidden = !historyActive;
  routeLinks.forEach((link) => {
    const active = historyActive ? link.getAttribute("href") === "#history" : link.getAttribute("href") === "#today";
    link.classList.toggle("active", active);
  });
  if (historyActive) {
    updateTodayCalendar();
    renderHistory(document.querySelector(".calendar-day.selected")?.dataset.date || "2026-09-18");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => renderMode(button.dataset.mode));
});

calendarDays.forEach((day) => {
  day.addEventListener("click", () => renderHistory(day.dataset.date));
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
  showCompleted(answer, privacy);
  streakStatus.textContent = "Today's streak kept";
  streakStatus.classList.add("complete");
  updateTodayCalendar();
  document.querySelector("#reveal-panel").scrollIntoView({ behavior: "smooth" });
  showToast(privacy === "private" ? "Saved just for you. Your streak is safe." : "Shared. Your streak is safe.");
});

document.querySelector("#share-button").addEventListener("click", () => shareToChat(true));
document.querySelector("#share-chat-button").addEventListener("click", () => shareToChat(true));
document.querySelector("#share-question-button").addEventListener("click", () => shareToChat(false));
window.addEventListener("hashchange", renderRoute);

renderMode(activeMode);
updateTodayCalendar();
renderRoute();
