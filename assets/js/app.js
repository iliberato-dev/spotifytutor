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
  window.searchArtists = searchArtists;
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
    hamburgerBtn.addEventListener("click", (e) => {
      e.preventDefault();
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

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  hamburgerBtn.classList.add("active");
  mobileMenu.classList.add("active");
  hamburgerBtn.setAttribute("aria-expanded", "true");

  // Prevenir scroll do body quando menu está aberto
  body.style.overflow = "hidden";
}

function closeMobileMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;

  hamburgerBtn.classList.remove("active");
  mobileMenu.classList.remove("active");
  hamburgerBtn.setAttribute("aria-expanded", "false");

  // Restaurar scroll do body
  body.style.overflow = "";
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

// Base URL da API Vagalume
const VAGALUME_BASE_URL = "https://api.vagalume.com.br";

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Função para buscar artistas (chama a função principal)
function searchArtists() {
  fetchBrazilianArtists();
}

// Função para buscar artistas brasileiros na API Vagalume
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
      searchBtn.textContent = "🔄 Buscando artistas brasileiros...";
    }

    // Lista de artistas brasileiros famosos para buscar no Vagalume
    const brazilianArtists = [
      "caetano-veloso", "gilberto-gil", "chico-buarque", "maria-bethania",
      "gal-costa", "elis-regina", "tom-jobim", "vinicius-de-moraes",
      "milton-nascimento", "djavan", "cazuza", "rita-lee", "raul-seixas",
      "roberto-carlos", "ivete-sangalo", "claudia-leitte", "anitta",
      "pabllo-vittar", "luiza-sonza", "jorge-ben-jor", "marisa-monte",
      "legiao-urbana", "capital-inicial", "skank", "charlie-brown-jr",
      "titas", "sepultura", "jota-quest", "nx-zero", "fresno",
      "natiruts", "o-rappa", "cidade-negra", "raimundos", "paralamas-do-sucesso",
      "kid-abelha", "los-hermanos", "engenheiros-do-hawaii", "ira",
      "ultraje-a-rigor", "biquini-cavadao", "plebe-rude", "capital-inicial",
      "mc-kevinho", "mc-hariel", "ludmilla", "simone-e-simaria",
      "maiara-e-maraisa", "henrique-e-juliano", "jorge-e-mateus",
      "gusttavo-lima", "wesley-safadao", "xand-aviao"
    ];

    // Embaralhar e pegar 8 artistas aleatórios
    const shuffledArtists = shuffleArray([...brazilianArtists]);
    const selectedArtists = shuffledArtists.slice(0, 8);

    // Buscar informações de cada artista
    const artistPromises = selectedArtists.map(async (artistSlug) => {
      try {
        const url = `https://www.vagalume.com.br/${artistSlug}/index.js`;
        
        const response = await fetch(url);
        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        
        if (data.artist) {
          // Construir URLs completas para as imagens
          let picMedium = null;
          let picSmall = null;
          
          if (data.artist.pic_medium) {
            // Se a URL já é absoluta, usar como está
            if (data.artist.pic_medium.startsWith('http')) {
              picMedium = data.artist.pic_medium;
            } else {
              // Se é relativa, construir URL completa
              picMedium = `https://www.vagalume.com.br${data.artist.pic_medium}`;
            }
          }
          
          if (data.artist.pic_small) {
            // Se a URL já é absoluta, usar como está
            if (data.artist.pic_small.startsWith('http')) {
              picSmall = data.artist.pic_small;
            } else {
              // Se é relativa, construir URL completa
              picSmall = `https://www.vagalume.com.br${data.artist.pic_small}`;
            }
          }
          
          return {
            id: data.artist.id || artistSlug,
            name: data.artist.desc || artistSlug.replace(/-/g, ' '),
            type: "Artista",
            score: data.artist.rank ? data.artist.rank.points : Math.floor(Math.random() * 100) + 1,
            area: { name: "Brasil" },
            disambiguation: data.artist.genre && data.artist.genre.length > 0 ? 
              `Gênero: ${data.artist.genre.map(g => g.name).join(', ')}` : "",
            "life-span": null,
            // Dados específicos do Vagalume
            vagalume_id: data.artist.id,
            pic_medium: picMedium,
            pic_small: picSmall,
            genre: data.artist.genre ? data.artist.genre.map(g => g.name).join(', ') : "",
            url: `https://www.vagalume.com.br${data.artist.url}`,
            views: data.artist.rank ? data.artist.rank.views : null,
            rank_position: data.artist.rank ? data.artist.rank.pos : null
          };
        }
        
        return null;
      } catch (error) {
        console.log(`❌ Erro ao buscar ${artistSlug}:`, error);
        return null;
      }
    });

    // Aguardar todas as buscas
    const artistResults = await Promise.all(artistPromises);
    
    // Filtrar resultados válidos
    const validArtists = artistResults.filter(artist => artist !== null);

    if (validArtists.length > 0) {
      displayArtistResults(validArtists);
      appState.exercises[4].completed = true;
      saveProgress();
    } else {
      showAPIDemo();
    }
  } catch (error) {
    console.error("❌ Erro ao buscar artistas no Vagalume:", error);
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
    <h4>�🇷 Artistas Brasileiros Descobertos (${artists.length} encontrados)</h4>
    <p>Powered by <strong>Vagalume API</strong> - A maior base de música brasileira! 🎵</p>
    <p>Clique novamente no botão para descobrir outros artistas!</p>
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

  // Buscar imagem do artista na API Vagalume ou usar dados já disponíveis
  fetchArtistImageFromVagalume(artist.name, artist).then(imageUrl => {
    const imgElement = card.querySelector('.artist-img');
    if (imageUrl && imgElement) {
      // Testar se a imagem carrega antes de substituir
      const testImg = new Image();
      testImg.onload = function() {
        imgElement.src = imageUrl;
        imgElement.alt = `Foto de ${escapeHtml(artist.name)}`;
      };
      testImg.onerror = function() {
        // Manter avatar em caso de erro
      };
      testImg.src = imageUrl;
    }
  }).catch(() => {
    // Usar avatar padrão
  });

  // Gerar avatar personalizado baseado no nome do artista
  const avatarUrl = generateAvatarForBrazilianArtist(artist.name);

  // Construir todo o HTML do card de uma vez
  card.innerHTML = `
    <div class="artist-img-container">
      <img class="artist-img" src="${avatarUrl}" alt="Avatar de ${escapeHtml(artist.name)}">
    </div>
    <div class="artist-card-header">
      <h4 class="artist-name">${escapeHtml(artist.name)}</h4>
      <span class="artist-score">Score: ${artist.score || "N/A"}</span>
    </div>
    <div class="artist-details">
      <p><strong>Tipo:</strong> ${typeof artist.type === 'object' ? 'Artista' : (artist.type || "Artista")}</p>
      ${
        artist.area
          ? `<p><strong>Área:</strong> ${escapeHtml(typeof artist.area === 'object' ? artist.area.name : artist.area)}</p>`
          : ""
      }
      ${
        artist.genre
          ? `<p><strong>Gênero:</strong> ${escapeHtml(typeof artist.genre === 'object' ? 'Rock/Pop Brasileiro' : artist.genre)}</p>`
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
              typeof artist.disambiguation === 'object' ? 'Artista Brasileiro' : artist.disambiguation
            )}</p>`
          : ""
      }
    </div>
    <div class="artist-actions">
      <button class="btn btn-player" onclick="showVagalumePlayer('${escapeHtml(artist.name)}', '${artist.id || ''}')">
        🎵 Ouvir Músicas
      </button>
      ${
        artist.url
          ? `<a href="${artist.url}" target="_blank" class="view-more-btn">
              Ver no Vagalume
            </a>`
          : `<a href="https://www.vagalume.com.br/browse/artists/${encodeURIComponent(artist.name.charAt(0).toLowerCase())}.html" target="_blank" class="view-more-btn">
              Buscar no Vagalume
            </a>`
      }
    </div>
  `;

  // Adicionar animação
  // Adicionar animação
  card.style.animationDelay = `${index * 0.1}s`;

  return card;

}

// Buscar imagens específicas do artista usando a API de imagens do Vagalume
async function fetchArtistImagesFromVagalumeAPI(artistId) {
  if (!artistId) return null;
  
  try {
    // API específica de imagens do Vagalume
    const imagesUrl = `${VAGALUME_BASE_URL}/image.php?bandID=${artistId}&limit=3`;
    
    const response = await fetch(imagesUrl, {
      headers: {
        'User-Agent': 'SpotifyTutor/1.0'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Erro na API de imagens Vagalume: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Verificar se encontrou imagens
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      // Pegar a primeira imagem disponível
      const firstImage = data.images[0];
      
      if (firstImage.url) {
        return firstImage.url;
      }
      
      if (firstImage.thumbUrl) {
        return firstImage.thumbUrl;
      }
    }
    
    return null;
    return null;
    
  } catch (error) {
    console.log(`❌ Erro ao buscar imagens na API Vagalume para ID ${artistId}:`, error);
    return null;
  }
}

// Buscar imagem do artista na API Vagalume (brasileira)
async function fetchArtistImageFromVagalume(artistName, artistData = null) {
  if (!artistName) return null;
  
  // Função para normalizar URL de imagem
  function normalizeImageUrl(url) {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://www.vagalume.com.br${url}`;
  }
  
  // Se já temos dados do artista (vindos da busca), tentar a API de imagens primeiro
  if (artistData && artistData.vagalume_id) {
    const highQualityImage = await fetchArtistImagesFromVagalumeAPI(artistData.vagalume_id);
    if (highQualityImage) {
      return highQualityImage;
    }
  }
  
  // Se já temos dados do artista (vindos da busca), usar dados básicos
  if (artistData) {
    if (artistData.pic_medium) {
      const normalizedUrl = normalizeImageUrl(artistData.pic_medium);
      return normalizedUrl;
    }
    
    if (artistData.pic_small) {
      const normalizedUrl = normalizeImageUrl(artistData.pic_small);
      return normalizedUrl;
    }
  }
  
  try {
    // API Vagalume para buscar informações do artista
    const searchUrl = `${VAGALUME_BASE_URL}/search.artmus?q=${encodeURIComponent(artistName)}&limit=1`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'SpotifyTutor/1.0'
      }
    });
    
    if (!response.ok) {
      console.log(`❌ Erro na API Vagalume: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    // Verificar se encontrou resultados
    if (data.response && data.response.docs && data.response.docs.length > 0) {
      const artist = data.response.docs[0];
      
      // Tentar a API de imagens primeiro se temos ID
      if (artist.id) {
        const highQualityImage = await fetchArtistImagesFromVagalumeAPI(artist.id);
        if (highQualityImage) {
          return highQualityImage;
        }
      }
      
      // A API Vagalume pode retornar diferentes campos para imagem
      if (artist.pic_medium) {
        const normalizedUrl = normalizeImageUrl(artist.pic_medium);
        return normalizedUrl;
      }
      
      if (artist.pic_small) {
        const normalizedUrl = normalizeImageUrl(artist.pic_small);
        return normalizedUrl;
      }
      
      // Se o artista foi encontrado mas sem imagem, tentar buscar pelo ID
      if (artist.id) {
        return await fetchArtistDetailsFromVagalume(artist.id);
      }
    }
    
    return null;
    
  } catch (error) {
    console.log(`❌ Erro ao buscar ${artistName} no Vagalume:`, error);
    return null;
  }
}

// Buscar detalhes completos do artista pelo ID do Vagalume
async function fetchArtistDetailsFromVagalume(artistId) {
  try {
    const detailsUrl = `${VAGALUME_BASE_URL}/search.artmus?artID=${artistId}`;
    
    const response = await fetch(detailsUrl, {
      headers: {
        'User-Agent': 'SpotifyTutor/1.0'
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Função para normalizar URL de imagem
    function normalizeImageUrl(url) {
      if (!url) return null;
      if (url.startsWith('http')) return url;
      return `https://www.vagalume.com.br${url}`;
    }
    
    if (data.artist && data.artist.pic_medium) {
      const normalizedUrl = normalizeImageUrl(data.artist.pic_medium);
      return normalizedUrl;
    }
    
    if (data.artist && data.artist.pic_small) {
      const normalizedUrl = normalizeImageUrl(data.artist.pic_small);
      return normalizedUrl;
    }
    
    return null;
    
  } catch (error) {
    console.log('❌ Erro ao buscar detalhes no Vagalume:', error);
    return null;
  }
}

