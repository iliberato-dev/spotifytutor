// ===== ESTADO GLOBAL DA APLICAÇÃO =====
const appState = {
  currentSection: "intro",
  theme: localStorage.getItem("theme") || "light",
  exercises: {
    1: { attempts: 3, completed: false, correct: false },
    2: { attempts: 3, completed: false, correct: false },
    3: { attempts: 3, completed: false, correct: false },
  },
  score: 0,
};

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadProgress();
  updateProgress();
});

function initializeApp() {
  // Aplicar tema salvo
  document.documentElement.setAttribute("data-theme", appState.theme);
  updateThemeIcon();

  // Configurar event listeners
  setupEventListeners();

  // Configurar navegação
  setupNavigation();

  console.log("SpotifyTutor inicializado com sucesso! 🎵");
}

function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  themeToggle.addEventListener("click", toggleTheme);

  // Console log para debug
  console.log("Event listeners configurados");
}

// ===== SISTEMA DE NAVEGAÇÃO =====
function navigateToSection(sectionId) {
  // Esconder seção atual
  const currentSection = document.querySelector(".section.active");
  if (currentSection) {
    currentSection.classList.remove("active");
  }

  // Mostrar nova seção
  const newSection = document.getElementById(sectionId);
  if (newSection) {
    newSection.classList.add("active");
    appState.currentSection = sectionId;

    // Atualizar navegação ativa
    updateActiveNavLink(sectionId);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Ações específicas por seção
    if (sectionId === "results") {
      calculateFinalScore();
    }
  }
}

function updateActiveNavLink(sectionId) {
  // Atualizar navegação desktop
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === sectionId) {
      link.classList.add("active");
    }
  });

  // Atualizar navegação mobile
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === sectionId) {
      link.classList.add("active");
    }
  });
}

function setupNavigation() {
  // Configurar navegação desktop
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");
      navigateToSection(sectionId);
    });
  });

  // Configurar navegação mobile
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("data-section");

      // Fechar menu mobile antes de navegar
      closeMobileMenu();

      // Navegar para seção
      navigateToSection(sectionId);
    });
  });

  // Configurar botão hambúrguer
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  if (hamburgerBtn) {
    console.log("Botão hambúrguer encontrado, configurando evento...");
    hamburgerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Clique no hambúrguer detectado!");
      toggleMobileMenu();
    });
  } else {
    console.error("Botão hambúrguer não encontrado!");
  }

  // Fechar menu mobile ao clicar fora dele
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  // Fechar menu mobile com tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileMenu();
    }
  });

  // Garantir que a seção inicial está ativa
  navigateToSection("intro");
}

// ===== SISTEMA DE TEMA =====
function toggleTheme() {
  appState.theme = appState.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", appState.theme);
  localStorage.setItem("theme", appState.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggle = document.querySelector(".theme-toggle");
  themeToggle.textContent = appState.theme === "light" ? "🌙" : "☀️";
}

// ===== SISTEMA DE MENU MOBILE =====
function toggleMobileMenu() {
  console.log("toggleMobileMenu chamado");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  if (!hamburgerBtn || !mobileMenu) {
    console.error("Elementos do menu não encontrados!", {
      hamburgerBtn,
      mobileMenu,
    });
    return;
  }

  const isOpen = mobileMenu.classList.contains("active");
  console.log("Menu está aberto:", isOpen);

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  console.log("openMobileMenu chamado");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  hamburgerBtn.classList.add("active");
  mobileMenu.classList.add("active");
  hamburgerBtn.setAttribute("aria-expanded", "true");

  // Prevenir scroll do body quando menu está aberto
  body.style.overflow = "hidden";
  console.log("Menu mobile aberto");
}

function closeMobileMenu() {
  console.log("closeMobileMenu chamado");
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  hamburgerBtn.classList.remove("active");
  mobileMenu.classList.remove("active");
  hamburgerBtn.setAttribute("aria-expanded", "false");

  // Restaurar scroll do body
  body.style.overflow = "";
  console.log("Menu mobile fechado");
}

// ===== SISTEMA DE EXERCÍCIOS =====
function checkAnswer(exerciseId, correctAnswer, type) {
  const exercise = appState.exercises[exerciseId];

  // Verificar se já foi completado
  if (exercise.completed) {
    return;
  }

  // Obter resposta do usuário
  let userAnswer = getUserAnswer(exerciseId, type);

  // Verificar se uma resposta foi selecionada
  if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
    showFeedback(
      exerciseId,
      "Selecione uma resposta antes de continuar.",
      "incorrect"
    );
    return;
  }

  // Verificar resposta
  let isCorrect = false;
  if (type === "multiple") {
    // Para múltipla escolha, comparar arrays
    isCorrect = arraysEqual(userAnswer.sort(), correctAnswer.sort());
  } else {
    // Para escolha única e select
    isCorrect = userAnswer === correctAnswer;
  }

  // Decrementar tentativas
  exercise.attempts--;

  if (isCorrect) {
    // Resposta correta
    exercise.correct = true;
    exercise.completed = true;
    appState.score++;
    showFeedback(exerciseId, "🎉 Correto! Você mandou bem!", "correct");
    disableExercise(exerciseId);
  } else {
    // Resposta incorreta
    if (exercise.attempts > 0) {
      showFeedback(
        exerciseId,
        `❌ Incorreto. Tente novamente! Você tem mais ${exercise.attempts} tentativa(s).`,
        "incorrect"
      );
    } else {
      // Sem mais tentativas
      exercise.completed = true;
      showFeedback(
        exerciseId,
        `❌ Que pena! A resposta correta era: ${getCorrectAnswerText(
          exerciseId,
          correctAnswer,
          type
        )}`,
        "incorrect"
      );
      disableExercise(exerciseId);
    }
  }

  // Atualizar UI
  updateAttempts(exerciseId, exercise.attempts);
  updateProgress();
  saveProgress();

  // Verificar se todos os exercícios foram completados
  checkAllExercisesCompleted();
}

