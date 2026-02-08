import { GradientView } from './GradientView';
import { StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS } from './constants';
import { getCardShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';
import { flattenStyleForWeb } from './webSafeStyles';

export function WelcomeCard() {
  return (
    <GradientView
      colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={flattenStyleForWeb(styles.welcomeCard)}
    >
      <View style={flattenStyleForWeb(styles.welcomeContent)}>
        <Text style={flattenStyleForWeb(styles.welcomeGreeting)}>Account Overview 💼</Text>
        <Text style={flattenStyleForWeb(styles.welcomeSubtext)}>Manage your finances securely</Text>
      </View>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  welcomeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    ...getCardShadowStyle(),
  },
  welcomeContent: {
    alignItems: 'flex-start',
  },
  welcomeGreeting: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 26 : 32,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  welcomeSubtext: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 14 : 16,
    opacity: 0.95,
  },
});
