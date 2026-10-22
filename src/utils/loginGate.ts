export const EVENTO_ABRIR_LOGIN = 'rocky:abrir-login';

export function abrirLogin(): void {
  window.dispatchEvent(new Event(EVENTO_ABRIR_LOGIN));
}