function getUserAnswer(exerciseId, type) {
  if (type === "single") {
    const selected = document.querySelector(
      `input[name="q${exerciseId}"]:checked`
    );
    return selected ? selected.value : null;
  } else if (type === "multiple") {
    const selected = document.querySelectorAll(
      `input[name="q${exerciseId}"]:checked`
    );
    return Array.from(selected).map((input) => input.value);
  } else if (type === "select") {
    const select = document.getElementById(`q${exerciseId}Select`);
    return select.value || null;
  }
}

function getCorrectAnswerText(exerciseId, correctAnswer, type) {
  const answerTexts = {
    1: {
      a: "10-15 músicas",
      b: "30-50 músicas",
      c: "100+ músicas",
      d: "Não importa a quantidade",
    },
    2: {
      a: "Discover Weekly",
      b: "Release Radar",
      c: "Modo offline",
      d: "Daily Mix",
    },
    3: {
      a: "Ordem alfabética por artista",
      b: "Das mais lentas para as mais rápidas",
      c: "Crescente em energia: aquecimento → pico → relaxamento",
      d: "Aleatória, sem critério específico",
    },
  };

  if (type === "multiple") {
    return correctAnswer
      .map((answer) => answerTexts[exerciseId][answer])
      .join(", ");
  } else {
    return answerTexts[exerciseId][correctAnswer];
  }
}

