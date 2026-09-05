/**
 * Validações reutilizáveis para formulários
 */

/**
 * Valida nome de usuário
 */
export function validateName(name: string): string | null {
  if (!name || !name.trim()) return 'Nome é obrigatório';
  if (name.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
  if (name.trim().length > 100) return 'Nome deve ter no máximo 100 caracteres';
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) return 'Nome deve conter apenas letras';
  return null;
}

/**
 * Valida email
 */
export function validateEmail(email: string, isRequired = true): string | null {
  if (!email && !isRequired) return null;
  if (!email && isRequired) return 'Email é obrigatório';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email deve ser válido';
  if (email.length > 255) return 'Email muito longo';
  return null;
}

/**
 * Valida mensagem
 */
export function validateMessage(message: string): string | null {
  if (!message || !message.trim()) return 'Mensagem é obrigatória';
  if (message.trim().length < 10) return 'Mensagem deve ter no mínimo 10 caracteres';
  if (message.length > 1000) return 'Mensagem deve ter no máximo 1000 caracteres';
  return null;
}

/**
 * Limpa e normaliza nome
 */
export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Limpa e normaliza email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Limpa e normaliza mensagem
 */
export function normalizeMessage(message: string): string {
  return message
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 1000);
}
