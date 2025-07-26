
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".question-slide");
  const nextButtons = document.querySelectorAll(".nextBtn");
  const progressBar = document.getElementById("progress");
  const darkToggle = document.getElementById("darkToggle");
  const muteToggle = document.getElementById("muteToggle");
  let isMuted = false;
  muteToggle.addEventListener("click", () => {
    isMuted = !isMuted;
    muteToggle.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
    correctSound.muted = isMuted;
    wrongSound.muted = isMuted;
    backgroundMusic.muted = isMuted;
    audio.muted = isMuted;
  });
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
  const musicToggle = document.getElementById("musicToggle");
  const retakeBtn = document.getElementById("retakeBtn");
  const resultBlock = document.getElementById("result-block");
  const finalScore = document.getElementById("finalScore");
  const form = document.getElementById("quizForm");
  const timerDisplay = document.getElementById("time");

  let score = 0, current = 0;
  let timer, timeLeft = 15;

  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 1.0;
  audio.muted = false;
  const correctSound = new Audio('/sounds/correct.mp3');
  correctSound.volume = 1.0;
  correctSound.muted = false;
  const wrongSound = new Audio('/sounds/incorrect.mp3');
  wrongSound.volume = 1.0;
  wrongSound.muted = false;
  let musicPlaying = false;
  const backgroundMusic = new Audio('/sounds/bg-music.mp3');
  backgroundMusic.volume = 0.4;
  backgroundMusic.muted = false;
  backgroundMusic.loop = true;

  function startTimer() {
    timeLeft = 15;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft === 0) {
        clearInterval(timer);
        document.querySelector(".nextBtn").click();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  }

  showSlide(current);
  startTimer();

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const radios = slides[current].querySelectorAll("input[type='radio']");
      let selected = null;
      radios.forEach(r => {
        if (r.checked) selected = r.value;
        const label = r.parentElement;
        const correct = slides[current].dataset.correct;
        if (r.value === correct) {
          label.classList.add("correct");
        } else if (r.checked && r.value !== correct) {
          label.classList.add("incorrect");
        }
      });

      const correctAnswer = slides[current].dataset.correct;
      if (selected === correctAnswer) {
        score++;
        correctSound.play();
      } else {
        wrongSound.play();
      }

      setTimeout(() => {
        slides[current].style.display = "none";
        current++;
        if (current < slides.length) {
          showSlide(current);
          resetTimer();
        } else {
          form.submit();
        }
      }, 1000);
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  const nextBtn = document.getElementById("nextBtn");

  if (quizForm && nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      const selected = quizForm.querySelector("input[type='radio']:checked");
      if (!selected) {
        e.preventDefault();
        alert("⚠️ Please select your answer!");
      }
    });
  }
});
