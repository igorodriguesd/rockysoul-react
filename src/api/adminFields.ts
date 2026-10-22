import type { Recurso } from './types';
export interface Field { key: string; label: string; type?: 'number' | 'email' | 'datetime-local' | 'textarea'; required?: boolean; min?: number; max?: number; maxLength?: number; options?: string[] }
const raridades = ['COMUM', 'INCOMUM', 'RARA', 'EPICA', 'LENDARIA'];
const nome: Field = { key: 'nome', label: 'Nome', required: true, maxLength: 100 };
const descricao: Field = { key: 'descricao', label: 'Descrição', type: 'textarea', maxLength: 200 };
const usuario: Field = { key: 'usuarioId', label: 'ID do usuário', type: 'number', required: true, min: 1 };
const quantidade: Field = { key: 'quantidade', label: 'Quantidade', type: 'number', required: true, min: 0 };
export const adminResources: Record<Recurso, { label: string; fields: Field[] }> = {
  acao: { label: 'Ações', fields: [nome, { key: 'pontos', label: 'Pontos', type: 'number', required: true, min: 1, max: 100 }] },
  carta: { label: 'Cartas', fields: [nome, descricao, { key: 'conjunto', label: 'Conjunto', required: true, maxLength: 60 }, { key: 'raridade', label: 'Raridade', required: true, options: raridades }] },
  selo: { label: 'Selos', fields: [nome, descricao, { key: 'pontosMin', label: 'Pontuação mínima', type: 'number', required: true, min: 0 }] },
  recompensa: { label: 'Recompensas', fields: [{ key: 'titulo', label: 'Título', required: true, maxLength: 100 }, descricao, { key: 'custo', label: 'Custo em pontos', type: 'number', required: true, min: 1 }, { key: 'estoque', label: 'Estoque', type: 'number', required: true, min: 0 }, { key: 'categoria', label: 'Categoria', maxLength: 30 }, { key: 'destaque', label: 'Destaque', maxLength: 20 }] },
  historico: { label: 'Histórico', fields: [usuario, { ...descricao, required: true, maxLength: 150 }, { key: 'pontos', label: 'Pontos do registro', type: 'number', required: true, min: 1, max: 100 }, { key: 'dataAcao', label: 'Data da ação', type: 'datetime-local', required: true }] },
  'usuario-carta': { label: 'Cartas de usuários', fields: [usuario, { key: 'cartaId', label: 'ID da carta', type: 'number', required: true, min: 1 }, { ...quantidade, min: 1 }] },
  'usuario-fragmento': { label: 'Fragmentos de usuários', fields: [usuario, { key: 'raridade', label: 'Raridade', required: true, options: raridades }, quantidade] },
  usuario: { label: 'Usuários', fields: [nome, { key: 'email', label: 'Email', type: 'email', required: true, maxLength: 150 }] },
};
