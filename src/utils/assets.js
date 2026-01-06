/**
 * Helper para obter caminhos corretos de assets públicos
 * Usa BASE_URL do Vite que é configurado automaticamente
 */
export function getPublicPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  // Remove barra inicial do path se existir
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
