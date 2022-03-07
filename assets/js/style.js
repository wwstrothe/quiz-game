// VARIABLES
var startBtn = document.querySelector("#startBtn");
var leaderBtn = document.querySelector("#leaderBtn");
var timer = document.querySelector(".timer");
var gameCard = document.querySelector("#quiz-questions");
var question = document.querySelector("#question");
var answer = document.querySelector("#answer");
var card = document.querySelector("#multipleChoice");
var optionOne = document.querySelector("#option1");
var optionTwo = document.querySelector("#option2");
var optionThree = document.querySelector("#option3");
var optionFour = document.querySelector("#option4");
var feedback = document.querySelector("#feedback");
var inputScore = document.querySelector("#inputScore");
var scoreBtn = document.querySelector("#scoreBtn");
var highScore = document.querySelector("#highScore");
var initialsBox = document.querySelector("#initialsBox");
var submitBtn = document.querySelector("#submitBtn");
var backBtn = document.querySelector("#backBtn");
var clearBtn = document.querySelector("#clearBtn");
var start = document.querySelector(".start");


var timeLeft = questionArray.length * 10;
var i = 0;
var s = 0;
var selection = 0;
var score = 0;
var scoreList = [];
var oneSecond;

getScore();

// Get current scores from Local Storage
function getScore() { 
  var savedScore = JSON.parse(localStorage.getItem("highScore"));
  if (savedScore !== null) {
    scoreList = savedScore;
  }
  console.log("Scores have Loaded");
}

// Save score to Local Storage
function saveScore() { 
  localStorage.setItem("highScore", JSON.stringify(scoreList));
  console.log("Scores have saved");
}

// Gets Questions from questions.js
function loadQuestion() { 
  if (i < questionArray.length) {
    question.textContent = questionArray[i].question;  //shows question
    optionOne.textContent = questionArray[i].selection[0];  // shows answer 1
    optionTwo.textContent = questionArray[i].selection[1];  // shows answer 2
    optionThree.textContent = questionArray[i].selection[2];  // shows answer 3
    optionFour.textContent = questionArray[i].selection[3];  // shows answer 4
  } else {
    endQuiz();
    console.log("No more questions left");
  }
}

// Starts timer with CLICK on Start
function startTimer() {
  oneSecond = setInterval(function () {
    timeLeft--;
    timer.textContent = "Timer: " + timeLeft;
    // added while statement to make sure timer stopper at 0 seconds to prevent endQuiz running again after it runs out in high score screen
    if (timeLeft === 0 || i >= questionArray.length) {
      clearInterval(oneSecond);
      endQuiz();
    }
  }, 1000)
}

// Answer selection function for Correct or Incorrect
function answerSelection(event) {
  if (i >= questionArray.length) {
    endQuiz();
    clearInterval(oneSecond);
  } else {
    if (event === questionArray[i].answer) {
      feedback.textContent = "Correct";
      console.log("You are correct")
    } else {
      timeLeft -= 10;
      feedback.textContent = "Incorrect";
      console.log("You are wrong")
    }
    score = timeLeft;
    i++;
    loadQuestion();
  }
}

// End Quiz, show scoreboard
function endQuiz() {
  scoreBtn.innerHTML = score;
  gameCard.classList.add("hide");
  inputScore.classList.remove("hide");
  timer.classList.add("hide");
  leaderBtn.classList.add("hide");
  scoreBoard();
}

// Track high scores, only show top 5, can adjust to show more
function scoreBoard() {
  clearScoreBoard();
  addScoreBoard();
  scoreList.sort((a, b) => {
    return b.score - a.score;
  });

  topScores = scoreList.slice(0, 5);

  for (var s = 0; s < topScores.length; s++) {
    var user = topScores[s].user;
    var userScore = topScores[s].score;

    var newDiv = document.createElement("div");
    scoreBoardDiv.appendChild(newDiv);

    var newLabel = document.createElement("label");
    newLabel.textContent = user + " : " + userScore;
    newDiv.appendChild(newLabel);
  }
}

// Function to run with Submit is clicked when initials have been entered
function addScoreBoard() {
  scoreBoardDiv = document.createElement("div");
  scoreBoardDiv.setAttribute("id", "userInitials");
  document.getElementById("scoreBoard").appendChild(scoreBoardDiv);
}

// Clears High score
function clearScoreBoard() {
  var clearScores = document.getElementById("userInitials");
  if (clearScores !== null) {
    clearScores.remove();
  }
}

// EVENT LISTENERS

// CLICK Start Button, Starts timer, and brings up question.
startBtn.addEventListener("click", function (event) {
  startTimer();
  loadQuestion();
  start.classList.add("hide");
  gameCard.classList.remove("hide");
  leaderBtn.style.display = "none";
  highScore.classList.add("hide");
});

// CLICK on correct option removes question from line-up and moves onto next
card.addEventListener("click", function (event) {
  var event = event.target;
  answerSelection(event.textContent.trim());
});

// CLICK submits high score, and bring forward high score page
submitBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var userInitials = initialsBox.value.trim();
  var newScore = {
    user: userInitials,
    score: score,
  };

  scoreList.push(newScore);
  saveScore();
  scoreBoard();
  inputScore.classList.add("hide");
  highScore.classList.remove("hide");
});

// CLICK View High Scores, and hides everything else.
leaderBtn.addEventListener("click", function (event) {
  highScore.classList.remove("hide");
  leaderBtn.classList.add("hide");
  start.classList.add("hide");
  scoreBoard();
});

// CLICK Go Back Home to start over
backBtn.addEventListener("click", function (event) {
  location.reload();
});

// CLICK to clear High Scores
clearBtn.addEventListener("click", function (event) {
  scoreList = [];
  start.classList.add("hide");
  localStorage.setItem("highScore", JSON.stringify(scoreList));
  scoreBoard();
  saveScore();
});