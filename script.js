/* =========================================================
   JavaScript Quiz App
   Features: one question at a time, score tracking, progress bar,
   Next/Previous, review list, restart, dark/light mode (saved),
   best score (saved), keyboard shortcuts (1-4 and Enter).
   ========================================================= */

/* ===== 1. Quiz data =====
   Each question is an object with:
   - question: the text
   - options: an array of 4 choices
   - answer:   the index (0, 1, 2 or 3) of the correct option */
const QUESTIONS = [
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["<h6>", "<head>", "<h1>", "<heading>"],
    answer: 2
  },
  {
    question: "Which CSS property changes the text colour?",
    options: ["font-color", "text-color", "color", "foreground"],
    answer: 2
  },
  {
    question: "Which keyword declares a variable that cannot be reassigned?",
    options: ["var", "let", "const", "static"],
    answer: 2
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Model", "Digital Order Management", "Display Object Method"],
    answer: 0
  },
  {
    question: "Which array method adds an item to the end of an array?",
    options: ["push()", "pop()", "shift()", "slice()"],
    answer: 0
  },
  {
    question: "Which method converts a JavaScript object into a JSON string?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toText()"],
    answer: 1
  },
  {
    question: "Which method removes a single item from localStorage?",
    options: ["localStorage.remove()", "localStorage.removeItem()", "localStorage.delete()", "localStorage.clear()"],
    answer: 1
  },
  {
    question: "Which CSS layout system arranges items in a single row or column?",
    options: ["Flexbox", "Canvas", "Frames", "Marquee"],
    answer: 0
  },
  {
    question: "What does the strict equality operator (===) check?",
    options: ["Only the value", "Only the type", "Both the value and the type", "Assigns a new value"],
    answer: 2
  },
  {
    question: "Which HTML tag is used for an unordered (bulleted) list?",
    options: ["<ol>", "<ul>", "<li>", "<dl>"],
    answer: 1
  }
];

/* ===== 2. Constants and state ===== */
const THEME_KEY = "quizTheme";
const BEST_KEY = "quizBestScore";

// The state changes while the quiz runs.
// answers[i] holds the chosen option index for question i, or null if not answered.
const state = {
  currentIndex: 0,
  answers: []
};

/* ===== 3. Element references ===== */
const el = {
  themeToggle: document.getElementById("theme-toggle"),
  startScreen: document.getElementById("start-screen"),
  quizScreen: document.getElementById("quiz-screen"),
  resultScreen: document.getElementById("result-screen"),
  bestScore: document.getElementById("best-score"),
  startBtn: document.getElementById("start-btn"),
  questionCounter: document.getElementById("question-counter"),
  scoreLive: document.getElementById("score-live"),
  progressBar: document.getElementById("progress-bar"),
  questionText: document.getElementById("question-text"),
  optionsContainer: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  finalScore: document.getElementById("final-score"),
  finalPercent: document.getElementById("final-percent"),
  resultMessage: document.getElementById("result-message"),
  resultBest: document.getElementById("result-best"),
  reviewList: document.getElementById("review-list"),
  restartBtn: document.getElementById("restart-btn")
};

/* ===== 4. Storage helpers =====
   localStorage can be blocked (for example in some private modes).
   These wrappers stop the app from crashing if that happens. */
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Storage is unavailable. The app still works, the value just is not saved.
  }
}

/* ===== 5. Theme (dark / light mode) ===== */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  el.themeToggle.textContent = isDark ? "☀️" : "🌙";
  el.themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  writeStorage(THEME_KEY, newTheme);
}

