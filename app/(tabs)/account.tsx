import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 360;

// Helper functions for platform-specific shadows
const getCardShadowStyle = () => {
  if (Platform.OS === 'android') return { elevation: 4 };
  if (Platform.OS === 'ios') {
    return {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === 'web') {
    return { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' };
  }
  return {};
};

const BANKING_COLORS = {
  primary: '#2563EB',
  account: '#3B82F6',
  cardBg: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  border: '#E2E8F0',
  menuBg: '#F1F5F9',
} as const;

// Mock transaction data
const mockTransactions = [
  { id: 1, type: 'credit', amount: 5000, description: 'Salary Credit', date: '2024-02-01', balance: 125000 },
  { id: 2, type: 'debit', amount: 2500, description: 'ATM Withdrawal', date: '2024-01-28', balance: 120000 },
  { id: 3, type: 'debit', amount: 1500, description: 'Online Payment', date: '2024-01-25', balance: 122500 },
  { id: 4, type: 'credit', amount: 3000, description: 'Transfer Received', date: '2024-01-20', balance: 124000 },
  { id: 5, type: 'debit', amount: 800, description: 'Bill Payment', date: '2024-01-18', balance: 121000 },
];

export default function AccountScreen() {
  const { type } = useLocalSearchParams();
  const accountType = type ? String(type).toUpperCase() : 'SAVING';
  const [selectedPeriod, setSelectedPeriod] = useState('30 Days');
  
  // Mock account data
  const accountData = {
    accountNumber: '****1234',
    ifscCode: 'BANK0001234',
    balance: accountType === 'SAVING' ? 125000 : 85000,
    availableBalance: accountType === 'SAVING' ? 123500 : 84500,
    interestRate: accountType === 'SAVING' ? '4.5%' : '3.0%',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: BANKING_COLORS.account + '20' }]}>
            <Text style={styles.headerIconText}>
              {accountType === 'SAVING' ? '💰' : '💵'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{accountType} Account</Text>
            <Text style={styles.headerSubtitle}>Account Number: {accountData.accountNumber}</Text>
          </View>
        </View>
      </View>

      {/* Balance Card */}
      <View style={[styles.balanceCard, getCardShadowStyle()]}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Pressable style={styles.eyeButton}>
            <Text style={styles.eyeIcon}>👁️</Text>
          </Pressable>
        </View>
        <Text style={styles.balanceAmount}>
          ₹{accountData.availableBalance.toLocaleString('en-IN')}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceDetailItem}>
            <Text style={styles.balanceDetailLabel}>Total Balance</Text>
            <Text style={styles.balanceDetailValue}>
              ₹{accountData.balance.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={styles.balanceDetailItem}>
            <Text style={styles.balanceDetailLabel}>Interest Rate</Text>
            <Text style={[styles.balanceDetailValue, { color: BANKING_COLORS.success }]}>
              {accountData.interestRate} p.a.
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
          <Text style={styles.quickActionIcon}>📤</Text>
          <Text style={styles.quickActionText}>Transfer</Text>
        </Pressable>
        <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
          <Text style={styles.quickActionIcon}>📥</Text>
          <Text style={styles.quickActionText}>Deposit</Text>
        </Pressable>
        <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
          <Text style={styles.quickActionIcon}>📄</Text>
          <Text style={styles.quickActionText}>Statement</Text>
        </Pressable>
        <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
          <Text style={styles.quickActionIcon}>💳</Text>
          <Text style={styles.quickActionText}>Cards</Text>
        </Pressable>
      </View>

      {/* Account Details Card */}
      <View style={[styles.detailsCard, getCardShadowStyle()]}>
        <Text style={styles.cardTitle}>Account Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Number</Text>
          <Text style={styles.detailValue}>{accountData.accountNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IFSC Code</Text>
          <Text style={styles.detailValue}>{accountData.ifscCode}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Type</Text>
          <Text style={[styles.detailValue, { color: BANKING_COLORS.account }]}>
            {accountType}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Branch</Text>
          <Text style={styles.detailValue}>Main Branch, City</Text>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.transactionSection}>
        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.periodSelector}>
            {['7 Days', '30 Days', '90 Days'].map((period) => (
              <Pressable
                key={period}
                style={[
                  styles.periodBtn,
                  selectedPeriod === period && styles.periodBtnActive,
                ]}
                onPress={() => setSelectedPeriod(period)}>
                <Text
                  style={[
                    styles.periodBtnText,
                    selectedPeriod === period && styles.periodBtnTextActive,
                  ]}>
                  {period}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {mockTransactions.map((transaction) => (
          <View key={transaction.id} style={[styles.transactionItem, getCardShadowStyle()]}>
            <View style={styles.transactionIconContainer}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      transaction.type === 'credit'
                        ? BANKING_COLORS.success + '20'
                        : BANKING_COLORS.warning + '20',
                  },
                ]}>
                <Text style={styles.transactionIconText}>
                  {transaction.type === 'credit' ? '⬇️' : '⬆️'}
                </Text>
              </View>
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text
                style={[
                  styles.transactionAmountText,
                  {
                    color:
                      transaction.type === 'credit'
                        ? BANKING_COLORS.success
                        : BANKING_COLORS.textPrimary,
                  },
                ]}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
              </Text>
              <Text style={styles.transactionBalance}>
                Balance: ₹{transaction.balance.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All Transactions →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  header: {
    backgroundColor: BANKING_COLORS.account,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerIconText: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  balanceCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    margin: isSmallDevice ? 16 : 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  balanceAmount: {
    fontSize: isSmallDevice ? 32 : 40,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 20,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BANKING_COLORS.border,
  },
  balanceDetailItem: {
    flex: 1,
  },
  balanceDetailLabel: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 4,
  },
  balanceDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: 20,
    gap: 12,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: BANKING_COLORS.textPrimary,
    fontWeight: '500',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    marginHorizontal: isSmallDevice ? 16 : 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BANKING_COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
  },
  transactionSection: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: 40,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: BANKING_COLORS.cardBg,
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
  },
  periodBtnActive: {
    backgroundColor: BANKING_COLORS.account,
    borderColor: BANKING_COLORS.account,
  },
  periodBtnText: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
    fontWeight: '500',
  },
  periodBtnTextActive: {
    color: '#FFFFFF',
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  transactionIconContainer: {
    marginRight: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionContent: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionBalance: {
    fontSize: 11,
    color: BANKING_COLORS.textSecondary,
  },
  viewAllBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: BANKING_COLORS.account,
    fontWeight: '600',
  },
});
