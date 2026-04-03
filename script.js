const questions = [
  {
    title: "Question 1",
    prompt:
      "Have you experienced pain, tingling, burning, numbness, or weakness for more than 6 months, or has discomfort returned to an old area of injury?",
    options: [
      { label: "Yes", value: 5 },
      { label: "No", value: 0 }
    ]
  },
  {
    title: "Question 2",
    prompt: "Do you find that applying heat or ice provides temporary relief?",
    options: [
      { label: "Yes", value: 5 },
      { label: "No", value: 0 }
    ]
  },
  {
    title: "Question 3",
    prompt: "Do you find that exercise or movement of any kind temporarily reduces your level of discomfort?",
    options: [
      { label: "Yes", value: 5 },
      { label: "No", value: 0 }
    ]
  },
  {
    title: "Question 4",
    prompt: "Have you been told any of the following?",
    details: [
      "Surgery will not help, or has not helped",
      "You have a soft tissue problem",
      "Something is pressing on a nerve",
      "Your problem is degenerative"
    ],
    options: [
      { label: "Yes", value: 5 },
      { label: "No", value: 0 }
    ]
  },
  {
    title: "Question 5",
    prompt: "Does your level or frequency of pain change?",
    options: [
      { label: "Almost always", value: 5 },
      { label: "Sometimes", value: 3 },
      { label: "Never", value: 0 }
    ]
  },
  {
    title: "Question 6",
    prompt:
      "Does your level of pain or discomfort ever change when you are distracted or have a change in lifestyle such as vacation?",
    options: [
      { label: "Almost always", value: 5 },
      { label: "Sometimes", value: 3 },
      { label: "Never", value: 0 }
    ]
  },
  {
    title: "Question 7",
    prompt: "Do you have any history of gastrointestinal or other tension-related problems such as:",
    details: [
      "IBS",
      "Constipation",
      "Ulcer",
      "Gastritis",
      "Reflux",
      "Tension or migraine headaches",
      "Hives",
      "Eczema",
      "Any other tension-related issues"
    ],
    options: [
      { label: "Two or more", value: 5 },
      { label: "One", value: 3 },
      { label: "None", value: 0 }
    ]
  },
  {
    title: "Question 8",
    prompt: "Have you tried other methods of treating your pain such as:",
    details: [
      "Surgery",
      "Drugs",
      "Physical therapy",
      "Acupuncture",
      "Chiropractic",
      "Exercise",
      "Pain clinics",
      "Yoga",
      "Meditation",
      "Anything else not included in this list"
    ],
    options: [
      { label: "Two or more", value: 5 },
      { label: "One", value: 3 },
      { label: "None", value: 0 }
    ]
  },
  {
    title: "Question 9",
    prompt: "Does your pain move around, even slightly?",
    options: [
      { label: "Frequently", value: 5 },
      { label: "Sometimes", value: 3 },
      { label: "Never", value: 0 }
    ]
  },
  {
    title: "Question 10",
    prompt: "Do you have any of the following traits:",
    details: [
      "Dependable",
      "Controlling",
      "Spiritual",
      "Do-gooder",
      "Perfectionist",
      "Sensitive to criticism",
      "People pleaser",
      "Compulsive",
      "Hard on yourself"
    ],
    options: [
      { label: "Four or more", value: 5 },
      { label: "One to three", value: 3 },
      { label: "None", value: 0 }
    ]
  }
];

const resultBands = [
  {
    key: "low",
    max: 15,
    label: "Low score",
    headline: "The questionnaire does not strongly point to a neuroplastic pain pattern.",
    summary:
      "You have a low score. Based on this questionnaire, it is less likely that the mind-body approach will be the main fit for your healing path.",
    note:
      "If symptoms continue, keep working with a licensed doctor or clinician to rule out other causes."
  },
  {
    key: "medium",
    max: 28,
    label: "Medium score",
    headline: "Stress and tension may be contributing to your symptoms.",
    summary:
      "You have a medium score, which means it is possible that the cause of your pain has a neuroplastic or stress-related component.",
    note:
      "Before pursuing mind-body methods, make sure a doctor has checked for organic disease or another medical explanation."
  },
  {
    key: "high",
    max: Number.POSITIVE_INFINITY,
    label: "High score",
    headline: "Your answers are strongly consistent with a neuroplastic pain pattern.",
    summary:
      "You have a high score. Based on this questionnaire, it is highly likely that stress and tension are meaningfully involved in your symptoms.",
    note:
      "If a doctor has already ruled out organic disease, you may want to explore the free online book linked below.",
    cta: {
      label: "Open HealYourPa.in",
      href: "https://healyourpa.in"
    }
  }
];

