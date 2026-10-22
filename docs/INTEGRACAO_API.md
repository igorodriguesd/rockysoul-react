# Integração RockySoulup — frontend React

O frontend consome a API Java em **http://localhost:8080**, na branch
`PedroSalvatore`. Não existe fallback para dados financeiros locais.

## Executar

1. Inicie a API Java separadamente com o Oracle configurado e as migrações
   revisadas/aplicadas. O frontend não cria o schema nem executa SQL.
2. Na raiz do frontend, execute `npm install` se as dependências ainda não
   estiverem instaladas e depois `npm run dev`.
3. Abra `http://127.0.0.1:5173` ou `http://localhost:5173`. O Vite usa porta fixa
   5173; se estiver ocupada, encerre a execução anterior ou ajuste o ambiente
   conscientemente, incluindo o CORS no backend.
4. `VITE_API_BASE_URL` é opcional, com default `http://localhost:8080`.
   `.env.example` contém somente configuração pública. Se alterar a variável,
   reinicie o Vite. Não exponha chave Gemini, JWT_SECRET ou senha Oracle
   em variáveis VITE_: elas entram no código distribuído ao navegador.

O backend deve permitir exatamente a origem do frontend, incluindo protocolo,
host e porta; localhost e 127.0.0.1 são origens distintas. Authorization,
Content-Type e Idempotency-Key precisam estar permitidos e Retry-After exposto.
Não foi alterada a segurança da API para remover autenticação.

## Cadastro e login pela API Java

Clique em **Criar conta** e preencha nome, email, senha e confirmação. O formulário
envia apenas nome, email e senha para POST `/auth/cadastro`; não envia perfil,
pontos, confirmação, versão ou ID. Uma resposta 201 confirma a criação; então
o formulário muda para login, preservando o email e limpando os campos de senha.
Nenhuma autenticação é assumida com base apenas no cadastro.

Clique em **Entrar**, informe email/senha e envie. POST `/auth/login` retorna o
JWT, que o frontend usa automaticamente. As chamadas públicas de cadastro/login
não enviam Authorization, mesmo se houver uma sessão anterior. A exceção pública
do cliente é restrita a essas duas rotas POST; os demais recursos exigem token.

O formulário valida nome não vazio (até 100 caracteres), email (até 150), senha
de 12–72 caracteres e no máximo 72 bytes UTF-8, além da confirmação idêntica.
O backend permanece autoritativo. Email é normalizado, senha não é truncada nem
tem espaços removidos. Nenhuma credencial é registrada em logs ou armazenamento
persistente. Depois de cada tentativa os campos de senha são limpos.

409 no cadastro orienta usar Entrar se a conta já existe; 429 respeita Retry-After
com contagem regressiva e desabilita novas tentativas até o prazo. Erros de rede,
503 ou JSON inválido não produzem uma confirmação falsa. Não há retry automático
nem criação de usuário local para compensar falhas do servidor.

A opção **Acesso avançado por token** é opcional para diagnóstico. O frontend
lê sub/exp somente para localizar a identidade e consulta o perfil no backend;
decodificar o token no navegador não valida sua assinatura nem concede acesso.
O login externo OAuth/OIDC continua reservado para uma próxima etapa.

O token fica somente na memória da aba: recarregar a página exige entrar novamente.
Tokens atuais da API expiram em cinco minutos; 401 limpa a sessão. Sair chama
POST /auth/logout e encerra também o estado local, mesmo se a rede falhar.
Logout confirmado pelo backend revoga todas as sessões da conta. Se a rede
falhar, a limpeza local não garante revogação remota; o token pode continuar
válido até expirar. Atualizar nome/email exige entrar novamente.

Quando o provedor externo for escolhido, o ponto de integração é ApiProvider:
ele receberá uma credencial aceita pela API. Tokens externos não devem ser
colados como se já fossem aceitos pelo backend atual. Sua validação e o vínculo
de identidade precisam ser implementados nessa próxima etapa.

## Funcionalidades conectadas

| Tela | Integração |
|---|---|
| Home/Header | Identidade e saldo confirmados, sem usuários/ranking fictícios |
| Dashboard | Catálogo de ações, envio de foto, verificações e histórico paginados |
| Evidência | Leitura privada com Bearer, Object URL temporária e exclusão autorizada |
| Coleção | Catálogo de cartas, cartas atribuídas e fragmentos, com paginação independente |
| Recompensas | Catálogo, estoque, detalhe e selos disponíveis na API |
| Perfil | Consulta e alteração de nome/email com versão e revogação da sessão |
| Administração | CRUD dos catálogos, histórico, cartas/fragmentos de usuários e gestão de usuários |
| Administração de usuários | Consulta, edição de perfil, ajuste absoluto de saldo e desativação |
| Revisão de IA | Aprovar/rejeitar com justificativa e versão, reprocessar com confirmação de cobrança |
| Controle de IA | Consultar consumo/reservas e suspender/retomar admissões |

