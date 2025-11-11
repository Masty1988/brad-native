/**
 * Palette BRAD Officielle
 * Charte graphique de l'application anti-scam
 */

export const BradColors = {
  // Couleurs principales
  bleuBrad: '#2563EB',
  vertBrad: '#10B981',
  noir: '#111827',
  blanc: '#FFFFFF',
  grisClair: '#F9FAFB',
  grisMoyen: '#E5E7EB',

  // Couleurs sémantiques (basées sur la palette)
  primary: '#2563EB',
  secondary: '#10B981',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },

  // Couleurs de risque (pour le scanner)
  risk: {
    critical: '#EF4444',      // Rouge - Danger
    high: '#F97316',          // Orange - Suspect
    medium: '#EAB308',        // Jaune - Prudence
    low: '#10B981',           // Vert - OK
  },

  // Backgrounds de risque (versions claires)
  riskBackground: {
    critical: '#FEE2E2',
    high: '#FFEDD5',
    medium: '#FEF3C7',
    low: '#D1FAE5',
  },

  // Couleurs pour les états
  success: '#10B981',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#2563EB',

  // Couleurs pour les badges
  badge: {
    blue: { bg: '#DBEAFE', text: '#1E40AF' },
    green: { bg: '#D1FAE5', text: '#065F46' },
    purple: { bg: '#E9D5FF', text: '#7E22CE' },
    red: { bg: '#FEE2E2', text: '#991B1B' },
    orange: { bg: '#FFEDD5', text: '#9A3412' },
    yellow: { bg: '#FEF3C7', text: '#92400E' },
  },
} as const;

/**
 * Gradient Brad (pour les headers, CTAs, etc.)
 * Utilisation avec LinearGradient d'expo
 */
export const BradGradient = {
  colors: [BradColors.bleuBrad, BradColors.vertBrad],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0, 1],
} as const;

/**
 * Helper pour obtenir la couleur de risque en fonction du score
 */
export const getRiskColor = (score: number): string => {
  if (score >= 70) return BradColors.risk.critical;
  if (score >= 40) return BradColors.risk.high;
  if (score >= 20) return BradColors.risk.medium;
  return BradColors.risk.low;
};

/**
 * Helper pour obtenir le background de risque en fonction du score
 */
export const getRiskBackground = (score: number): string => {
  if (score >= 70) return BradColors.riskBackground.critical;
  if (score >= 40) return BradColors.riskBackground.high;
  if (score >= 20) return BradColors.riskBackground.medium;
  return BradColors.riskBackground.low;
};
