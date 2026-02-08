import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS } from './constants';
import { getCardShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';
import { flattenStyleForWeb } from './webSafeStyles';

interface BalanceCardProps {
  balanceVisible: boolean;
  onToggleVisibility: () => void;
}

export function BalanceCard({ balanceVisible, onToggleVisibility }: BalanceCardProps) {
  return (
    <View style={flattenStyleForWeb({ ...styles.balanceCard, ...getCardShadowStyle() })}>
      <View style={flattenStyleForWeb(styles.balanceHeader)}>
        <Text style={flattenStyleForWeb(styles.balanceLabel)}>Total Balance</Text>
        <Pressable onPress={onToggleVisibility} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={flattenStyleForWeb(styles.balanceEye)}>{balanceVisible ? '👁️' : '🔒'}</Text>
        </Pressable>
      </View>
      <Text style={flattenStyleForWeb(styles.balanceAmount)}>{balanceVisible ? '$45,231.89' : '••••••'}</Text>
      <View style={flattenStyleForWeb(styles.balanceFooter)}>
        <View style={flattenStyleForWeb(styles.balanceItem)}>
          <Text style={flattenStyleForWeb(styles.balanceItemLabel)}>Savings</Text>
          <Text style={flattenStyleForWeb(styles.balanceItemValue)}>{balanceVisible ? '$28,450.00' : '••••••'}</Text>
        </View>
        <View style={flattenStyleForWeb(styles.balanceDivider)} />
        <View style={flattenStyleForWeb(styles.balanceItem)}>
          <Text style={flattenStyleForWeb(styles.balanceItemLabel)}>Current</Text>
          <Text style={flattenStyleForWeb(styles.balanceItemValue)}>{balanceVisible ? '$16,781.89' : '••••••'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  balanceEye: {
    fontSize: 22,
    padding: 4,
  },
  balanceAmount: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 36 : 42,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BANKING_COLORS.border,
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceItemLabel: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  balanceItemValue: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: BANKING_COLORS.border,
    marginHorizontal: 16,
  },
});
