# RockySoulUp — Frontend React

Interface para registrar ações sustentáveis com evidências, acompanhar sua
revisão e consultar pontos, histórico, cartas, fragmentos, selos e recompensas.
O frontend consome a API Java RockySoulup em **http://localhost:8080**.

**React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 7**

## Executar localmente

Com Node.js e npm instalados, execute na raiz do projeto:

```shell
npm install
npm run dev
```

Abra **http://127.0.0.1:5173** ou **http://localhost:5173**. A porta 5173 é fixa;
uma execução existente precisa ser encerrada antes de iniciar outra nessa porta.
A API Java deve ser iniciada separadamente, com banco e migrações configurados.

O endereço da API já tem default local. Para substituí-lo, use um arquivo `.env`
local, baseado em `.env.example`, e reinicie o Vite:

```properties
VITE_API_BASE_URL=http://localhost:8080
```

Variáveis VITE_ são públicas e entram no bundle do navegador. Nunca inclua nelas
senha Oracle, JWT_SECRET, chave Gemini ou qualquer outro segredo.
O CORS do backend deve permitir a origem exata do frontend e os cabeçalhos
Authorization, Content-Type e Idempotency-Key, expondo Retry-After.

## Criar conta e entrar

1. Clique em **Criar conta**, no cabeçalho ou no aviso de acesso da página.
2. Informe nome, email, senha e confirmação da senha.
3. Clique em **Cadastrar**. A criação usa POST `/auth/cadastro`, sem exigir token.
4. Após a confirmação, a tela muda para **Entrar** com o email preenchido.
5. Digite a senha e clique em **Entrar na conta**. O login usa POST `/auth/login`
   e o frontend envia o token automaticamente nas chamadas protegidas.

Senha: 12–72 caracteres e até 72 bytes UTF-8. Nome: até 100 caracteres; email:
até 150. A confirmação é validada localmente e não é enviada ao backend. Perfis,
pontos e saldo não são aceitos pelo formulário: a API define a nova conta USER
com saldo inicial zero. Cadastro não autentica automaticamente.

Os campos de senha são limpos após cada tentativa; nenhuma senha é guardada em
localStorage/sessionStorage. O token fica somente em memória: atualizar a página
ou expirar a sessão exige entrar novamente. O acesso avançado por token continua
opcional para diagnóstico e não é necessário no fluxo normal.

Login externo OAuth/OIDC fica para uma próxima etapa. Hoje o cadastro e login
utilizam a própria API Java, sem substituir suas regras de segurança.

## Funcionalidades integradas

| Tela | O que permite fazer |
|---|---|
| Home | Acesso à jornada, perfil/saldo da conta e navegação |
| Dashboard | Consultar ações, enviar JPEG/PNG para análise, acompanhar verificações e histórico |
| Evidência privada | Visualizar a imagem com autenticação e excluí-la quando permitido |
| Coleção | Consultar catálogo, cartas atribuídas e fragmentos com paginação |
| Recompensas | Consultar catálogo, estoque, detalhes e selos |
| Perfil | Consultar/editar nome e email com controle de versão |
| Administração | Administrar ações, cartas, selos, recompensas, histórico e associações |
| Usuários — ADMIN | Consultar, editar perfil, ajustar saldo e desativar contas |
| Revisão — ADMIN | Aprovar/rejeitar com justificativa ou reprocessar com confirmação de cobrança |
| Consumo — ADMIN | Consultar reservas/limites e suspender/retomar novas análises |

O backend determina permissões e propriedade dos registros. A área ADMIN só
é habilitada após uma operação administrativa confirmar acesso no servidor.
Alterar o perfil revoga a sessão atual e exige conectar um novo token.

## Ações, análise e pontos

Escolha uma ação do catálogo e envie uma imagem JPEG/PNG de até 512 KiB e
32–2048 pixels por lado, junto de uma descrição de até 1000 caracteres.
O frontend envia somente ação, descrição e imagem; não escolhe pontos, modelo,
aprovação ou identidade do titular.

As verificações passam por estados como EM_ANALISE, PENDENTE_REVISAO, APROVADA
e REJEITADA. **202 e parecer favorável da IA não concedem pontos.** A revisão
administrativa é necessária e o saldo exibido sempre vem do backend.

O envio tem chave de idempotência por operação. Se a rede falhar, o modal conserva
o mesmo corpo e a mesma chave para uma repetição explícita, enquanto permanecer
aberto. Não há retry automático nem alteração otimista de saldo. Consulte as
verificações antes de iniciar outro envio se fechar a aba ou o modal.

A integração de IA precisa estar habilitada e configurada no backend. O frontend
não ativa AI_ENABLED e não contém credenciais dos provedores.

## Recursos do protótipo que dependem de novas operações de backend

Resgates, Pix, bônus diário, ranking global, sorteio de cartas, variantes
brilhantes, fabricação, bônus de química e concessão automática de selos ainda
não possuem os fluxos necessários na API. Eles não são apresentados como
operações reais de crédito/débito nas telas integradas. O assistente anterior
que simulava premiações foi substituído por ajuda de navegação.

Os catálogos e componentes visuais do projeto continuam disponíveis, mas valores
financeiros e propriedade de cartas não são fabricados no navegador. Níveis
visuais derivados de pontos não concedem prêmios no servidor.

## Rotas da interface

| Rota | Página |
|---|---|
| `/` | Home |
| `/dashboard` | Ações, verificações e histórico |
| `/colecao` | Cartas e fragmentos |
| `/recompensas` | Recompensas e selos |
| `/recompensas/:id` | Detalhe de recompensa |
| `/perfil` | Perfil autenticado |
| `/administracao` | Administração autorizada |
| `/solucao`, `/sobre`, `/faq`, `/integrantes`, `/contato` | Páginas institucionais |

## Validação e comandos

```shell
npm run build
npm run lint
npm run test:api
```

Os testes de API usam o runner nativo do **Node 24**, fetch simulado e nenhuma
chave real. A integração foi compilada e testada também no Chrome, com todas
as respostas da API interceptadas: nenhuma chamada paga ou escrita Oracle foi
necessária para validar os fluxos do frontend.

O lint conclui sem erros; há avisos de Fast Refresh nos arquivos de contexto
e recomendações sobre sincronização de estado em efeitos. A homologação com
a API/Oracle reais depende do backend iniciado e de contas de teste configuradas.

## Organização

```text
src/api/          Contratos, transporte, serviços, formulários e evidências
src/context/      Sessão em memória e adaptadores de dados
src/hooks/        Carregamento paginado com isolamento por sessão
src/components/   Controles, modal de envio e revisão privada
src/pages/        Telas de usuário e administração
tests/            Testes do cliente HTTP e dos contratos de integração
docs/             Guia de operação e decisões
```

Leia [docs/INTEGRACAO_API.md](docs/INTEGRACAO_API.md) para configuração, erros,
idempotência, escopo da integração e próximos passos do login externo.
