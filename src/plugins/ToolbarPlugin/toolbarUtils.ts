// Helper functions to check toolbar config visibility
export function isVisible(
  config: boolean | object | undefined,
  subKey?: string
): boolean {
  if (config === undefined) return true; // Default to visible
  if (typeof config === 'boolean') return config;
  if (typeof config === 'object' && subKey) {
    return (config as any)[subKey] !== false;
  }
  return true;
}