// Gera avatar personalizado para artistas brasileiros
function generateAvatarForBrazilianArtist(artistName) {
  if (!artistName) return null;
  
  // Gerar hash baseado no nome
  let hash = 0;
  for (let i = 0; i < artistName.length; i++) {
    hash = artistName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Cores inspiradas na bandeira brasileira e cultura
  const brazilianColors = [
    ['#00A859', '#FFD700'], // Verde e amarelo
    ['#1E4B99', '#FFD700'], // Azul e amarelo
    ['#FF6B35', '#FFD700'], // Laranja e amarelo
    ['#8B4513', '#F4A460'], // Marrom e bege (terra)
    ['#228B22', '#ADFF2F'], // Verde escuro e claro
    ['#4169E1', '#87CEEB'], // Azul real e céu
    ['#DC143C', '#FFA500'], // Vermelho e laranja
    ['#800080', '#DDA0DD']  // Roxo e lilás
  ];
  
  const colorIndex = Math.abs(hash) % brazilianColors.length;
  const [color1, color2] = brazilianColors[colorIndex];
  
  // Extrair iniciais
  const words = artistName.trim().split(/\s+/);
  let initials;
  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  }
  
  // Ícones musicais brasileiros
  const musicIcons = ['🎵', '🎶', '🎤', '🥁', '🎸', '🎺', '🎷', '🪗'];
  const iconIndex = Math.abs(hash) % musicIcons.length;
  const musicIcon = musicIcons[iconIndex];
  
  // Criar SVG com estilo brasileiro
  const svg = `
    <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brazilGrad${Math.abs(hash)}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow${Math.abs(hash)}">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- Círculo principal -->
      <circle cx="60" cy="60" r="55" fill="url(#brazilGrad${Math.abs(hash)})" 
              stroke="white" stroke-width="3" filter="url(#shadow${Math.abs(hash)})"/>
      
      <!-- Círculo interno decorativo -->
      <circle cx="60" cy="60" r="45" fill="none" stroke="white" 
              stroke-width="1" opacity="0.3" stroke-dasharray="5,5"/>
      
      <!-- Iniciais -->
      <text x="60" y="50" font-family="Arial, sans-serif" font-size="22" 
            font-weight="bold" text-anchor="middle" fill="white" dy="0.1em"
            style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">${initials}</text>
      
      <!-- Ícone musical -->
      <text x="60" y="75" font-family="Arial, sans-serif" font-size="16" 
            text-anchor="middle" dy="0.1em">${musicIcon}</text>
      
      <!-- Pequenos detalhes decorativos -->
      <circle cx="35" cy="35" r="2" fill="white" opacity="0.7"/>
      <circle cx="85" cy="35" r="2" fill="white" opacity="0.7"/>
      <circle cx="35" cy="85" r="2" fill="white" opacity="0.7"/>
      <circle cx="85" cy="85" r="2" fill="white" opacity="0.7"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}


// Função para mostrar erro da API
function showAPIError(message) {
  const errorElement = document.getElementById("api-error");
  errorElement.innerHTML = `
    <h4>⚠️ Erro ao carregar dados</h4>
    <p>${escapeHtml(message)}</p>
    <p>Tente novamente em alguns momentos. A API Vagalume pode estar temporariamente indisponível.</p>
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

// ===== PLAYER VAGALUME =====
async function showVagalumePlayer(artistName, artistId) {
  const playerContainer = document.getElementById('vagalume-player-container');
  const iframe = document.getElementById('vagalume-embedPlayer');
  
  try {
    // Buscar playlists do artista no Vagalume
    const artistSlug = artistName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Tentar diferentes URLs do player do Vagalume
    const playerUrls = [
      `https://www.vagalume.com.br/${artistSlug}/player.html`,
      `https://player.vagalume.com.br/embed/?artist=${encodeURIComponent(artistName)}`,
      `https://www.vagalume.com.br/player/embed/?search=${encodeURIComponent(artistName)}`
    ];
    
    // Usar a primeira URL como padrão (página do artista no Vagalume)
    const playerUrl = `https://www.vagalume.com.br/${artistSlug}/`;
    
    // Configurar iframe
    iframe.src = playerUrl;
    
    // Mostrar container do player
    playerContainer.style.display = 'block';
    
    // Scroll até o player
    playerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Atualizar descrição
    const description = playerContainer.querySelector('.player-description');
    description.textContent = `Explorando as músicas de ${artistName} no Vagalume:`;
    
  } catch (error) {
    console.log('❌ Erro ao carregar player:', error);
    
    // Fallback - abrir em nova aba
    const vagalumeUrl = `https://www.vagalume.com.br/browse/search.php?q=${encodeURIComponent(artistName)}`;
    window.open(vagalumeUrl, '_blank');
  }
}

// Função para fechar o player
function closeVagalumePlayer() {
  const playerContainer = document.getElementById('vagalume-player-container');
  const iframe = document.getElementById('vagalume-embedPlayer');
  
  playerContainer.style.display = 'none';
  iframe.src = '';
}

// ===== BUSCA ESPECÍFICA DE ARTISTA =====
async function searchSpecificArtist() {
  const input = document.getElementById('artistSearchInput');
  const artistName = input.value.trim();
  
  if (!artistName) {
    showInfoModal('Por favor, digite o nome de um artista para buscar.', 'Campo Vazio');
    input.focus();
    return;
  }
  
  // Elementos DOM
  const loadingElement = document.getElementById("api-loading");
  const resultsContainer = document.getElementById("api-results");
  const errorElement = document.getElementById("api-error");
  const searchBtn = document.querySelector('.btn-search');
  
  // Função para reset dos elementos
  function resetSearchState() {
    if (searchBtn) {
      searchBtn.disabled = false;
      searchBtn.textContent = "🎯 Buscar";
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
      searchBtn.textContent = "🔄 Buscando...";
    }
    
    // Buscar artista específico no Vagalume
    const artistData = await fetchSpecificArtistFromVagalume(artistName);
    
    if (artistData) {
      // Exibir resultado do artista encontrado
      displaySingleArtistResult(artistData);
      
      // Marcar exercício como completo
      appState.exercises[4].completed = true;
      saveProgress();
      
      // Limpar campo de busca
      input.value = '';
      
    } else {
      // Mostrar erro se artista não foi encontrado
      if (errorElement) {
        errorElement.innerHTML = `
          <div class="error-content">
            <h4>🔍 Artista não encontrado</h4>
            <p>O artista "${escapeHtml(artistName)}" não foi encontrado no Vagalume.</p>
            <p>Tente verificar a grafia ou buscar um artista brasileiro diferente.</p>
          </div>
        `;
        errorElement.style.display = "block";
      }
    }
    
  } catch (error) {
    console.log('❌ Erro na busca específica:', error);
    if (errorElement) {
      errorElement.innerHTML = `
        <div class="error-content">
          <h4>❌ Erro na busca</h4>
          <p>Ocorreu um erro ao buscar o artista. Verifique sua conexão e tente novamente.</p>
        </div>
      `;
      errorElement.style.display = "block";
    }
  } finally {
    resetSearchState();
  }
}

// Função para buscar artista específico no Vagalume
async function fetchSpecificArtistFromVagalume(artistName) {
  try {
    // Criar múltiplas variações do nome para busca
    const originalName = artistName.toLowerCase().trim();
    
    // Função para criar slug básico
    function createSlug(name) {
      return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais exceto números
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplos
        .replace(/^-|-$/g, ''); // Remove hífens do início e fim
    }
    
    // Criar variações do nome para busca
    const searchVariations = [
      createSlug(originalName), // CPM 22 → cpm-22
      originalName.replace(/\s+/g, '-'), // CPM 22 → cpm-22
      originalName.replace(/\s+/g, ''), // CPM 22 → cpm22
      originalName.replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''), // CPM 22 → cpm22
      originalName.replace(/\s+/g, '_'), // CPM 22 → cpm_22
      createSlug(originalName).replace(/(\d+)/g, '-$1'), // cpm-22 → cpm-22
      createSlug(originalName).replace(/-/g, ''), // cpm-22 → cpm22
      // Variações específicas para bandas com números
      originalName.toLowerCase().replace(/\s+/g, ''),
      originalName.toLowerCase().replace(/\s+/g, '-'),
      originalName.toLowerCase().replace(/[^a-z0-9]/g, '')
    ];
    
    // Remover duplicatas e vazios
    const uniqueVariations = [...new Set(searchVariations)].filter(v => v && v.length > 0);
    
    console.log(`🔍 Buscando: "${artistName}"`);
    console.log(`📋 Variações para testar:`, uniqueVariations);
    
    // Testar cada variação
    for (const variation of uniqueVariations) {
      const testUrl = `https://www.vagalume.com.br/${variation}/index.js`;
      console.log(`� Testando: ${variation} → ${testUrl}`);
      
      try {
        const response = await fetch(testUrl);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.artist) {
            console.log(`✅ ENCONTRADO! Variação "${variation}" funcionou`);
            
            // Construir URLs completas para as imagens
            let picMedium = null;
            let picSmall = null;
            
            if (data.artist.pic_medium) {
              picMedium = data.artist.pic_medium.startsWith('http') 
                ? data.artist.pic_medium 
                : `https://www.vagalume.com.br${data.artist.pic_medium}`;
            }
            
            if (data.artist.pic_small) {
              picSmall = data.artist.pic_small.startsWith('http') 
                ? data.artist.pic_small 
                : `https://www.vagalume.com.br${data.artist.pic_small}`;
            }
            
            // Formatar dados do artista
            const artist = {
              id: data.artist.id,
              name: data.artist.name || artistName,
              url: `https://www.vagalume.com.br/${variation}/`,
              pic_small: picSmall,
              pic_medium: picMedium,
              // Tratar gênero corretamente
              genre: (() => {
                if (data.artist.genre) {
                  if (Array.isArray(data.artist.genre)) {
                    return data.artist.genre.map(g => typeof g === 'object' ? g.name : g).join(', ');
                  } else if (typeof data.artist.genre === 'object') {
                    return data.artist.genre.name || 'Rock/Pop Brasileiro';
                  } else {
                    return data.artist.genre;
                  }
                }
                return 'Rock/Pop Brasileiro';
              })(),
              type: 'Banda',
              score: data.artist.views || 'N/A',
              views: data.artist.views,
              rank_position: data.artist.rank ? data.artist.rank.pos : null
            };
            
            console.log(`🎵 Dados do artista:`, artist);
            return artist;
          }
        } else {
          console.log(`❌ ${variation}: ${response.status}`);
        }
      } catch (varError) {
        console.log(`❌ Erro em ${variation}:`, varError.message);
        continue;
      }
    }
    
    console.log(`💔 Nenhuma variação funcionou para: "${artistName}"`);
    return null;
    
  } catch (error) {
    console.log(`❌ Erro geral ao buscar "${artistName}":`, error);
    return null;
  }
}

