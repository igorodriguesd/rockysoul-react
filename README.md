# RockySoulUp - Frontend React

Plataforma gamificada de sustentabilidade desenvolvida com React, Vite, TypeScript e TailwindCSS. O projeto transforma acoes sustentaveis em pontos, niveis, selos e recompensas reais.

## Funcionalidades

- **Home** - Hero com video, cards "Como Funciona", grid de 7 acoes sustentaveis com contadores animados
- **Dashboard** - Stats, registro de missoes, barra de progresso com niveis, selos desbloqueaveis, graficos canvas, ranking, 8 recompensas com filtros por categoria
- **Verificar** - Selecao de acao com cards, upload de foto com preview, captura de GPS, pontuacao
- **Chatbot** - Assistente virtual com 17 categorias de intencao, state machine, registro de acoes e resgate de recompensas por conversa
- **Sobre** - Descricao do projeto, features, stack tecnologica
- **FAQ** - Accordion animado com 6 perguntas frequentes
- **Integrantes** - Equipe com fotos, RMs e links GitHub/LinkedIn
- **Contato** - Formulario com React Hook Form e validacao TypeScript

## Tecnologias

- **React** - Interface e componentizacao
- **Vite** - Build e performance
- **TypeScript** - Tipagem estatica
- **TailwindCSS** - Estilizacao utilitaria
- **React Router DOM** - Navegacao SPA
- **React Hook Form** - Validacao de formularios

## Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizaveis
│   ├── Sidebar.tsx    # Navegacao lateral fixa
│   ├── Footer.tsx     # Rodape do site
│   ├── Chat.tsx       # Chatbot completo com NLP
│   ├── Toast.tsx      # Sistema de notificacoes
│   ├── LoginModal.tsx # Modal de cadastro
│   └── HistoryChart.tsx # Grafico canvas
├── pages/             # Paginas da aplicacao
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Verificar.tsx
│   ├── Sobre.tsx
│   ├── Faq.tsx
│   ├── Integrantes.tsx
│   └── Contato.tsx
├── context/
│   └── DataContext.tsx # Gerenciamento de estado centralizado
├── hooks/
│   ├── useLocalStorage.ts  # Persistencia no localStorage
│   └── useAnimations.ts    # Scroll-reveal e counter
├── types/
│   └── index.ts        # Interfaces TypeScript
├── data/
│   └── constants.ts    # Missoes, selos, niveis, recompensas
├── App.tsx             # Rotas e layout principal
├── main.tsx            # Ponto de entrada
└── index.css           # Tailwind + animacoes
```

## Como Executar

```bash
# Instale as dependencias
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Gere a build de producao
npm run build
```

## Responsividade

- **Mobile** - ate 480px
- **Tablet** - 768px
- **Desktop** - 992px+

## Dados Persistidos

Todas as informacoes do usuario sao salvas no `localStorage`:
- Pontos totais e diarios
- Missoes completadas
- Historico de acoes
- Selos desbloqueados
- Resgates realizados
- Dados do usuario (nome/email)

## Integrantes

- Igor Rodrigues de Santana (RM570651)
- Diego Gomes Goncalves de Lima (RM570335)
- Miguel Silva (RM572019)
- Rafael Santos Mendonca Costa (RM572368)

**Turma 1TDSPG - FIAP 2026**
