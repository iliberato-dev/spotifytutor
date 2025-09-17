# 🎵 SpotifyTutor - Curso Autoinstrucional

Uma aplicação web moderna e responsiva que ensina jovens como criar playlists temáticas no Spotify de forma envolvente e interativa.

## 🚀 Demonstração

- **URL da Aplicação:** [Em breve - será publicado no Vercel/Netlify]
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
- **JavaScript (ES6+):** Lógica de aplicação, manipulação do DOM e persistência de dados

### Ferramentas e Padrões

- **Google Fonts (Inter):** Tipografia moderna e legível
- **SVG:** Imagens vetoriais otimizadas para web
- **LocalStorage:** Persistência de dados do usuário
- **CSS Custom Properties:** Sistema de design consistente
- **Semantic HTML:** Melhor acessibilidade e SEO

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
- [x] Preparação para API externa

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

- [ ] Integração com API do Spotify para dados reais
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
