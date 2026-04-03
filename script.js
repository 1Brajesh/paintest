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
    headline: "This screen does not strongly suggest a neuroplastic pain pattern.",
    summary:
      "Your score falls in the low range. Based on these answers, the mind-body approach is less likely to be the main explanation for your symptoms.",
    note:
      "If symptoms persist, continue working with a licensed doctor or clinician."
  },
  {
    key: "medium",
    max: 28,
    label: "Medium score",
    headline: "Stress and tension may be part of the picture.",
    summary:
      "Your score falls in the medium range. A neuroplastic or stress-related component may be contributing to your symptoms.",
    note:
      "Before acting on that possibility, make sure a doctor has checked for organic disease or another medical explanation."
  },
  {
    key: "high",
    max: Number.POSITIVE_INFINITY,
    label: "High score",
    headline: "Your answers are strongly consistent with a neuroplastic pain pattern.",
    summary:
      "Your score falls in the high range. Stress and tension are likely playing a meaningful role in your symptoms.",
    note:
      "If a doctor has already ruled out organic disease, you may want to explore the free online book below.",
    cta: {
      label: "Open HealYourPa.in",
      href: "https://healyourpa.in"
    }
  }
];

const state = {
  currentIndex: 0,
  answers: [],
  isTransitioning: false
};

const stage = document.getElementById("quizStage");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const restartButton = document.getElementById("restartButton");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const STAGE_TRANSITION_MS = 180;

function lockUi() {
  state.isTransitioning = true;
  restartButton.disabled = true;
}

function unlockUi() {
  state.isTransitioning = false;
  restartButton.disabled = false;
}

function getScore() {
  return state.answers.reduce((total, answer) => total + answer.value, 0);
}

function getResultBand(score) {
  return resultBands.find((band) => score <= band.max);
}

function updateMeta() {
  const isComplete = state.currentIndex >= questions.length;
  const currentStep = isComplete ? questions.length : state.currentIndex + 1;

  progressText.textContent = isComplete
    ? "Results"
    : `Question ${currentStep} of ${questions.length}`;
  progressFill.style.width = `${(currentStep / questions.length) * 100}%`;
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

function renderStage(markup, bindEvents, animate = true) {
  const swapContent = () => {
    stage.innerHTML = markup;
    bindEvents();
    focusTitle();
  };

  if (!animate || stage.children.length === 0 || prefersReducedMotion.matches) {
    stage.classList.remove("is-leaving", "is-entering");
    swapContent();
    unlockUi();
    return;
  }

  stage.classList.add("is-leaving");

  window.setTimeout(() => {
    swapContent();
    stage.classList.remove("is-leaving");
    stage.classList.add("is-entering");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        stage.classList.remove("is-entering");
        window.setTimeout(unlockUi, STAGE_TRANSITION_MS);
      });
    });
  }, STAGE_TRANSITION_MS);
}

function buildQuestionMarkup(question) {
  return `
    <article class="stage-card">
      <p class="question-tag">${question.title}</p>
      <h2 class="question-title" data-focus-target tabindex="-1">${question.prompt}</h2>
      ${renderDetails(question.details)}
      <div class="answer-grid">
        ${question.options
          .map(
            (option) => `
              <button class="answer-button" type="button" data-answer-value="${option.value}" data-answer-label="${option.label}">
                <span class="answer-button__label">${option.label}</span>
              </button>
            `
          )
          .join("")}
      </div>
    </article>
  `;
}

function handleAnswer(label, value) {
  if (state.isTransitioning) {
    return;
  }

  lockUi();

  stage.querySelectorAll(".answer-button").forEach((button) => {
    button.disabled = true;
  });

  state.answers.push({ label, value });
  state.currentIndex += 1;
  updateMeta();

  if (state.currentIndex < questions.length) {
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderQuestion(animate = true) {
  const question = questions[state.currentIndex];

  renderStage(
    buildQuestionMarkup(question),
    () => {
      stage.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", () => {
          handleAnswer(button.dataset.answerLabel, Number(button.dataset.answerValue));
        });
      });
    },
    animate
  );
}

function renderResult(animate = true) {
  const score = getScore();
  const result = getResultBand(score);
  const primaryAction = result.cta
    ? `<a class="result-link" href="${result.cta.href}" target="_blank" rel="noreferrer">${result.cta.label}</a>`
    : "";

  renderStage(
    `
      <article class="stage-card">
        <span class="result-badge ${result.key}">${result.label}</span>
        <h2 class="result-title" data-focus-target tabindex="-1">${result.headline}</h2>
        <div class="result-score">
          ${score}
          <small>out of 50</small>
        </div>
        <p class="result-copy">${result.summary}</p>
        <p class="result-note">${result.note}</p>
        <div class="result-actions">
          ${primaryAction}
          <button class="result-button" type="button" id="resultRestartButton">Take the test again</button>
        </div>
      </article>
    `,
    () => {
      const resultRestartButton = document.getElementById("resultRestartButton");

      resultRestartButton.addEventListener("click", restartQuiz);
    },
    animate
  );
}

function restartQuiz() {
  if (state.isTransitioning) {
    return;
  }

  lockUi();
  state.currentIndex = 0;
  state.answers = [];
  updateMeta();
  renderQuestion();
}

restartButton.addEventListener("click", restartQuiz);

updateMeta();
renderQuestion(false);