const state = {
  currentIndex: 0,
  answers: []
};

const stage = document.getElementById("quizStage");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const progressFill = document.getElementById("progressFill");
const restartButton = document.getElementById("restartButton");

function getScore() {
  return state.answers.reduce((total, answer) => total + answer.value, 0);
}

function getResultBand(score) {
  return resultBands.find((band) => score <= band.max);
}

function updateMeta() {
  const answeredCount = state.answers.length;
  const progress = (answeredCount / questions.length) * 100;

  progressText.textContent = `${answeredCount} of ${questions.length}`;
  scoreText.textContent = String(getScore());
  progressFill.style.width = `${progress}%`;
}

function focusTitle() {
  const title = stage.querySelector("[data-focus-target]");

  if (title) {
    title.focus();
  }
}

function renderDetails(details) {
  if (!details || details.length === 0) {
    return "";
  }

  const items = details.map((item) => `<li>${item}</li>`).join("");
  return `<ul class="detail-list">${items}</ul>`;
}

function renderQuestion() {
  const question = questions[state.currentIndex];

  stage.innerHTML = `
    <article class="question-card">
      <p class="step-label">Question ${state.currentIndex + 1} of ${questions.length}</p>
      <h3 class="question-title" data-focus-target tabindex="-1">${question.title}</h3>
      <p class="question-copy">${question.prompt}</p>
      ${renderDetails(question.details)}
      <div class="answer-grid">
        ${question.options
          .map(
            (option) => `
              <button class="answer-button" type="button" data-answer-value="${option.value}" data-answer-label="${option.label}">
                <span class="answer-button__label">${option.label}</span>
                <span class="answer-button__meta">Choose</span>
              </button>
            `
          )
          .join("")}
      </div>
    </article>
  `;

  stage.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => {
      const value = Number(button.dataset.answerValue);
      const label = button.dataset.answerLabel;

      state.answers.push({
        question: question.title,
        label,
        value
      });

      state.currentIndex += 1;
      updateMeta();

      if (state.currentIndex < questions.length) {
        renderQuestion();
      } else {
        renderResult();
      }
    });
  });

  focusTitle();
}

function renderAnswerSummary() {
  return state.answers
    .map(
      (answer, index) => `
        <li>
          <strong>Question ${index + 1}</strong>
          <span>${answer.label}</span>
        </li>
      `
    )
    .join("");
}

function renderResult() {
  const score = getScore();
  const result = getResultBand(score);
  const scoreRange =
    result.key === "low" ? "0-15" : result.key === "medium" ? "16-28" : "29-50";
  const primaryAction = result.cta
    ? `<a class="result-link" href="${result.cta.href}" target="_blank" rel="noreferrer">${result.cta.label}</a>`
    : "";

  stage.innerHTML = `
    <article class="result-card">
      <span class="result-badge ${result.key}">${result.label}</span>
      <h3 class="result-title" data-focus-target tabindex="-1">${result.headline}</h3>
      <div class="result-score">
        ${score}
        <small>Score band: ${scoreRange}</small>
      </div>
      <p class="result-copy">${result.summary}</p>
      <p class="result-note">${result.note}</p>
      <div class="result-actions">
        ${primaryAction}
        <button class="result-button" type="button" id="resultRestartButton">Take the test again</button>
      </div>
      <ul class="answer-summary" aria-label="Your answers">
        ${renderAnswerSummary()}
      </ul>
    </article>
  `;

  const resultRestartButton = document.getElementById("resultRestartButton");
  resultRestartButton.addEventListener("click", restartQuiz);

  focusTitle();
}

function restartQuiz() {
  state.currentIndex = 0;
  state.answers = [];
  updateMeta();
  renderQuestion();
}

restartButton.addEventListener("click", restartQuiz);

updateMeta();
renderQuestion();
