import type { Acao, RecompensaApi } from './types';
import type { Missao, Recompensa } from '../types';
import { MISSOES, RECOMPENSAS } from '../data/constants';
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function actionView(row: Acao): Missao {
  const visual = MISSOES.find(item => normalize(item.nome) === normalize(row.nome));
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
