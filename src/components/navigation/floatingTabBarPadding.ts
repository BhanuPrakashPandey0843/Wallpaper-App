import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Margin above home indicator / screen bottom — keep in sync with CustomTabBar */
export const FLOATING_TAB_BAR_BOTTOM_MARGIN = 10;

/** Pill height (tallest tab item + vertical padding) */
export const FLOATING_TAB_BAR_BODY_PX = 92;

/** Gap between scroll content and top of pill */
export const FLOATING_TAB_BAR_GAP_PX = 12;

export function getFloatingTabBarBottomOffset(insetsBottom: number): number {
  return Math.max(insetsBottom, 8) + FLOATING_TAB_BAR_BOTTOM_MARGIN;
}

/** Total padding content needs so nothing sits under the floating tab bar */
export function getFloatingTabBarPadding(insetsBottom: number): number {
  return getFloatingTabBarBottomOffset(insetsBottom) + FLOATING_TAB_BAR_BODY_PX + FLOATING_TAB_BAR_GAP_PX;
}

export function useFloatingTabBarPadding(): number {
  const insets = useSafeAreaInsets();
  return getFloatingTabBarPadding(insets.bottom);
}
