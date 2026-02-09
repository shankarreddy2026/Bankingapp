import { StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS, isSmallDevice } from './constants';
import { GradientView } from './GradientView';
import { getCardShadowStyle } from './shadowStyles';
import { flattenStyleForWeb } from './webSafeStyles';

function getDisplayName(email: string): string {
  if (!email?.trim()) return '';
  const part = email.split('@')[0]?.trim() ?? '';
  return part ? part.charAt(0).toUpperCase() + part.slice(1) : '';
}

export function WelcomeCard({ email }: { email?: string }) {
  const displayName = getDisplayName(email ?? '');
  const greeting = displayName ? `${displayName}'s Account Overview` : 'Account Overview';
  return (
    <GradientView
      colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={flattenStyleForWeb(styles.welcomeCard)}
    >
      <View style={flattenStyleForWeb(styles.welcomeContent)}>
        <Text style={flattenStyleForWeb(styles.welcomeGreeting)}>{greeting}</Text>
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