/* ===== 6. Best score (saved in localStorage) ===== */
// Returns the saved best score object, or null if there is none.
function getBestScore() {
  const raw = readStorage(BEST_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

// Saves the score only if it is higher than the current best.
function saveBestScore(score, total) {
  const percent = Math.round((score / total) * 100);
  const best = getBestScore();
  if (!best || percent > best.percent) {
    writeStorage(BEST_KEY, JSON.stringify({ score, total, percent }));
  }
}

// Returns the text to show for the best score.
function formatBestScore(best) {
  if (!best) {
    return "No best score yet. Play to set one!";
  }
  return `Best score: ${best.score} / ${best.total} (${best.percent}%)`;
}

/* ===== 7. Screen switching ===== */
function showScreen(screenToShow) {
  [el.startScreen, el.quizScreen, el.resultScreen].forEach((screen) => {
    screen.classList.add("hidden");
  });
  screenToShow.classList.remove("hidden");
}

/* ===== 8. Score calculation ===== */
// Returns true if the answer to question i is correct.
const isCorrect = (i) => state.answers[i] === QUESTIONS[i].answer;

// Counts correct answers. Unanswered questions count as wrong.
function calculateScore() {
  return QUESTIONS.reduce((total, _question, i) => (isCorrect(i) ? total + 1 : total), 0);
}

/* ===== 9. Quiz flow ===== */
function startQuiz() {
  state.currentIndex = 0;
  state.answers = QUESTIONS.map(() => null);
  showScreen(el.quizScreen);
  showQuestion();
}

// Draws the current question on the screen.
function showQuestion() {
  const index = state.currentIndex;
  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  el.questionCounter.textContent = `Question ${index + 1} of ${total}`;
  el.scoreLive.textContent = `Score: ${calculateScore()}`;
  el.progressBar.style.width = `${(index / total) * 100}%`;
  el.questionText.textContent = question.question;

  // Create the option buttons dynamically from the data
  el.optionsContainer.innerHTML = "";
  question.options.forEach((optionText, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = `${optionIndex + 1}. ${optionText}`;
    button.addEventListener("click", () => handleAnswer(optionIndex));
    el.optionsContainer.appendChild(button);
  });

  // If this question was already answered (user went back), show that state again
  const chosen = state.answers[index];
  if (chosen !== null) {
    showAnswerState(chosen);
  } else {
    el.feedback.textContent = "";
    el.feedback.className = "feedback";
  }

  el.prevBtn.disabled = index === 0;
  el.nextBtn.textContent = index === total - 1 ? "Finish" : "Next";
}

// Called when the user picks an option.
function handleAnswer(optionIndex) {
  // Stop a second answer for the same question
  if (state.answers[state.currentIndex] !== null) {
    return;
  }
  state.answers[state.currentIndex] = optionIndex;
  showAnswerState(optionIndex);
  el.scoreLive.textContent = `Score: ${calculateScore()}`;
}

// Colours the options, disables them, and shows the feedback message.
function showAnswerState(chosen) {
  const correctIndex = QUESTIONS[state.currentIndex].answer;
  const buttons = el.optionsContainer.querySelectorAll(".option-btn");

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === correctIndex) {
      button.classList.add("correct");
    }
    if (i === chosen && chosen !== correctIndex) {
      button.classList.add("wrong");
    }
  });

  if (chosen === correctIndex) {
    el.feedback.textContent = "Correct! 🎉";
    el.feedback.className = "feedback good";
  } else {
    el.feedback.textContent = `Wrong. The correct answer is: ${QUESTIONS[state.currentIndex].options[correctIndex]}`;
    el.feedback.className = "feedback bad";
  }
}

function nextQuestion() {
  if (state.currentIndex === QUESTIONS.length - 1) {
    showResult();
    return;
  }
  state.currentIndex += 1;
  showQuestion();
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    showQuestion();
  }
}

/* ===== 10. Result screen ===== */
// Returns a message based on the percentage.
function getResultMessage(percent) {
  if (percent === 100) {
    return "Perfect score! Outstanding work!";
  }
  if (percent >= 70) {
    return "Great job!";
  }
  if (percent >= 40) {
    return "Good effort. Review your answers and try again.";
  }
  return "Try again. Practise the basics and you will improve!";
}

function showResult() {
  const total = QUESTIONS.length;
  const score = calculateScore();
  const percent = Math.round((score / total) * 100);

  saveBestScore(score, total);

  el.finalScore.textContent = `Your score: ${score} / ${total}`;
  el.finalPercent.textContent = `Percentage: ${percent}%`;
  el.resultMessage.textContent = getResultMessage(percent);
  el.resultBest.textContent = formatBestScore(getBestScore());

  renderReview();
  showScreen(el.resultScreen);
}

// Creates one review card per question.
function renderReview() {
  el.reviewList.innerHTML = "";

  QUESTIONS.forEach((question, i) => {
    const chosen = state.answers[i];

    const item = document.createElement("div");
    item.className = `review-item ${isCorrect(i) ? "good" : "bad"}`;

    const title = document.createElement("p");
    title.className = "review-question";
    title.textContent = `${i + 1}. ${question.question}`;

    const yourAnswer = document.createElement("p");
    yourAnswer.textContent = `Your answer: ${chosen === null ? "Not answered" : question.options[chosen]}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.textContent = `Correct answer: ${question.options[question.answer]}`;

    item.append(title, yourAnswer, correctAnswer);
    el.reviewList.appendChild(item);
  });
}

/* ===== 11. Keyboard shortcuts =====
   1-4 choose an option, Enter goes to Next.
   Enter on a focused button is skipped here, because the browser
   already clicks that button. This stops a question being skipped twice. */
document.addEventListener("keydown", (event) => {
  if (el.quizScreen.classList.contains("hidden")) {
    return;
  }

  const number = Number(event.key);
  const optionCount = QUESTIONS[state.currentIndex].options.length;

  if (Number.isInteger(number) && number >= 1 && number <= optionCount) {
    handleAnswer(number - 1);
  } else if (event.key === "Enter" && event.target.tagName !== "BUTTON") {
    nextQuestion();
  }
});

/* ===== 12. Event listeners ===== */
el.themeToggle.addEventListener("click", toggleTheme);
el.startBtn.addEventListener("click", startQuiz);
el.nextBtn.addEventListener("click", nextQuestion);
el.prevBtn.addEventListener("click", prevQuestion);
el.restartBtn.addEventListener("click", startQuiz);

/* ===== 13. Start the app ===== */
function init() {
  applyTheme(readStorage(THEME_KEY) === "dark" ? "dark" : "light");
  el.bestScore.textContent = formatBestScore(getBestScore());
  showScreen(el.startScreen);
}

init();
