import { CARTAS, SETS_CARTAS } from '../data/cartas';
import type { Acao, RecompensaApi, CartaApi } from './types';
import type { Missao, Recompensa, Carta, RaridadeCarta } from '../types';
import { MISSOES, RECOMPENSAS } from '../data/constants';
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function actionView(row: Acao): Missao {
  const aliases: Record<string, string> = {"Transporte Público": "transporte", "Plantio de Árvore": "plantio", "Compartilhar Dicas": "educar", "Captação de Água da Chuva": "captacao", "Usar Ciclovia": "ciclovia", "Apoiar Agrofloresta": "agrofloresta"};
  const visual = MISSOES.find(item => normalize(item.nome) === normalize(row.nome) || item.id === aliases[row.nome]);
  return { ...visual, id: visual?.id ?? `api-${row.id}`, acaoId: row.id, nome: row.nome, pontos: row.pontos,
    icone: visual?.icone ?? '/icons/folha.svg', comprovacao: 'foto',
    descricao: visual?.descricao ?? row.nome,
    comoValidar: 'Capture a ação com o código do desafio escrito em papel na mesma cena. A decisão e os pontos são definidos pela API.',
    comprovantes: visual?.comprovantes ?? ['Foto da ação e do código em papel'] };
}
export function rewardView(row: RecompensaApi): Recompensa {
  const visual = RECOMPENSAS.find(item => normalize(item.nome) === normalize(row.titulo));
  return { ...visual, id: String(row.id), nome: row.titulo, descricao: row.descricao ?? '', pontos: row.custo,
    categoria: (row.categoria ?? visual?.categoria ?? 'Natureza') as Recompensa['categoria'],
    icone: visual?.icone ?? '/icons/trofeu.svg', valorReal: visual?.valorReal ?? 0 };
}

export function cardView(row: CartaApi): Carta {
  const artwork = CARTAS.find(item => normalize(item.nome) === normalize(row.nome));
  const set = SETS_CARTAS.find(item => normalize(item.nome) === normalize(row.conjunto) || normalize(item.id) === normalize(row.conjunto));
  return { id: artwork?.id ?? `api-${row.id}`, nome: row.nome, setId: set?.id ?? row.conjunto,
    raridade: row.raridade.toLowerCase() as RaridadeCarta, descricao: row.descricao ?? '',
    icone: artwork?.icone ?? '/icons/folha.svg' };
}
