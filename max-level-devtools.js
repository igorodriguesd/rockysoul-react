// ============================================================
// Cole no CONSOLE do navegador (F12) na página http://localhost:5173
// e depois recarregue a página (F5).
// ============================================================
(() => {
  const CARTAS = [
    'card-reciclagem', 'card-reutilizacao', 'card-sacola', 'card-consumo',
    'card-agua', 'card-banho', 'card-garrafa', 'card-captacao',
    'card-bicicleta', 'card-transporte', 'card-mobilidade', 'card-ciclovia',
    'card-energia', 'card-solar', 'card-eolica', 'card-led',
    'card-plantio', 'card-compostagem', 'card-horta', 'card-agrofloresta',
  ];

  const PRESENTES = ['card-solar', 'card-plantio', 'card-agrofloresta', 'card-bicicleta', 'card-transporte', 'card-mobilidade'];

  const sets = ['recursos', 'agua', 'cidade-verde', 'energia-limpa', 'cultivo'];
  const porSet = {
    recursos: ['card-reciclagem', 'card-reutilizacao', 'card-sacola', 'card-consumo'],
    agua: ['card-agua', 'card-banho', 'card-garrafa', 'card-captacao'],
    'cidade-verde': ['card-bicicleta', 'card-transporte', 'card-mobilidade', 'card-ciclovia'],
    'energia-limpa': ['card-energia', 'card-solar', 'card-eolica', 'card-led'],
    cultivo: ['card-plantio', 'card-compostagem', 'card-horta', 'card-agrofloresta'],
  };

  const hoje = new Date().toDateString();

  const colecao = {
    cartasObtidas: CARTAS,
    cartasFoil: PRESENTES,
    fragmentos: { comum: 9999, incomum: 9999, rara: 9999, epica: 9999, lendaria: 9999 },
    sets: sets.reduce((acc, id) => {
      acc[id] = { cartas: porSet[id], level: 3 };
      return acc;
    }, {}),
  };

  const user = JSON.parse(localStorage.getItem('rocky_user_data') || 'null') || {};
  const data = {
    nome: user.nome || 'Teste',
    email: user.email || '',
    pontos: 2500,
    pontosAcumulados: 5000,
    missoesCompletas: Math.max(user.missoesCompletas || 0, 200),
    pontosHoje: 0,
    dataHoje: user.dataHoje || hoje,
    ultimoDia: user.ultimoDia || hoje,
    streak: Math.max(user.streak || 0, 30),
    ultimoDesafio: '',
    historico: Array.isArray(user.historico) ? user.historico : [],
    selosDesbloqueados: ['semente', 'broto', 'arvore', 'floresta'],
    resgates: Array.isArray(user.resgates) ? user.resgates : [],
    impactoParceiros: user.impactoParceiros || {},
    amigos: Array.isArray(user.amigos) ? user.amigos : [],
  };

  localStorage.setItem('rocky_colecao', JSON.stringify(colecao));
  localStorage.setItem('rocky_user_data', JSON.stringify(data));

  console.log('OK: nível Floresta (5000 pts) + coleção 100% aplicados. Recarregue a página (F5).');
})();