// Função para exibir resultado de artista único
function displaySingleArtistResult(artist) {
  const resultsContainer = document.getElementById("api-results");
  
  // Criar header para resultado único
  const header = `
    <div class="api-results-header">
      <h4>🎯 Resultado da Busca</h4>
      <p>Artista encontrado: <strong>${escapeHtml(artist.name)}</strong></p>
    </div>
  `;
  
  // Criar card do artista
  const artistCard = createArtistCard(artist, 0);
  
  // Limpar e inserir conteúdo
  resultsContainer.innerHTML = header;
  resultsContainer.appendChild(artistCard);
  
  // Mostrar container de resultados
  resultsContainer.style.display = "block";
  
  // Buscar e atualizar imagem do artista
  fetchArtistImageFromVagalume(artist.name, artist).then(imageUrl => {
    const imgElement = artistCard.querySelector('.artist-img');
    if (imageUrl && imgElement) {
      const testImg = new Image();
      testImg.onload = function() {
        imgElement.src = imageUrl;
      };
      testImg.src = imageUrl;
    }
  });
  
  // Scroll até os resultados
  resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Função para lidar com Enter no campo de busca
function handleSearchKeyPress(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchSpecificArtist();
  }
}

// Adicionar função global para ser acessível pelo HTML
window.searchSpecificArtist = searchSpecificArtist;
window.handleSearchKeyPress = handleSearchKeyPress;
