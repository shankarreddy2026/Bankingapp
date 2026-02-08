import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS, hexToRgba } from './constants';
import { getCardShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';

interface RecentTransactionsSectionProps {
  onViewAll: () => void;
}

const RECENT_ITEMS = [
  {
    title: 'Salary Deposit',
    date: 'Today, 9:30 AM',
    amount: '+$3,500.00',
    color: BANKING_COLORS.success,
    icon: '📥',
    iconBg: hexToRgba(BANKING_COLORS.secondary, 0.1),
  },
  {
    title: 'Electric Bill',
    date: 'Yesterday, 2:15 PM',
    amount: '-$125.50',
    color: BANKING_COLORS.error,
    icon: '📤',
    iconBg: hexToRgba(BANKING_COLORS.error, 0.1),
  },
  {
    title: 'Grocery Store',
    date: '2 days ago',
    amount: '-$87.23',
    color: BANKING_COLORS.error,
    icon: '💳',
    iconBg: hexToRgba(BANKING_COLORS.primary, 0.1),
  },
];

export function RecentTransactionsSection({ onViewAll }: RecentTransactionsSectionProps) {
  return (
    <View style={styles.recentSection}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentSectionTitle}>Recent Transactions</Text>
        <Pressable onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>
      <View style={[styles.transactionCard, getCardShadowStyle()]}>
        {RECENT_ITEMS.map((item, index) => (
          <View key={item.title + item.date}>
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: item.iconBg }]}>
                <Text style={styles.transactionIconText}>{item.icon}</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.color }]}>{item.amount}</Text>
            </View>
            {index < RECENT_ITEMS.length - 1 ? <View style={styles.transactionDivider} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentSectionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  viewAllText: {
    color: BANKING_COLORS.primary,
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 22,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 13,
  },
  transactionAmount: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  transactionDivider: {
    height: 1,
    backgroundColor: BANKING_COLORS.border,
    marginVertical: 4,
  },
});
