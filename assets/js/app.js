// ===== ESTADO GLOBAL DA APLICAÇÃO =====
const appState = {
  currentSection: "intro",
  theme: localStorage.getItem("theme") || "light",
  exercises: {
    1: { attempts: 3, completed: false, correct: false },
    2: { attempts: 3, completed: false, correct: false },
    3: { attempts: 3, completed: false, correct: false },
    4: { completed: false, apiData: [] },
  },
  lessons: {
    1: { completed: false, progress: 0, expanded: false },
    2: { completed: false, progress: 0, expanded: false },
    3: { completed: false, progress: 0, expanded: false },
    4: { completed: false, progress: 0, expanded: false },
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

  // Configurar funcionalidades da API
  setupAPIFeatures();

  // Tornar funções globalmente acessíveis
  window.navigateToSection = navigateToSection;
  window.toggleLesson = toggleLesson;
  window.practiceLesson = practiceLesson;
  window.completeLesson = completeLesson;
  window.checkAnswer = checkAnswer;
  window.nextQuestion = nextQuestion;
  window.playAudio = playAudio;
  window.resetQuiz = resetQuiz;
  window.searchArtists = searchArtists;
  window.playRandomPlaylist = playRandomPlaylist;
}

function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.querySelector(".theme-toggle");
  themeToggle.addEventListener("click", toggleTheme);
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

    // Configurar API features quando navegar para exercises
    if (sectionId === "exercises") {
      // Usar setTimeout para garantir que o DOM esteja pronto
      setTimeout(setupAPIFeatures, 100);
    }
  }
}

// Tornar a função disponível globalmente
window.navigateToSection = navigateToSection;

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

  // Verificar se o elemento existe (exercício 4 não tem feedback)
  if (!feedback) {
    return;
  }

  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function updateAttempts(exerciseId, attempts) {
  const attemptsElement = document.getElementById(`attempts${exerciseId}`);

  // Verificar se o elemento existe (exercício 4 não tem tentativas)
  if (!attemptsElement) {
    return;
  }

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
  if (button) {
    button.disabled = true;
  }

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
  localStorage.setItem("spotifyTutorLessons", JSON.stringify(appState.lessons));
  localStorage.setItem("spotifyTutorScore", appState.score.toString());
}

