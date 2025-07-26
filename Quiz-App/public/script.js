document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".question-slide");
  const nextButtons = document.querySelectorAll(".nextBtn");
  const progressBar = document.getElementById("progress");
  const darkToggle = document.getElementById("darkToggle");
  const muteToggle = document.getElementById("muteToggle");
  const form = document.getElementById("quizForm");
  const timerDisplay = document.getElementById("time");

  let score = 0, current = 0;
  let timer, timeLeft = 15;

  const audio = new Audio('/sounds/click.mp3');
  const correctSound = new Audio('/sounds/correct.mp3');
  const wrongSound = new Audio('/sounds/incorrect.mp3');
  const backgroundMusic = new Audio('/sounds/bg-music.mp3');
  backgroundMusic.loop = true;

  const audioElements = [audio, correctSound, wrongSound, backgroundMusic];

  if (localStorage.getItem("isMuted") === null) {
    localStorage.setItem("isMuted", "false");
  }

  let isMuted = localStorage.getItem("isMuted") === "true";
  audioElements.forEach(el => {
    el.volume = el === backgroundMusic ? 0.4 : 1.0;
    el.muted = isMuted;
  });

  if (muteToggle) {
    muteToggle.textContent = isMuted ? "🔇 Mute" : "🔈 Unmute";

    muteToggle.addEventListener("click", () => {
      isMuted = !isMuted;
      audioElements.forEach(el => el.muted = isMuted);
      muteToggle.textContent = isMuted ? "🔇 Mute" : "🔈 Unmute";
      localStorage.setItem("isMuted", isMuted);
    });
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
    });
  }


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

  const nextBtn = document.getElementById("nextBtn");
  if (form && nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      const selected = form.querySelector("input[type='radio']:checked");
      if (!selected) {
        e.preventDefault();
        alert("⚠️ Please select your answer!");
      }
    });
  }
});
