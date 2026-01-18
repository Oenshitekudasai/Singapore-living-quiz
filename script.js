// Initialize scores if not exist
if (!localStorage.getItem("scores")) {
  localStorage.setItem("scores", JSON.stringify({
    city: 0,
    heartland: 0,
    nature: 0,
    coastal: 0,
    trendy: 0
  }));
}

let fadeInterval = null;

// Fade in music smoothly
function fadeInMusic(audio, targetVolume = 0.3, duration = 2000) {
  audio.volume = 0;
  audio.play();

  const step = targetVolume / (duration / 100);
  fadeInterval = setInterval(() => {
    if (audio.volume < targetVolume) {
      audio.volume = Math.min(audio.volume + step, targetVolume);
    } else {
      clearInterval(fadeInterval);
    }
  }, 100);
}

// Auto play music if user already started quiz
window.addEventListener("load", () => {
  const bgm = document.getElementById("bgm");
  if (!bgm) return;

  if (localStorage.getItem("musicStarted") === "yes") {
    fadeInMusic(bgm);
  }
});

// Play click sound
function playClick() {
  const click = new Audio("audios/click.mp3");
  click.play();
}

// Start quiz
function startQuiz() {
  const bgm = document.getElementById("bgm");
  localStorage.setItem("musicStarted", "yes");

  fadeInMusic(bgm);

  setTimeout(() => {
    window.location.href = "q1.html";
  }, 500);
}

// Save answer & move to next page
function saveAnswer(area) {
  playClick();
  let scores = JSON.parse(localStorage.getItem("scores"));
  scores[area]++;
  localStorage.setItem("scores", JSON.stringify(scores));

  if (location.pathname.includes("q1")) location.href = "q2.html";
  else if (location.pathname.includes("q2")) location.href = "q3.html";
  else if (location.pathname.includes("q3")) location.href = "q4.html";
  else location.href = "result.html";
}

// Show result + highlight SVG region
function showResult() {
  let scores = JSON.parse(localStorage.getItem("scores"));
  let best = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  let data = {
    city: {
      name: "Central Area",
      img: "images/city.jpg",
      desc: "You love convenience, shopping and fast-paced city living. The Central Area suits you best."
    },
    heartland: {
      name: "West Region",
      img: "images/heartland.jpg",
      desc: "You value community and affordability. The West Region fits your lifestyle."
    },
    nature: {
      name: "North Region",
      img: "images/nature.jpg",
      desc: "You enjoy greenery and peaceful surroundings. The North Region is ideal for you."
    },
    coastal: {
      name: "East Region",
      img: "images/coastal.jpg",
      desc: "You love sea breeze and outdoor activities. The East Region suits you."
    },
    trendy: {
      name: "South Region",
      img: "images/trendy.jpg",
      desc: "You enjoy arts, culture and cafés. The South Region matches your vibe."
    }
  };

  document.getElementById("result").innerText = data[best].name;
  document.getElementById("areaImg").src = data[best].img;
  document.getElementById("desc").innerText = data[best].desc;

  // SVG region mapping
  const regionMap = {
    city: "central",
    heartland: "west",
    nature: "north",
    coastal: "east",
    trendy: "south"
  };

  const regionId = regionMap[best];
  const region = document.getElementById(regionId);

  if (region) {
    region.classList.add("active");
  }
}

// Restart quiz
function restart() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Run result logic
if (document.getElementById("result")) {
  showResult();
}
