type Campo = {
  rotulo: string;
  min?: number;
  max?: number;
  regex?: RegExp;
  mensagemRegex?: string;
};

function validarTexto(valor: string, campo: Campo, obrigatorio = true): string | null {
  const texto = valor.trim();

  if (!texto) return obrigatorio ? `${campo.rotulo} é obrigatório` : null;
  if (campo.min != null && texto.length < campo.min) return `${campo.rotulo} deve ter no mínimo ${campo.min} caracteres`;
  if (campo.max != null && texto.length > campo.max) return `${campo.rotulo} deve ter no máximo ${campo.max} caracteres`;
  if (campo.regex && !campo.regex.test(texto)) return campo.mensagemRegex ?? 'Formato inválido';

  return null;
}

export function validateName(name: string): string | null {
  return validarTexto(name, {
    rotulo: 'Nome',
    min: 3,
    max: 100,
    regex: /^[a-zA-ZÀ-ÿ\s]+$/,
    mensagemRegex: 'Nome deve conter apenas letras',
  });
}

export function validateEmail(email: string, isRequired = true): string | null {
  return validarTexto(
    email,
    {
      rotulo: 'Email',
      max: 255,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      mensagemRegex: 'Email deve ser válido',
    },
    isRequired,
  );
}

export function validateMessage(message: string): string | null {
  return validarTexto(message, { rotulo: 'Mensagem', min: 10, max: 1000 });
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}