# RockySoulUp - Frontend React

Plataforma gamificada de sustentabilidade que transforma ações sustentáveis em pontos, níveis, selos e recompensas reais. Desenvolvida com **React + Vite + TypeScript + TailwindCSS** como aplicação SPA (Single Page Application).

## Descrição

A RockySoulUp incentiva hábitos sustentáveis por meio da gamificação: o usuário registra ações do dia a dia (reciclar, usar transporte público, economizar energia/água, andar de bicicleta, plantar árvores), envia uma foto como comprovação, acumula pontos, evolui de nível (Semente → Broto → Árvore → Expert), desbloqueia selos, aparece no ranking global e troca pontos por recompensas reais.

## Tecnologias Utilizadas

- **React 19** - Interface e componentização
- **Vite** - Build e performance
- **TypeScript** - Tipagem estática obrigatória
- **TailwindCSS** - Estilização utilitária de toda a interface
- **React Router DOM** - Navegação SPA com rotas estáticas e dinâmicas
- **React Hook Form** - Validação de formulários com TypeScript

## Páginas e Rotas

| Rota | Página | Tipo |
| --- | --- | --- |
| `/` | Home | Estática |
| `/dashboard` | Dashboard | Estática |
| `/solucao` | Solução do Projeto | Estática |
| `/recompensas` | Recompensas | Estática |
| `/recompensas/:id` | Detalhe da Recompensa | **Dinâmica (useParams)** |
| `/sobre` | Sobre | Estática |
| `/faq` | FAQ | Estática |
| `/integrantes` | Equipe | Estática |
| `/contato` | Contato | Estática |

## Estrutura de Pastas

```
rockysoul-react/
├── public/
│   ├── icons/          # Icones SVG da aplicacao
│   └── imagens/        # Imagens do site (logo, ilha, integrantes)
├── src/
│   ├── components/     # Componentes reutilizaveis (Header, Footer, modais, Chat, Toast)
│   │   ├── Header.tsx          # Navegacao principal
│   │   ├── Footer.tsx          # Rodape do site
│   │   ├── Chat.tsx            # Assistente virtual
│   │   ├── Toast.tsx           # Sistema de notificacoes
│   │   ├── LoginModal.tsx      # Cadastro com React Hook Form
│   │   ├── VerificarModal.tsx  # Verificacao de acao por foto/GPS
│   │   └── ResgatarModal.tsx   # Confirmacao de resgate
│   ├── pages/          # Paginas da aplicacao (componentes React)
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Solucao.tsx
│   │   ├── Recompensas.tsx
│   │   ├── RecompensaDetalhe.tsx  # Rota dinamica com useParams
│   │   ├── Sobre.tsx
│   │   ├── Faq.tsx
│   │   ├── Integrantes.tsx
│   │   └── Contato.tsx
│   ├── context/        # Estado global (DataContext, ChatContext)
│   ├── hooks/          # Hooks personalizados (useLocalStorage)
│   ├── data/           # Dados e constantes (missoes, selos, niveis, recompensas)
│   ├── types/          # Interfaces TypeScript
│   ├── App.tsx         # Rotas e layout principal
│   ├── main.tsx        # Ponto de entrada
│   └── index.css       # Tailwind + animacoes globais
└── ...
```

## Como Executar

```bash
# Instale as dependencias
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Gere a build de producao
npm run build

# Rode o linter
npm run lint
```

## Responsividade

- **Mobile** - ate 480px
- **Tablet** - 768px
- **Desktop** - 992px+

## Imagens e Ícones do Projeto

O projeto utiliza icons SVG proprietarios em `/public/icons` (reciclagem, transporte, energia, agua, bicicleta, arvore, banho, semente, broto, trofeu, folha, check e mais) e imagens em `/public/imagens` (logo da RockySoulUp, ilha flutuante da Home e fotos dos integrantes).

## Dados Persistidos

Todas as informacoes do usuario sao salvas no `localStorage`, via hook `useLocalStorage`:
- Pontos totais e diarios
- Missoes completadas
- Historico de acoes
- Selos desbloqueados
- Resgates realizados
- Dados do usuario (nome/email)

## Repositório

- **GitHub:** https://github.com/igorodriguesd/rockysoul-react
- **Vídeo de apresentação (YouTube):** _link a definir_

## Integrantes

| Nome | RM | Turma | GitHub | LinkedIn |
| --- | --- | --- | --- | --- |
| Igor Rodrigues de Santana | RM570651 | 1TDSPK | [igorodriguesd](https://github.com/igorodriguesd) | [LinkedIn](https://linkedin.com/in/igor-rodrigues-135aa72b2) |
| Diego Gomes Goncalves de Lima | RM570335 | 1TDSPK | [dgxls](https://github.com/dgxls) | [LinkedIn](https://www.linkedin.com/in/diego-gomes-65339b408/) |
| Miguel Silva | RM572019 | 1TDSPK | [miguelsilva71](https://github.com/miguelsilva71) | [LinkedIn](https://www.linkedin.com/in/miguel-silva-0a20073a9/) |
| Rafael Santos Mendonca Costa | RM572368 | 1TDSPK | [RafaelSantos56](https://github.com/RafaelSantos56) | [LinkedIn](https://www.linkedin.com/in/rafael-santos-b09bba237/) |

**Turma 1TDSPK - FIAP 2026**