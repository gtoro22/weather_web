/**
 * Acceso a localStorage tolerante a fallos: en modo incógnito o con el
 * almacenamiento bloqueado las operaciones lanzan, y la app debe seguir viva.
 */
export function readStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible: la preferencia sólo vive en memoria */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* nada que limpiar si el almacenamiento no está disponible */
  }
}