function showFeedback(exerciseId, message, type) {
  const feedback = document.getElementById(`feedback${exerciseId}`);
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function updateAttempts(exerciseId, attempts) {
  const attemptsElement = document.getElementById(`attempts${exerciseId}`);
  if (attempts > 0) {
    attemptsElement.textContent = `Tentativas restantes: ${attempts}`;
  } else {
    attemptsElement.textContent = "Sem tentativas restantes";
    attemptsElement.style.color = "#dc2626";
  }
}

function disableExercise(exerciseId) {
  // Desabilitar botão
  const button = document.querySelector(`#exercise${exerciseId} .btn-exercise`);
  button.disabled = true;

  // Desabilitar inputs
  const inputs = document.querySelectorAll(
    `#exercise${exerciseId} input, #exercise${exerciseId} select`
  );
  inputs.forEach((input) => (input.disabled = true));
}

function checkAllExercisesCompleted() {
  const allCompleted = Object.values(appState.exercises).every(
    (ex) => ex.completed
  );
  if (allCompleted) {
    const finishBtn = document.getElementById("finishBtn");
    finishBtn.disabled = false;
    finishBtn.textContent = "🎯 Ver Meu Resultado →";
  }
}

// ===== SISTEMA DE PROGRESSO =====
function updateProgress() {
  const completed = Object.values(appState.exercises).filter(
    (ex) => ex.completed
  ).length;
  const total = Object.keys(appState.exercises).length;
  const percentage = (completed / total) * 100;

  const progressFill = document.getElementById("progressFill");
  progressFill.style.width = `${percentage}%`;
}

// ===== PERSISTÊNCIA DE DADOS =====
function saveProgress() {
  localStorage.setItem(
    "spotifyTutorProgress",
    JSON.stringify(appState.exercises)
  );
  localStorage.setItem("spotifyTutorScore", appState.score.toString());
}

function loadProgress() {
  const savedProgress = localStorage.getItem("spotifyTutorProgress");
  const savedScore = localStorage.getItem("spotifyTutorScore");

  if (savedProgress) {
    appState.exercises = JSON.parse(savedProgress);

    // Restaurar estado da UI
    Object.keys(appState.exercises).forEach((exerciseId) => {
      const exercise = appState.exercises[exerciseId];
      updateAttempts(exerciseId, exercise.attempts);

      if (exercise.completed) {
        if (exercise.correct) {
          showFeedback(exerciseId, "🎉 Correto! Você mandou bem!", "correct");
        } else {
          showFeedback(exerciseId, "❌ Exercício finalizado.", "incorrect");
        }
        disableExercise(exerciseId);
      }
    });
  }

  if (savedScore) {
    appState.score = parseInt(savedScore);
  }

  checkAllExercisesCompleted();
}

// ===== SISTEMA DE PONTUAÇÃO =====
function calculateFinalScore() {
  const totalExercises = Object.keys(appState.exercises).length;
  const correctAnswers = appState.score;
  const percentage = Math.round((correctAnswers / totalExercises) * 100);

  // Atualizar display de pontuação
  document.getElementById("finalScore").textContent = correctAnswers;

  // Determinar título e detalhes baseado na pontuação
  let title, details;
  if (percentage === 100) {
    title = "🏆 Playlist Master!";
    details =
      "Perfeito! Você dominou todos os conceitos e está pronto para criar playlists incríveis. Seu conhecimento sobre curadoria musical é excepcional!";
  } else if (percentage >= 67) {
    title = "🎵 Curador em Desenvolvimento";
    details =
      "Muito bem! Você tem uma boa base sobre criação de playlists. Com mais prática, você será um expert em curadoria musical.";
  } else if (percentage >= 34) {
    title = "🎧 Iniciante Promissor";
    details =
      "Você está no caminho certo! Revise as lições e pratique mais para aprimorar suas habilidades de criação de playlists.";
  } else {
    title = "📚 Continue Estudando";
    details =
      "Não desanime! A criação de playlists é uma arte que se aprende com prática. Revise o conteúdo e tente novamente.";
  }

  document.getElementById("scoreTitle").textContent = title;
  document.getElementById("scoreDetails").innerHTML = `
        <p><strong>Pontuação:</strong> ${correctAnswers}/${totalExercises} (${percentage}%)</p>
        <p>${details}</p>
        <div style="margin-top: 1.5rem; padding: 1rem; background-color: var(--bg-secondary); border-radius: 0.5rem;">
            <p><strong>💡 Dica:</strong> Agora que você aprendeu os conceitos, que tal colocar em prática criando uma playlist real no Spotify?</p>
        </div>
    `;
}

// ===== FUNÇÃO DE RESET =====
function resetExercises() {
  // Confirmar reset
  if (
    !confirm(
      "Tem certeza que deseja refazer os exercícios? Todo o progresso será perdido."
    )
  ) {
    return;
  }

  // Reset do estado
  appState.exercises = {
    1: { attempts: 3, completed: false, correct: false },
    2: { attempts: 3, completed: false, correct: false },
    3: { attempts: 3, completed: false, correct: false },
  };
  appState.score = 0;

  // Limpar localStorage
  localStorage.removeItem("spotifyTutorProgress");
  localStorage.removeItem("spotifyTutorScore");

  // Reset da UI
  Object.keys(appState.exercises).forEach((exerciseId) => {
    // Re-habilitar inputs e botões
    const inputs = document.querySelectorAll(
      `#exercise${exerciseId} input, #exercise${exerciseId} select`
    );
    inputs.forEach((input) => {
      input.disabled = false;
      input.checked = false;
      if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      }
    });

    const button = document.querySelector(
      `#exercise${exerciseId} .btn-exercise`
    );
    button.disabled = false;

    // Limpar feedback
    const feedback = document.getElementById(`feedback${exerciseId}`);
    feedback.className = "feedback";
    feedback.textContent = "";

    // Reset tentativas
    updateAttempts(exerciseId, 3);
  });

  // Desabilitar botão de finalizar
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.disabled = true;
  finishBtn.textContent = "Ver Resultado →";

  // Reset progress bar
  updateProgress();

  // Navegar para exercícios
  navigateToSection("exercises");
}

// ===== FUNÇÕES AUXILIARES =====
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ===== DADOS OPCICIONAIS VIA API (FUTURO) =====
// Esta função pode ser usada para carregar exercícios de uma API externa
async function loadExercisesFromAPI() {
  try {
    // Exemplo de como carregar dados de uma API
    // const response = await fetch('https://api.exemplo.com/exercises');
    // const exercises = await response.json();
    // return exercises;

    console.log("Funcionalidade de API preparada para implementação futura");
  } catch (error) {
    console.error("Erro ao carregar exercícios da API:", error);
  }
}

// ===== LOG DE INICIALIZAÇÃO =====
console.log("🎵 SpotifyTutor - Sistema carregado!");
console.log("📱 Aplicação responsiva e acessível");
console.log("💾 Persistência de dados ativada");
console.log("🎨 Sistema de temas disponível");
