import type { QuizCategory, QuizVisualPreset } from './questions';

const presets: Record<QuizVisualPreset, [string, string]> = {
  sunset: ['#7C2D12', '#EA580C'],
  desert: ['#92400E', '#F59E0B'],
  night: ['#1E1B4B', '#4338CA'],
  garden: ['#14532D', '#22C55E'],
  dawn: ['#4C1D95', '#FB7185'],
};

export function gradientForQuestion(
  category: Exclude<QuizCategory, 'mixed'>,
  preset?: QuizVisualPreset
): [string, string] {
  if (preset && presets[preset]) return presets[preset];
  switch (category) {
    case 'old':
      return presets.desert;
    case 'new':
      return presets.night;
    case 'jesus':
      return presets.sunset;
    case 'bible':
    default:
      return presets.dawn;
  }
}
