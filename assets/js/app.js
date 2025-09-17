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
