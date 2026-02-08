import { Platform, View, type ViewStyle } from 'react-native';

interface GradientViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Cross-platform gradient using CSS on web and solid color on native.
 * Use this when expo-linear-gradient is not installed so the app still bundles.
 */
export function GradientView({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}: GradientViewProps) {
  if (Platform.OS === 'web') {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const deg = Math.round((angle * 180) / Math.PI) + 90;
    const colorList = colors.join(', ');
    const webStyle = {
      ...(style as object),
      backgroundImage: `linear-gradient(${deg}deg, ${colorList})`,
    } as ViewStyle;
    return <View style={webStyle}>{children}</View>;
  }
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
}
