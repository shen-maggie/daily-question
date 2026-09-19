const form = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const characterCount = document.querySelector("#character-count");
const answerCount = document.querySelector("#answer-count");
const lockedState = document.querySelector("#locked-state");
const revealedState = document.querySelector("#revealed-state");
const yourAnswer = document.querySelector("#your-answer");
const shareButtons = [
  document.querySelector("#share-button"),
  document.querySelector("#share-chat-button"),
];
const toast = document.querySelector("#toast");
const privacyInputs = document.querySelectorAll('input[name="privacy"]');
const privacyResult = document.querySelector("#privacy-result");

const savedAnswer = localStorage.getItem("sidequest-answer-001");
const savedPrivacy = localStorage.getItem("sidequest-privacy-001") || "friends";

const privacyLabels = {
  friends: "Friends only",
  public: "Public today",
  private: "Just me",
};

function reveal(answer, privacy = savedPrivacy) {
  answerInput.value = answer;
  answerInput.disabled = true;
  form.querySelector("button").textContent = "Answer locked in";
  form.querySelector("button").disabled = true;
  characterCount.textContent = `${answer.length} / 280`;
  answerCount.textContent = "3 of 4";
  yourAnswer.textContent = answer;
  privacyResult.textContent = privacyLabels[privacy] || privacyLabels.friends;
  privacyInputs.forEach((input) => {
    input.checked = input.value === privacy;
    input.disabled = true;
  });
  lockedState.hidden = true;
  revealedState.hidden = false;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

async function shareResults() {
  const shareData = {
    title: "Today's Sidequest",
    text: "Today's question: What is something you want the group to make time for this fall?\n\nConversation spark: What is one night this month everyone can protect?",
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

answerInput.addEventListener("input", () => {
  characterCount.textContent = `${answerInput.value.length} / 280`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim();
  if (!answer) return;
  const privacy = form.elements.privacy.value;
  localStorage.setItem("sidequest-answer-001", answer);
  localStorage.setItem("sidequest-privacy-001", privacy);
  reveal(answer, privacy);
  document.querySelector("#reveal-panel").scrollIntoView({ behavior: "smooth" });
  showToast("Answer locked in. Responses revealed.");
});

shareButtons.forEach((button) => button.addEventListener("click", shareResults));

if (savedAnswer) reveal(savedAnswer);
