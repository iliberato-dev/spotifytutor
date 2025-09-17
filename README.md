# 🎵 SpotifyTutor - Curso Autoinstrucional

Uma aplicação web moderna e responsiva que ensina jovens como criar playlists temáticas no Spotify de forma envolvente e interativa.

<div align="center">
  <img src="./assets/images/Captura de tela claro.png" alt="Interface do SpotifyTutor no modo claro, mostrando tela de criação de playlist do Spotify." width="45%" />
  <img src="./assets/images/Captura de tela escuro.png" alt="Interface do SpotifyTutor no modo escuro, mostrando tela de criação de playlist do Spotify." width="45%" />
</div>

## 🚀 Demonstração

- **URL da Aplicação:** [https://spotifytutor.vercel.app](https://spotifytutor.vercel.app/)
- **Repositório:** [https://github.com/iliberato-dev/spotifytutor](https://github.com/iliberato-dev/spotifytutor)

## 📋 Sobre o Projeto

O SpotifyTutor é um curso autoinstrucional desenvolvido para jovens entre 16 e 24 anos, focado no tema "Como criar uma playlist temática no Spotify". A aplicação combina conteúdo educativo com exercícios interativos, oferecendo uma experiência de aprendizado completa e moderna.

### 🎯 Objetivos

- Ensinar os fundamentos da criação de playlists temáticas
- Proporcionar uma experiência de aprendizado interativa
- Demonstrar conhecimentos técnicos em desenvolvimento front-end
- Aplicar boas práticas de UX/UI e acessibilidade

## 🛠 Tecnologias Utilizadas

### Core Technologies

- **HTML5:** Estruturação semântica com tags apropriadas (`<main>`, `<section>`, `<nav>`, `<article>`)
- **CSS3:** Estilização avançada com CSS Grid, Flexbox e variáveis CSS
- **JavaScript (ES6+):** Lógica de aplicação, manipulação do DOM, requisições assíncronas e persistência de dados

### APIs e Integrações

- **Vagalume API:** Integração para busca de artistas brasileiros
- **Fetch API:** Requisições HTTP assíncronas
- **LocalStorage:** Persistência de dados do usuário e cache de API

### Ferramentas e Padrões

- **Google Fonts (Inter):** Tipografia moderna e legível
- **SVG:** Imagens vetoriais otimizadas para web
- **CSS Custom Properties:** Sistema de design consistente
- **Semantic HTML:** Melhor acessibilidade e SEO
- **Progressive Enhancement:** Funcionalidade básica sem dependências externas

### Ferramentas de Design e Otimização

- **IA Generativa:** Criação de logo e elementos visuais
- **Squoosh (Google):** Otimização e compressão de imagens para web
- **GitHub Copilot:** Assistência inteligente na escrita de código

## 🎨 Design System

### Paleta de Cores (Conforme Especificação)

- **Primária:** `#1E3A8A` (Azul Marinho)
- **Destaque:** `#34D399` (Verde Esmeralda)
- **Texto Secundário:** `#D1D5DB` (Cinza Claro)

### Princípios de Design

- **Minimalismo:** Interface limpa e focada no conteúdo
- **Alta Legibilidade:** Contraste adequado e tipografia otimizada
- **Responsividade:** Adaptação fluida para todos os dispositivos
- **Acessibilidade:** Navegação por teclado e elementos semânticos

## 💻 Processo Criativo

### 1. Análise do Briefing

Comecei analisando detalhadamente os requisitos técnicos e de design, identificando os principais desafios:

- Criar uma experiência envolvente para o público jovem
- Implementar sistema de exercícios com feedback inteligente
- Garantir responsividade total
- Aplicar a paleta de cores de forma harmoniosa

### 2. Arquitetura da Informação

Estruturei a aplicação em quatro seções principais:

- **Introdução:** Apresentação do curso e motivação
- **Lições:** Conteúdo educativo dividido em cards temáticos
- **Exercícios:** Três tipos de questões com sistema de tentativas
- **Resultados:** Feedback personalizado baseado no desempenho

### 3. Experiência do Usuário (UX)

Pensei na jornada do usuário como uma progressão natural:

1. **Despertar Interesse:** Hero section chamativa com linguagem jovem
2. **Educação:** Lições estruturadas e de fácil digestão
3. **Prática:** Exercícios interativos que consolidam o aprendizado
4. **Recompensa:** Sistema de pontuação e feedback motivacional

### 4. Interface do Usuário (UI)

- **Layout Grid Responsivo:** Adaptação natural a diferentes telas
- **Micro-interações:** Hover effects e transições suaves
- **Feedback Visual:** Estados claros para cada ação do usuário
- **Tema Duplo:** Modo claro/escuro para preferência pessoal

## 🔧 Decisões Técnicas

### Arquitetura

Optei por uma **Single Page Application (SPA)** com navegação via JavaScript para:

- Melhor performance (sem recarregamento de página)
- Controle total sobre transições e estados
- Experiência mais fluida e moderna
- Facilidade de implementação do sistema de progresso

### Sistema de Estado

Implementei um **gerenciamento de estado centralizado** em JavaScript:

```javascript
const appState = {
  currentSection: "intro",
  theme: "light",
  exercises: {
    /* dados dos exercícios */
  },
  score: 0,
};
```

### Persistência de Dados

Utilizei **LocalStorage** para salvar:

- Progresso dos exercícios
- Tentativas restantes
- Tema preferido do usuário
- Pontuação atual

### CSS Modular

Organizei o CSS com:

- **Variáveis CSS** para consistência do design system
- **Mobile-first approach** na responsividade
- **BEM methodology** na nomenclatura de classes
- **Performance otimizada** com seletores eficientes

### JavaScript Funcional

Adotei padrões modernos:

- **ES6+ features** (const/let, arrow functions, template literals)
- **Event delegation** para melhor performance
- **Async/await** preparado para futuras integrações com APIs
- **Modularização** de funções para reusabilidade

## 🤖 Uso de Inteligência Artificial

### GitHub Copilot

**Utilização:** Auxílio na escrita de código e documentação
**Prompts Utilizados:**

- "Criar função para validação de exercícios de múltipla escolha"
- "Implementar sistema de temas claro/escuro com localStorage"
- "Gerar CSS responsivo para grid de cards"

**Justificativa:** O Copilot acelerou o desenvolvimento em tarefas repetitivas e sugeriu boas práticas que talvez não tivesse considerado inicialmente.

### ChatGPT/Claude (Conceitual)

**Utilização:** Ideação de conteúdo e estruturação pedagógica
**Prompts Utilizados:**

- "Quais são as melhores práticas de UX para aplicações educativas?"
- "Sugestões de exercícios interativos sobre curadoria musical"

**Justificativa:** A IA ajudou a organizar o conteúdo de forma didática e sugerir exercícios relevantes ao tema.

### Criação de Assets Visuais

**Utilização:** Geração de logo e elementos visuais
**Ferramentas IA utilizadas:**

- **Logo SpotifyTutor:** Criada com IA generativa para manter identidade visual moderna
- **Ícones e elementos gráficos:** Refinados com prompts específicos para design jovem

**Justificativa:** A IA permitiu criar elementos visuais profissionais alinhados com a identidade do projeto, mesmo sem recursos de design especializado.

## 🔧 Ferramentas de Otimização

### Squoosh (Google)

**Utilização:** Otimização de imagens para web
**URL:** [https://squoosh.app/](https://squoosh.app/)

**Processo aplicado:**

- **Compressão inteligente** de imagens PNG/JPG
- **Conversão para formatos modernos** quando apropriado
- **Redução de tamanho** mantendo qualidade visual
- **Otimização para diferentes resoluções** (1x, 2x, 3x)

**Resultados obtidos:**

- **Redução significativa** no tamanho dos arquivos
- **Melhoria na performance** de carregamento
- **Manutenção da qualidade visual** em todas as resoluções
- **Compatibilidade** com navegadores modernos

## 🎯 Desafios e Soluções

### 1. Sistema de Exercícios Complexo

**Desafio:** Criar lógica para três tipos diferentes de exercícios (escolha única, múltipla escolha, combobox) com sistema de tentativas e feedback personalizado.

**Solução:** Implementei uma função genérica `checkAnswer()` que recebe parâmetros dinâmicos (tipo de exercício, resposta correta, ID) e adapta a validação conforme necessário.

### 2. Persistência de Estado

**Desafio:** Manter o progresso do usuário mesmo após recarregar a página.

**Solução:** Utilizei LocalStorage para salvar o estado dos exercícios e implementei uma função `loadProgress()` que restaura tanto os dados quanto o estado visual da interface.

### 3. Responsividade Complexa

**Desafio:** Garantir que elementos complexos (como os cards de exercícios) se adaptem bem a diferentes telas.

**Solução:** Implementei um sistema de breakpoints bem definido e testei em múltiplos dispositivos, usando CSS Grid e Flexbox de forma combinada.

### 4. Experiência Jovem vs. Profissionalismo

**Desafio:** Equilibrar uma linguagem descontraída para jovens mantendo a qualidade técnica.

**Solução:** Criei uma identidade visual moderna com emojis e linguagem informal, mas mantive a estrutura técnica sólida por baixo.

### 5. Performance de Imagens

**Desafio:** Criar imagens otimizadas sem recursos de design avançados.

**Solução:** Desenvolvi uma ilustração em SVG que é vetorial (escala infinita) e tem tamanho mínimo, representando visualmente a interface do Spotify.

## 📱 Funcionalidades Implementadas

### ✅ Requisitos Obrigatórios

- [x] HTML semântico com tags apropriadas
- [x] Layout totalmente responsivo
- [x] Múltiplas seções com navegação
- [x] Três tipos de exercícios funcionais
- [x] Sistema de tentativas (máximo 3)
- [x] Feedback visual após cada tentativa
- [x] Persistência de dados no navegador
- [x] Paleta de cores especificada
- [x] Imagem otimizada para web
- [x] Nomenclatura consistente de arquivos

### ✅ Funcionalidades Opcionais

- [x] Modo claro/escuro
- [x] Sistema de pontuação
- [x] Cálculo de porcentagem de acertos
- [x] Feedback personalizado por desempenho
- [x] Barra de progresso visual
- [x] Animações e micro-interações
- [x] **Integração com API Vagalume**

### 🌐 Integração com API Externa

**Exercício 4: Explorando Artistas Brasileiros**

A aplicação implementa integração com a API Vagalume para demonstrar requisições assíncronas e manipulação de dados dinâmicos:

- **API Utilizada:** [Vagalume](https://api.vagalume.com.br/)
- **Endpoints:** 
  - `/search.php?art={artist_name}` - Busca de artistas
  - `/image.php?bandID={artist_id}` - Busca de imagens
- **Funcionalidades:**
  - Busca artistas brasileiros em tempo real
  - Busca de fotos de artistas brasileiros com fallback para avatares SVG
  - Loading states profissionais
  - Tratamento de erros robusto
  - Cards interativos com informações detalhadas
  - Links para perfis oficiais no Vagalume
  - Rate limiting respeitoso
  - Sistema de fallback com avatars temáticos

**Características Técnicas:**

```javascript
// Exemplo de implementação
async function fetchArtistImagesFromVagalumeAPI(artists) {
  const baseUrl = 'https://api.vagalume.com.br';
  
  for (const artist of artists) {
    try {
      // Buscar informações do artista
      const searchResponse = await fetch(
        `${baseUrl}/search.php?art=${encodeURIComponent(artist.slug)}`
      );
      const searchData = await searchResponse.json();
      
      if (searchData.art?.id) {
        // Buscar imagem do artista
        const imageResponse = await fetch(
          `${baseUrl}/image.php?bandID=${searchData.art.id}`
        );
        const imageData = await imageResponse.json();
        
        artist.image = imageData.image || generateBrazilianAvatar(artist.name);
      }
    } catch (error) {
      console.log(`Erro ao buscar ${artist.name}:`, error);
      artist.image = generateBrazilianAvatar(artist.name);
    }
  }
}
```

**Benefícios Educativos:**

- Demonstra consumo de APIs REST brasileiras
- Exemplo de programação assíncrona com async/await
- Tratamento adequado de estados de carregamento e erro
- Sistema de fallback robusto para UX consistente
- Manipulação de dados JSON e criação dinâmica de elementos DOM
- Integração com base de dados musical brasileira
- Boas práticas de rate limiting e tratamento de erros

## 📂 Estrutura do Projeto

```
spotify-tutor/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos principais
│   ├── js/
│   │   └── app.js          # Lógica da aplicação
│   └── images/
│       └── spotify-hero.svg # Imagem otimizada
├── README.md               # Documentação
└── .gitignore             # Arquivos ignorados pelo Git
```

## 🚀 Como Executar

1. **Clone o repositório:**

```bash
git clone https://github.com/iliberato-dev/spotifytutor.git
cd spotifytutor
```

2. **Abra a aplicação:**

- Opção 1: Abrir `index.html` diretamente no navegador
- Opção 2: Usar um servidor local (recomendado):

```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server
```

3. **Acesse:** `http://localhost:8000`

## 🎓 Aprendizados

Este projeto me permitiu:

- Aprofundar conhecimentos em **CSS Grid e Flexbox**
- Praticar **gerenciamento de estado** em JavaScript vanilla
- Implementar **persistência de dados** com LocalStorage
- Desenvolver uma **experiência de usuário** coesa e envolvente
- Aplicar **princípios de acessibilidade** web
- Trabalhar com **design responsivo** avançado
- Integrar **IA** de forma produtiva no desenvolvimento

## 🎨 Próximos Passos

Para futuras iterações, planejo:

- [ ] Sistema de autenticação de usuário
- [ ] Exercícios adaptativos baseados no desempenho
- [ ] Compartilhamento de resultados nas redes sociais
- [ ] Modo offline com Service Workers
- [ ] Testes automatizados

## 📝 Licença

Este projeto foi desenvolvido como parte de um teste técnico para o SENAI e é de uso educacional.

---

**Desenvolvido com 💚 por [Isaque Liberato]**  
_Desafio Front-End SENAI - 2025_
