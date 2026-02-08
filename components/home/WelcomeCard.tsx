import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS } from './constants';
import { getCardShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';

export function WelcomeCard() {
  return (
    <LinearGradient
      colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeCard}
    >
      <View style={styles.welcomeContent}>
        <Text style={styles.welcomeGreeting}>Account Overview 💼</Text>
        <Text style={styles.welcomeSubtext}>Manage your finances securely</Text>
      </View>
    </LinearGradient>
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
