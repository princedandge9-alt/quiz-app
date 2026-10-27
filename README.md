# Web Dev Quiz

A browser-based multiple-choice quiz app built with **HTML, CSS and JavaScript only**. No frameworks, no libraries, no API keys.

## Features

- 10 questions stored in a JavaScript array of objects
- One question at a time, with clickable options
- Instant feedback: correct answers turn green, wrong answers turn red
- Options are disabled after an answer, so you cannot score twice
- "Question X of 10" counter and a progress bar
- Next and Previous buttons
- Result screen with score, percentage and a message
- Review list showing your answer and the correct answer for each question
- Restart button
- **Extra feature 1:** Dark / light mode toggle, saved in `localStorage`
- **Extra feature 2:** Best score saved in `localStorage` and shown on the start screen
- **Extra feature 3:** Keyboard shortcuts: press `1` to `4` to choose an option, and `Enter` for Next
- Responsive layout for phones, tablets and laptops

## Project Structure

```
quiz-app/
├── index.html   # Page structure (three screens: start, quiz, result)
├── style.css    # Styles, dark mode colours, responsive layout
├── script.js    # Questions data and all quiz logic
└── README.md    # This file
```

## How to Run Locally

1. Download or clone this repository.
2. Open the folder and double-click `index.html`, or open it in your browser.

No installation or server is needed.

## How It Works

- **Data:** the `QUESTIONS` array in `script.js` holds each question, its options and the index of the correct option.
- **Rendering:** `showQuestion()` creates the option buttons with `document.createElement()`.
- **Answering:** `handleAnswer()` saves the choice, then `showAnswerState()` colours the options and disables them.
- **Navigation:** `nextQuestion()` and `prevQuestion()` change `state.currentIndex`, then redraw the screen.
- **Results:** `showResult()` calculates the score, saves the best score, and builds the review list.
- **Saved data:** `localStorage` keeps two values: `quizTheme` (light or dark) and `quizBestScore`.

## Customise the Quiz

To add or change a question, edit the `QUESTIONS` array in `script.js`:

```javascript
{
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  answer: 0   // index of the correct option: 0, 1, 2 or 3
}
```

Keyboard shortcuts 1 to 4 need exactly four options per question.

## Deploy to Vercel or Netlify

**Netlify (drag and drop):**
1. Go to https://app.netlify.com and log in.
2. Drag the whole `quiz-app` folder onto the page.
3. Copy the live link it gives you.

**Vercel (from GitHub):**
1. Go to https://vercel.com and import this GitHub repository.
2. Leave the settings as they are (no build command needed) and click **Deploy**.
3. Copy the live link.

## Live Demo

https://quiz-app-prince.netlify.app

## Author

   Prince Dandge | URN No: E25B031504 | Ajeenkya DY Patil College, Pune