O acesso ADMIN é confirmado consultando uma rota administrativa no backend;
não é derivado de email, de um perfil digitado ou de um claim não verificado.
Se essa checagem falhar, nenhum acesso administrativo é concedido no frontend.
O backend continua sendo a autoridade em todas as requisições, inclusive se
alguém modificar a interface no navegador. ADMIN recebe listas gerais nos
endpoints que a API permite; USER recebe somente seus próprios registros.

As listas carregam 20 registros por página. Não são inventados totalElements,
totalPages, ranking global, CO2 comprovado ou contagem total de ações. Os
adaptadores legados usados pela Home consultam a primeira página; os catálogos
e registros completos podem ser percorridos nas telas correspondentes.

## Evidências e idempotência

A submissão envia apenas acaoId, descricao e imagemBase64. Usuário, aprovação,
modelo e pontos não são enviados pelo cliente. JPEG/PNG até 512 KiB e 32–2048
pixels por lado são conferidos no cliente, incluindo dimensões antes de abrir
o raster; o backend faz a validação autoritativa do arquivo real.

Cada operação recebe uma Idempotency-Key aleatória. Em resposta de rede incerta,
o modal conserva a chave e o corpo em memória para uma repetição explícita,
sem retry automático. Mantenha o modal aberto para essa repetição. Fechar a
janela/aba descarta a cópia local: consulte as verificações antes de submeter
outra operação. O backend também deduplica conteúdo do mesmo usuário.

202 e parecer COMPATIVEL não creditam pontos. O saldo só é atualizado com o
retorno do backend, após revisão. Use Atualizar para consultar o andamento; não
há polling que fique repetindo chamadas enquanto o usuário está inativo.

Para excluir imagem ou reprocessar, o frontend pede confirmação. Antes de uma
decisão administrativa ele reconsulta a versão; se mudou, exige revisar o
novo estado. O backend impõe as restrições transacionais finais.

Não houve ativação de AI_ENABLED ou uso de chaves reais. Com IA desabilitada,
sem orçamento, suspensa ou com circuito aberto, o frontend mostra o erro
correspondente e não converte falhas em aprovações.

## Funcionalidades que a API ainda não oferece

Resgate de recompensas, Pix, bônus diário, sorteios/drops, variantes brilhantes,
fabricação e bônus de química não possuem operações de negócio na API atual.
Os fluxos locais que simulavam créditos, débito ou prêmios foram retirados das
telas integradas ou bloqueados nos adaptadores legados. Nenhum endpoint
administrativo de saldo/histórico é usado para simular essas operações.

Os dados antigos em localStorage não são importados como saldo ou coleção.
O app não os apaga automaticamente, mas deixa de confiar neles. O chat anterior
que simulava premiação foi substituído por ajuda de navegação sem escrita.

## Organização e manutenção

- src/api/types.ts: DTOs do contrato Java.
- src/api/client.ts: transporte, Bearer, erros seguros, cancelamento, limite de
  leitura, timeout de 65 s para comportar até duas chamadas de provedor; sem retry.
- src/api/services.ts: rotas e operações tipadas; chaves compostas e versões.
- src/api/evidence.ts: validação de imagem e Base64 puro.
- src/context/ApiContext.tsx: sessão em memória e limpeza por expiração/401.
- src/hooks/useApiPage.ts: paginação, cancelamento e isolamento por sessão.
- src/components/Verificacoes.tsx: consulta/revisão/evidência privada.
- src/pages/Administracao.tsx: formulários dos recursos e operações ADMIN.

Os componentes React existentes e o tema verde/escuro foram mantidos como base
visual. Nas áreas antes simuladas, as telas foram adaptadas aos dados e
operações efetivamente oferecidos pela API.

## Validação

```shell
npm run build
npm run lint
npm run test:api
```

Use Node 24 para executar os testes TypeScript com o runner nativo. Os testes
do cliente usam fetch simulado e não acessam Oracle nem provedores de IA.
Também foram executados testes no Chrome com interceptação de todas as chamadas
à API: conexão, dados reais simulados, foto, pendência sem crédito, leitura de
evidência privada, coleção, recompensas, perfil, repetição com chave preservada,
CRUD administrativo e aprovação com atualização de saldo.

Os testes de navegador foram executados em ambiente de verificação separado.
Os fixtures não são um modo de demonstração do produto e não acompanham o
código de produção. A homologação ponta a ponta com a API/Oracle reais ainda
precisa ocorrer com a API iniciada, migrações aplicadas e contas de teste.
