# SwingRush — handoff da Home

Este documento reúne o contexto necessário para continuar o desenvolvimento da Home sem reabrir decisões já aprovadas.

## Fonte visual

- Figma: [Hackaton — Home](https://www.figma.com/design/98BC7yEVdl4GKwe66XBvv1/Hackaton?node-id=1712-6043&t=wsCuyt6ruXQjuOSA-1)
- Footer desktop: nó `1751:6087`.
- Frame desktop de referência: `1712:6043`.
- A referência pixel-perfect do desktop é o frame de 1680 px.
- Não existe referência específica de tablet no Figma; tablet é uma interpolação fluida entre mobile e desktop.

## Decisões aprovadas

### Breakpoints

- Mobile aprovado e bloqueado: abaixo de 768 px.
- Tablet: 768–1279 px.
- Desktop: a partir de 1280 px.
- Qualquer alteração abaixo de 768 px exige aprovação explícita do cliente.
- Mudanças responsivas devem ser aditivas, usando variantes tablet/desktop sem alterar a base mobile.

### Mobile

O mobile da Home já foi aprovado pelo cliente. Não alterar estilos-base, estrutura DOM, conteúdo, navbar, drawer, espaçamentos, vídeo ou comportamento sem nova autorização.

### Navbar

- Mobile e tablet usam menu hambúrguer e drawer.
- Desktop usa links horizontais, menu desktop e botão visual “Sign Up”.
- O drawer deve continuar acessível por clique, teclado e Escape.

### Hero

- Altura: `100svh`.
- Vídeo local WebM/MP4 continua sendo usado em mobile, tablet e desktop.
- Poster substitui o vídeo com `prefers-reduced-motion`.
- Conteúdo centralizado vertical e horizontalmente.
- O título desktop e o CTA permanecem visuais; o botão “Sign Up” da Home não possui fluxo de inscrição nesta fase.

### Challenges

O escopo atual é a seção preta com quatro histórias: Big Breaker, Ellie Snyder, Skill Divisions e equipe.

- Tablet inteiro usa composição vertical: mídia centralizada, copy abaixo e alinhado à esquerda.
- A grade alternada só começa em `1280px`.
- Mídia tablet usa proporções naturais e `object-contain` para evitar cortes laterais.
- O painel “Skill Divisions” não usa wrapper com altura artificial; sua altura acompanha o conteúdo real.
- O painel escala slots e glifos fluidamente entre 768 e 1279 px e retorna às medidas do desktop em 1280 px.
- “Learn More” continua sendo um accordion exclusivo, acessível por teclado e com suporte a movimento reduzido.

### Arena, CTA e Footer

- Arena e CTA mantêm conteúdo, cores e contratos atuais.
- CTA final da Home não recebe `ctaHref`; o botão é visual e não navega.
- Footer possui variantes mobile, tablet e desktop; não reabrir essa composição durante o trabalho de Challenges.
- O Footer desktop usa 739 px de altura, gutter de 62 px, navegação de 505 px em duas colunas iguais com gap de 40 px e Forma DJR Mono em 22 px/1.3/3%.
- Os ícones sociais desktop usam os vetores exportados do Figma; mobile e tablet preservam os ícones e a composição aprovados.

## Arquitetura e limites técnicos

- Não alterar props públicas, schemas ou contratos CMS para esta etapa.
- Sanity permanece limitado a `locations` e `studio`.
- Não adicionar Sanity live/visual editing globalmente em `app/layout.tsx`.
- O sistema usa Tailwind com tokens fluidos para gutters, tipografia e espaçamento.
- A integração de conteúdo da Home continua vindo dos dados existentes em `data/home.ts`.
- Evitar `100vw`, `w-screen` e margens negativas para full-bleed; a Home já usa largura integral estrutural e proteção contra overflow horizontal.

## Estado atual

O commit que contém a implementação principal da Home é:

```text
d87a957 feat: refine responsive home layout
```

Esse commit contém a implementação da Home desktop/tablet, a preservação do mobile, a correção de overflow, vídeo da Hero, CTA final e refinamento da seção Challenges.

Arquivos centrais para continuar:

- `components/sections/challenges.tsx`
- `components/ui/split-flap-board.tsx`
- `components/sections/hero.tsx`
- `components/sections/nav.tsx`
- `components/sections/arena.tsx`
- `components/sections/cta.tsx`
- `components/sections/footer.tsx`
- `app/(site)/page.tsx`
- `app/globals.css`
- `tailwind.config.ts`
- `AGENTS.md`

## Validação obrigatória

Antes de considerar uma alteração pronta:

- Comparar visualmente desktop em 1280, 1440 e 1680 px com o Figma.
- Testar tablet em 768, 834, 900, 1024, 1180 e 1279 px, incluindo portrait e landscape.
- Regressão mobile em 375 e 480 px.
- Confirmar `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
- Verificar ausência de crop indevido, overflow horizontal e espaços artificiais.
- Testar drawer, Escape, foco visível, ordem de tabulação e áreas de toque.
- Testar vídeo, fallback MP4 e poster com `prefers-reduced-motion`.
- Executar:

```bash
npm run lint
npm run build
git diff --check
```

O build atual passa. Existe apenas um aviso não bloqueante do Node sobre `tailwind.config.ts` não declarar `type: module`.

## Próximos passos

1. Obter aprovação explícita da Home completa.
2. Só depois iniciar a próxima página e repetir o ciclo seção por seção.
3. Para uma nova página, pedir o frame/nó Figma correspondente antes de alterar componentes compartilhados.
4. Preservar o mobile aprovado até que o cliente autorize uma revisão específica.

## Instrução para a próxima LLM

Leia este documento, `AGENTS.md`, o último commit e o estado atual do Git antes de editar. Não reinicie a implementação da Home nem substitua o mobile por uma nova abordagem. Primeiro reproduza o problema em um breakpoint específico, depois altere somente a variante responsável e valide os dois extremos aprovados: mobile abaixo de 768 px e desktop a partir de 1280 px.
