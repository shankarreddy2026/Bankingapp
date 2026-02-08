import { Platform, StyleSheet } from 'react-native';

/**
 * On web, React DOM does not support style arrays (style[0]=...).
 * Flattens to a single style object on web; returns unchanged on native.
 */
export function flattenStyleForWeb<T>(style: T): T {
  if (Platform.OS !== 'web') return style;
  if (style == null) return style;
  return StyleSheet.flatten(style as object) as T;
}
