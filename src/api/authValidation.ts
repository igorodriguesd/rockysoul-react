export interface RegistrationValues { nome: string; email: string; senha: string; confirmarSenha: string }
export type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;
export function validateRegistration(values: RegistrationValues): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (!values.nome.trim() || values.nome.trim().length > 100) errors.nome = 'Informe seu nome, com até 100 caracteres.';
  if (!values.email.trim() || values.email.trim().length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Informe um email válido, com até 150 caracteres.';
  if (!values.senha.trim() || values.senha.length < 12 || values.senha.length > 72) errors.senha = 'A senha deve ter de 12 a 72 caracteres.';
  else if (new TextEncoder().encode(values.senha).byteLength > 72) errors.senha = 'Essa senha é muito longa. Use menos caracteres, acentos ou emojis.';
  if (values.confirmarSenha !== values.senha) errors.confirmarSenha = 'As senhas precisam ser iguais.';
  return errors;
}
