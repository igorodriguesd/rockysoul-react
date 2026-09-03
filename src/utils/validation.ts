/**
 * Validações reutilizáveis para formulários
 */

export const VALIDATION_RULES = {
  nome: {
    required: 'Nome é obrigatório',
    minLength: { value: 3, message: 'Nome deve ter no mínimo 3 caracteres' },
    maxLength: { value: 100, message: 'Nome deve ter no máximo 100 caracteres' },
    pattern: {
      value: /^[a-zA-ZÀ-ÿ\s]+$/,
      message: 'Nome deve conter apenas letras'
    }
  },
  email: {
    required: 'Email é obrigatório',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email deve ser válido (ex: usuario@email.com)'
    },
    maxLength: { value: 255, message: 'Email muito longo' }
  },
  emailOpcional: {
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email deve ser válido (ex: usuario@email.com)'
    },
    maxLength: { value: 255, message: 'Email muito longo' }
  },
  mensagem: {
    required: 'Mensagem é obrigatória',
    minLength: { value: 10, message: 'Mensagem deve ter no mínimo 10 caracteres' },
    maxLength: { value: 1000, message: 'Mensagem deve ter no máximo 1000 caracteres' }
  },
  telefone: {
    pattern: {
      value: /^\+?[\d\s\-()]+$/,
      message: 'Telefone inválido'
    },
    minLength: { value: 10, message: 'Telefone deve ter no mínimo 10 dígitos' }
  }
};

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
 * Valida telefone (opcional)
 */
export function validatePhone(phone: string, isRequired = false): string | null {
  if (!phone && !isRequired) return null;
  if (!phone && isRequired) return 'Telefone é obrigatório';
  if (!/^\+?[\d\s\-()]+$/.test(phone)) return 'Telefone inválido';
  const digitos = phone.replace(/\D/g, '');
  if (digitos.length < 10) return 'Telefone deve ter no mínimo 10 dígitos';
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