function loadProgress() {
  const savedProgress = localStorage.getItem("spotifyTutorProgress");
  const savedLessons = localStorage.getItem("spotifyTutorLessons");
  const savedScore = localStorage.getItem("spotifyTutorScore");

  if (savedProgress) {
    appState.exercises = JSON.parse(savedProgress);

    // Restaurar estado da UI
    Object.keys(appState.exercises).forEach((exerciseId) => {
      const exercise = appState.exercises[exerciseId];

      // Só atualizar tentativas para exercícios que têm sistema de tentativas
      if (exercise.attempts !== undefined) {
        updateAttempts(exerciseId, exercise.attempts);
      }

      if (exercise.completed) {
        if (exercise.correct) {
          showFeedback(exerciseId, "🎉 Correto! Você mandou bem!", "correct");
        } else {
          showFeedback(exerciseId, "❌ Exercício finalizado.", "incorrect");
        }

        // Só desabilitar exercícios que têm o conceito de tentativas
        if (exercise.attempts !== undefined) {
          disableExercise(exerciseId);
        }
      }
    });
  }

  if (savedLessons) {
    appState.lessons = JSON.parse(savedLessons);

    // Restaurar estado das lições
    Object.keys(appState.lessons).forEach((lessonId) => {
      const lesson = appState.lessons[lessonId];

      // Restaurar progresso
      const progressBar = document.querySelector(
        `#progress-${lessonId} .progress-bar-lesson`
      );
      if (progressBar) {
        progressBar.style.width = `${lesson.progress}%`;
      }

      // Restaurar estado de conclusão
      if (lesson.completed) {
        const completeBtn = document.querySelector(
          `[data-lesson="${lessonId}"] .btn-complete`
        );
        if (completeBtn) {
          completeBtn.textContent = "✅ Completa";
          completeBtn.classList.add("completed");
          completeBtn.disabled = true;
        }
      }

      // Restaurar estado expandido
      if (lesson.expanded) {
        const content = document.getElementById(`lesson-content-${lessonId}`);
        const card = document.querySelector(`[data-lesson="${lessonId}"]`);
        const expandIcon = card?.querySelector(".expand-icon");

        if (content && card && expandIcon) {
          content.style.display = "block";
          card.classList.add("expanded");
          expandIcon.textContent = "−";
        }
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

// ===== INTEGRAÇÃO COM MUSICBRAINZ API =====
// Esta seção implementa a integração com a API MusicBrainz para carregar dados dinâmicos

const MUSICBRAINZ_BASE_URL = "https://musicbrainz.org/ws/2";

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função para buscar artistas brasileiros na API MusicBrainz
async function fetchBrazilianArtists() {
  const loadingElement = document.getElementById("api-loading");
  const resultsContainer = document.getElementById("api-results");
  const errorElement = document.getElementById("api-error");
  const searchBtn = document.getElementById("searchArtistsBtn");

  // Função para reabilitar o botão
  function resetButton() {
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.textContent = "🎲 Descobrir Artistas Aleatórios";
    }
    if (loadingElement) {
      loadingElement.style.display = "none";
    }
  }

  try {
    // Mostrar loading
    if (loadingElement) loadingElement.style.display = "block";
    if (resultsContainer) resultsContainer.innerHTML = "";
    if (errorElement) errorElement.style.display = "none";
    if (searchBtn) {
      searchBtn.disabled = true;
      searchBtn.textContent = "🔄 Buscando novos artistas...";
    }

    // Gerar offset aleatório para obter artistas diferentes a cada busca
    const randomOffset = Math.floor(Math.random() * 300);

    // Estratégias de busca simplificadas
    const searchStrategies = [
      "country:BR AND type:group",
      "country:BR AND type:person",
      "area:Brazil",
      'area:"São Paulo"',
      'area:"Rio de Janeiro"',
    ];

    const randomStrategy =
      searchStrategies[Math.floor(Math.random() * searchStrategies.length)];
    const url = `${MUSICBRAINZ_BASE_URL}/artist/?query=${encodeURIComponent(
      randomStrategy
    )}&fmt=json&limit=8&offset=${randomOffset}`;

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SpotifyTutor/1.0 (educational app)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    // Processar e exibir resultados
    if (data.artists && data.artists.length > 0) {
      // Embaralhar a ordem dos artistas para mais aleatoriedade
      const shuffledArtists = shuffleArray([...data.artists]);

      displayArtistResults(shuffledArtists);
      appState.exercises[4].completed = true;
      // Não salvar no cache para permitir novos resultados a cada clique
      appState.exercises[4].apiData = [];
      saveProgress(); // Salvar progresso
    } else {
      throw new Error("Nenhum artista encontrado");
    }
  } catch (error) {
    // Se falhar a API, mostrar artistas de exemplo
    showAPIDemo();
  } finally {
    // Sempre reabilitar o botão
    resetButton();
  }
}

// Função para exibir resultados dos artistas
function displayArtistResults(artists) {
  const resultsContainer = document.getElementById("api-results");

  // Limpar resultados anteriores
  resultsContainer.innerHTML = "";

  // Adicionar header com informação sobre a busca aleatória
  const headerElement = document.createElement("div");
  headerElement.className = "api-results-header";
  headerElement.innerHTML = `
    <h4>🎲 Artistas Descobertos (${artists.length} encontrados)</h4>
    <p>Clique novamente no botão para descobrir outros artistas brasileiros!</p>
  `;
  resultsContainer.appendChild(headerElement);

  // Criar cards para cada artista
  artists.forEach((artist, index) => {
    const artistCard = createArtistCard(artist, index);
    resultsContainer.appendChild(artistCard);
  });

  // Mostrar container de resultados
  resultsContainer.style.display = "block";

  // Scroll até os resultados
  resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Função para criar card de artista
function createArtistCard(artist, index) {
  const card = document.createElement("div");
  card.className = "artist-card";
  card.innerHTML = `
    <div class="artist-card-header">
      <h4 class="artist-name">${escapeHtml(artist.name)}</h4>
      <span class="artist-score">Score: ${artist.score || "N/A"}</span>
    </div>
    <div class="artist-details">
      <p><strong>Tipo:</strong> ${artist.type || "Não informado"}</p>
      ${
        artist.area
          ? `<p><strong>Área:</strong> ${escapeHtml(artist.area.name)}</p>`
          : ""
      }
      ${
        artist["life-span"] && artist["life-span"].begin
          ? `<p><strong>Ativo desde:</strong> ${artist["life-span"].begin}</p>`
          : ""
      }
      ${
        artist.disambiguation
          ? `<p class="artist-disambiguation">${escapeHtml(
              artist.disambiguation
            )}</p>`
          : ""
      }
    </div>
    <div class="artist-actions">
      <a href="https://musicbrainz.org/artist/${
        artist.id
      }" target="_blank" class="view-more-btn">
        Ver no MusicBrainz
      </a>
    </div>
  `;

  // Adicionar animação
  card.style.animationDelay = `${index * 0.1}s`;

  return card;
}

// Função para mostrar erro da API
function showAPIError(message) {
  const errorElement = document.getElementById("api-error");
  errorElement.innerHTML = `
    <h4>⚠️ Erro ao carregar dados</h4>
    <p>${escapeHtml(message)}</p>
    <p>Tente novamente em alguns momentos. A API MusicBrainz pode estar temporariamente indisponível.</p>
  `;
  errorElement.style.display = "block";
}

// Função para escapar HTML e prevenir XSS
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Função para o clique do botão de artistas
function testButtonClick() {
  fetchBrazilianArtists();
}

// Função para configurar evento do botão de busca
function setupAPIFeatures() {
  const searchBtn = document.getElementById("searchArtistsBtn");

  if (searchBtn) {
    searchBtn.disabled = false;
    searchBtn.style.opacity = "1";
    searchBtn.style.cursor = "pointer";
  }
}

// Função para mostrar demo da API
function showAPIDemo() {
  const resultsContainer = document.getElementById("api-results");

  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="api-results-header">
        <h4>🎵 Artistas Brasileiros Descobertos!</h4>
        <p>Encontramos alguns artistas incríveis para você:</p>
      </div>
      
      <div class="artist-grid">
        <div class="artist-card">
          <h5>Caetano Veloso</h5>
          <p class="artist-type">Cantor e compositor</p>
          <p class="artist-description">Ícone da MPB e do movimento Tropicália</p>
        </div>
        
        <div class="artist-card">
          <h5>Anitta</h5>
          <p class="artist-type">Cantora pop</p>
          <p class="artist-description">Sucesso internacional do pop brasileiro</p>
        </div>
        
        <div class="artist-card">
          <h5>Gilberto Gil</h5>
          <p class="artist-type">Cantor e compositor</p>
          <p class="artist-description">Pioneiro da música popular brasileira</p>
        </div>
        
        <div class="artist-card">
          <h5>Marisa Monte</h5>
          <p class="artist-type">Cantora</p>
          <p class="artist-description">Voz marcante da música brasileira</p>
        </div>
      </div>
    `;

    // Marcar exercício como completo
    appState.exercises[4].completed = true;
    saveProgress();
  }
}

// ===== SISTEMA DE LIÇÕES INTERATIVAS =====

// Função para alternar expansão de lições
function toggleLesson(lessonId) {
  const content = document.getElementById(`lesson-content-${lessonId}`);
  const card = document.querySelector(`[data-lesson="${lessonId}"]`);
  const expandIcon = card.querySelector(".expand-icon");

  if (appState.lessons[lessonId].expanded) {
    // Colapsar
    content.style.display = "none";
    card.classList.remove("expanded");
    expandIcon.textContent = "+";
    appState.lessons[lessonId].expanded = false;
  } else {
    // Expandir
    content.style.display = "block";
    card.classList.add("expanded");
    expandIcon.textContent = "−";
    appState.lessons[lessonId].expanded = true;

    // Incrementar progresso ao expandir
    if (appState.lessons[lessonId].progress < 25) {
      updateLessonProgress(lessonId, 25);
    }
  }

  saveProgress();
}

// Função para atualizar progresso da lição
function updateLessonProgress(lessonId, progress) {
  appState.lessons[lessonId].progress = Math.max(
    appState.lessons[lessonId].progress,
    progress
  );
  const progressBar = document.querySelector(
    `#progress-${lessonId} .progress-bar-lesson`
  );
  if (progressBar) {
    progressBar.style.width = `${appState.lessons[lessonId].progress}%`;
  }
  saveProgress();
}

// Função para praticar lição
function practiceLesson(lessonId) {
  updateLessonProgress(lessonId, 75);

  const practiceMessages = {
    1: "Ótimo! Você está explorando os conceitos fundamentais de criação de playlists!",
    2: "Excelente! Continue explorando as ferramentas de busca do Spotify!",
    3: "Perfeito! O fluxo da playlist é essencial para uma boa experiência!",
    4: "Incrível! O design é fundamental para atrair ouvintes!",
  };

  showModal(
    "Prática em Andamento!",
    practiceMessages[lessonId],
    "practice",
    "🎯"
  );
}

// Função para completar lição
function completeLesson(lessonId) {
  appState.lessons[lessonId].completed = true;
  updateLessonProgress(lessonId, 100);

  const completeBtn = document.querySelector(
    `[data-lesson="${lessonId}"] .btn-complete`
  );
  if (completeBtn) {
    completeBtn.textContent = "✅ Completa";
    completeBtn.classList.add("completed");
    completeBtn.disabled = true;
  }

  saveProgress();

  const completionMessages = {
    1: "Parabéns! Você dominou os conceitos de criação de playlists!",
    2: "Excelente! Agora você sabe garimpar as melhores músicas!",
    3: "Fantástico! Você entende como criar um fluxo envolvente!",
    4: "Perfeito! Sua playlist está pronta para conquistar o mundo!",
  };

  showModal("Lição Completa!", completionMessages[lessonId], "complete", "🎉");
}

// Demonstrações interativas
function updatePlaylistDemo(lessonId) {
  const select = document.getElementById("genre-select");
  const result = document.getElementById("demo-result-1");

  if (select.value) {
    const suggestions = {
      pop: "💡 Sugestão: Combine hits atuais com clássicos do pop!",
      rock: "💡 Sugestão: Misture rock clássico com indie moderno!",
      jazz: "💡 Sugestão: Varie entre jazz suave e experimental!",
      electronic: "💡 Sugestão: Combine house, techno e ambient!",
    };

    result.innerHTML = suggestions[select.value];
    updateLessonProgress(1, 50);
  }
}

function simulateSearch(query) {
  const results = document.getElementById("search-results");

  if (query.length > 2) {
    const mockResults = [
      `🎵 ${query} - Artista Principal`,
      `🎵 ${query} (Remix) - DJ Mix`,
      `🎵 Similar a "${query}" - Artista Similar`,
    ];

    results.innerHTML = mockResults
      .map(
        (result) =>
          `<div style="padding: 4px 0; border-bottom: 1px solid #444;">${result}</div>`
      )
      .join("");

    updateLessonProgress(2, 50);
  } else {
    results.innerHTML = "";
  }
}

function selectCover(coverId) {
  // Remover seleção anterior
  document.querySelectorAll(".cover-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Adicionar seleção atual
  document
    .querySelectorAll(".cover-option")
    [coverId - 1].classList.add("selected");
  updateLessonProgress(4, 50);
}

function previewPlaylist() {
  const name = document.getElementById("playlist-name").value;
  const desc = document.getElementById("playlist-desc").value;

  if (name && desc) {
    const previewMessage = `Prévia da Playlist:\n\nTítulo: ${name}\nDescrição: ${desc}\n\nSua playlist está ficando incrível!`;
    showModal("Prévia da Playlist", previewMessage, "success", "🎵");
    updateLessonProgress(4, 75);
  } else {
    showWarningModal(
      "Preencha o nome e descrição da playlist primeiro!",
      "Informações Incompletas"
    );
  }
}

// ===== SISTEMA DE MODAL =====

// Função para mostrar modal
function showModal(title, message, type = "info", icon = "") {
  const modal = document.getElementById("notification-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMessage = document.getElementById("modal-message");
  const modalIcon = document.getElementById("modal-icon");
  const modalContent = modal.querySelector(".modal-content");

  // Definir ícones padrão baseado no tipo
  const icons = {
    success: "🎉",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
    practice: "🎯",
    complete: "✅",
  };

  // Configurar conteúdo
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalIcon.textContent = icon || icons[type] || icons.info;

  // Remover classes anteriores e adicionar nova
  modalContent.className = "modal-content";
  modalContent.classList.add(`modal-${type}`);

  // Mostrar modal
  modal.style.display = "flex";

  // Focar no botão de fechar para acessibilidade
  setTimeout(() => {
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }, 100);

  // Fechar com ESC
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);

  // Fechar clicando fora do modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };
}

// Função para fechar modal
function closeModal() {
  const modal = document.getElementById("notification-modal");
  modal.style.display = "none";

  // Remover event listeners
  modal.onclick = null;
}

// Função para modal de sucesso
function showSuccessModal(message, title = "Sucesso!") {
  showModal(title, message, "success");
}

// Função para modal de aviso
function showWarningModal(message, title = "Atenção!") {
  showModal(title, message, "warning");
}

// Função para modal de erro
function showErrorModal(message, title = "Erro!") {
  showModal(title, message, "error");
}

// Função para modal de informação
function showInfoModal(message, title = "Informação") {
  showModal(title, message, "info");
}
