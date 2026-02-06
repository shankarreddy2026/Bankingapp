import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  money: '#F59E0B',
  cardBg: '#FFFFFF',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  error: '#EF4444',
  border: '#E2E8F0',
  menuBg: '#F1F5F9',
} as const;

// Product data
const productData = {
  ntf: {
    name: 'NTF (Non-Taxable Fixed Deposit)',
    icon: '📊',
    description: 'Fixed deposit scheme with tax benefits and competitive interest rates',
    interestRate: '7.5%',
    minAmount: 10000,
    tenure: '5 Years',
    features: [
      'Tax-free returns',
      'Higher interest rates',
      'Flexible tenure options',
      'Premature withdrawal available',
      'Auto-renewal option',
    ],
    benefits: ['No TDS deduction', 'Compound interest', 'Safe and secure investment', 'Regular income option'],
    currentInvestment: 500000,
    maturityAmount: 750000,
    maturityDate: '15/02/2029',
  },
  ilf: {
    name: 'ILF (Investment Linked Fund)',
    icon: '📈',
    description: 'Market-linked investment product with potential for higher returns',
    interestRate: '10-15%',
    minAmount: 50000,
    tenure: '3-5 Years',
    features: [
      'Market-linked returns',
      'Professional fund management',
      'Diversified portfolio',
      'Systematic investment plan',
      'Online tracking',
    ],
    benefits: [
      'Potential for higher returns',
      'Risk diversification',
      'Expert management',
      'Flexible investment options',
    ],
    currentInvestment: 300000,
    currentValue: 345000,
    returnPercentage: 15,
  },
  impls: {
    name: 'IMPLS (Immediate Payment Loan Scheme)',
    icon: '💼',
    description: 'Quick loan facility with instant approval and flexible repayment options',
    interestRate: '12%',
    maxAmount: 5000000,
    tenure: '1-5 Years',
    features: [
      'Instant approval',
      'No collateral required',
      'Flexible repayment',
      'Online application',
      'Quick disbursement',
    ],
    benefits: ['Minimal documentation', 'Competitive interest rates', 'EMI calculator available', 'Prepayment options'],
    availableLimit: 5000000,
    usedLimit: 1500000,
    availableBalance: 3500000,
  },
};

export default function MoneyScreen() {
  const { type } = useLocalSearchParams();
  const productType = type ? String(type).toUpperCase() : 'NTF';
  const product = productData[productType.toLowerCase() as keyof typeof productData] || productData.ntf;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'details' | 'transactions'>('overview');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: BANKING_COLORS.money + '20' }]}>
            <Text style={styles.headerIconText}>{product.icon}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{product.name}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={2}>
              {product.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Product Overview Card */}
      <View style={[styles.overviewCard, getCardShadowStyle()]}>
        {productType === 'NTF' && (
          <>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewLabel}>Current Investment</Text>
              <Text style={styles.overviewValue}>₹{product.currentInvestment.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewItemLabel}>Maturity Amount</Text>
                <Text style={[styles.overviewItemValue, { color: BANKING_COLORS.success }]}>
                  ₹{product.maturityAmount.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewItemLabel}>Maturity Date</Text>
                <Text style={styles.overviewItemValue}>{product.maturityDate}</Text>
              </View>
            </View>
            <View style={styles.interestRateBadge}>
              <Text style={styles.interestRateText}>Interest Rate: {product.interestRate} p.a.</Text>
            </View>
          </>
        )}

        {productType === 'ILF' && (
          <>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewLabel}>Current Investment</Text>
              <Text style={styles.overviewValue}>₹{product.currentInvestment.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewItemLabel}>Current Value</Text>
                <Text style={[styles.overviewItemValue, { color: BANKING_COLORS.success }]}>
                  ₹{product.currentValue.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <Text style={styles.overviewItemLabel}>Returns</Text>
                <Text style={[styles.overviewItemValue, { color: BANKING_COLORS.success }]}>
                  +{product.returnPercentage}%
                </Text>
              </View>
            </View>
            <View style={styles.interestRateBadge}>
              <Text style={styles.interestRateText}>Expected Returns: {product.interestRate} p.a.</Text>
            </View>
          </>
        )}

        {productType === 'IMPLS' && (
          <>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewLabel}>Available Credit Limit</Text>
              <Text style={styles.overviewValue}>₹{product.availableBalance.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${(product.usedLimit / product.maxAmount) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.progressBarLabels}>
                <Text style={styles.progressBarLabel}>Used: ₹{product.usedLimit.toLocaleString('en-IN')}</Text>
                <Text style={styles.progressBarLabel}>Limit: ₹{product.maxAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>
            <View style={styles.interestRateBadge}>
              <Text style={styles.interestRateText}>Interest Rate: {product.interestRate} p.a.</Text>
            </View>
          </>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {productType === 'IMPLS' ? (
          <>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Apply Loan</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>EMI Calculator</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>📄</Text>
              <Text style={styles.quickActionText}>Statement</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>💳</Text>
              <Text style={styles.quickActionText}>Repay</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>➕</Text>
              <Text style={styles.quickActionText}>Invest More</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>View Details</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>📄</Text>
              <Text style={styles.quickActionText}>Statement</Text>
            </Pressable>
            <Pressable style={[styles.quickActionBtn, getCardShadowStyle()]}>
              <Text style={styles.quickActionIcon}>💸</Text>
              <Text style={styles.quickActionText}>Withdraw</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['overview', 'details', 'transactions'] as const).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <>
          {/* Key Features */}
          <View style={[styles.featuresCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Key Features</Text>
            {product.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View style={[styles.featuresCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Benefits</Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>⭐</Text>
                <Text style={styles.featureText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {selectedTab === 'details' && (
        <>
          {/* Product Details */}
          <View style={[styles.detailsCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Product Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Product Name</Text>
              <Text style={styles.detailValue}>{product.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Interest Rate</Text>
              <Text style={[styles.detailValue, { color: BANKING_COLORS.success }]}>{product.interestRate} p.a.</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{productType === 'IMPLS' ? 'Maximum Amount' : 'Minimum Amount'}</Text>
              <Text style={styles.detailValue}>
                ₹{((productType === 'IMPLS' ? product.maxAmount : product.minAmount) || 0).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tenure</Text>
              <Text style={styles.detailValue}>{product.tenure}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{product.description}</Text>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={[styles.detailsCard, getCardShadowStyle()]}>
            <Text style={styles.cardTitle}>Terms & Conditions</Text>
            <Text style={styles.termsText}>
              • Interest rates are subject to change as per market conditions{'\n'}• Terms and conditions apply{'\n'}•
              Please read the product brochure for complete details{'\n'}• For queries, contact our customer service
              {'\n'}• All investments are subject to market risks
            </Text>
          </View>
        </>
      )}

      {selectedTab === 'transactions' && (
        <>
          {/* Transaction History */}
          <View style={styles.transactionSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {productType === 'IMPLS' ? (
              <>
                <View style={[styles.transactionItem, getCardShadowStyle()]}>
                  <View style={styles.transactionIconContainer}>
                    <View style={[styles.transactionIcon, { backgroundColor: BANKING_COLORS.error + '20' }]}>
                      <Text style={styles.transactionIconText}>💸</Text>
                    </View>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>Loan Disbursement</Text>
                    <Text style={styles.transactionDate}>2024-01-15</Text>
                  </View>
                  <Text style={[styles.transactionAmount, { color: BANKING_COLORS.error }]}>-₹1,50,000</Text>
                </View>
                <View style={[styles.transactionItem, getCardShadowStyle()]}>
                  <View style={styles.transactionIconContainer}>
                    <View style={[styles.transactionIcon, { backgroundColor: BANKING_COLORS.success + '20' }]}>
                      <Text style={styles.transactionIconText}>💳</Text>
                    </View>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>EMI Payment</Text>
                    <Text style={styles.transactionDate}>2024-02-01</Text>
                  </View>
                  <Text style={[styles.transactionAmount, { color: BANKING_COLORS.success }]}>+₹25,000</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.transactionItem, getCardShadowStyle()]}>
                  <View style={styles.transactionIconContainer}>
                    <View style={[styles.transactionIcon, { backgroundColor: BANKING_COLORS.success + '20' }]}>
                      <Text style={styles.transactionIconText}>💰</Text>
                    </View>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>Investment Made</Text>
                    <Text style={styles.transactionDate}>2024-01-10</Text>
                  </View>
                  <Text style={[styles.transactionAmount, { color: BANKING_COLORS.success }]}>
                    +₹{product.currentInvestment.toLocaleString('en-IN')}
                  </Text>
                </View>
                <View style={[styles.transactionItem, getCardShadowStyle()]}>
                  <View style={styles.transactionIconContainer}>
                    <View style={[styles.transactionIcon, { backgroundColor: BANKING_COLORS.money + '20' }]}>
                      <Text style={styles.transactionIconText}>📊</Text>
                    </View>
                  </View>
                  <View style={styles.transactionContent}>
                    <Text style={styles.transactionDescription}>Interest Credited</Text>
                    <Text style={styles.transactionDate}>2024-02-01</Text>
                  </View>
                  <Text style={[styles.transactionAmount, { color: BANKING_COLORS.success }]}>
                    +₹{((product.currentInvestment * 0.075) / 12).toFixed(0)}
                  </Text>
                </View>
              </>
            )}
            <Pressable style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All Transactions →</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* CTA Button */}
      <View style={styles.ctaContainer}>
        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>{productType === 'IMPLS' ? 'Apply for Loan' : 'Start Investment'}</Text>
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
    backgroundColor: BANKING_COLORS.money,
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
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  overviewCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    margin: isSmallDevice ? 16 : 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
  },
  overviewHeader: {
    marginBottom: 20,
  },
  overviewLabel: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: isSmallDevice ? 32 : 40,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: BANKING_COLORS.border,
  },
  overviewItem: {
    flex: 1,
  },
  overviewItemLabel: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
    marginBottom: 4,
  },
  overviewItemValue: {
    fontSize: 18,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
  },
  interestRateBadge: {
    backgroundColor: BANKING_COLORS.money + '15',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  interestRateText: {
    fontSize: 14,
    fontWeight: '600',
    color: BANKING_COLORS.money,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: BANKING_COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BANKING_COLORS.money,
    borderRadius: 4,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarLabel: {
    fontSize: 12,
    color: BANKING_COLORS.textSecondary,
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: BANKING_COLORS.cardBg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
  },
  tabActive: {
    backgroundColor: BANKING_COLORS.money,
    borderColor: BANKING_COLORS.money,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: BANKING_COLORS.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  featuresCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    marginHorizontal: isSmallDevice ? 16 : 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: BANKING_COLORS.textPrimary,
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: BANKING_COLORS.cardBg,
    marginHorizontal: isSmallDevice ? 16 : 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BANKING_COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: BANKING_COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  termsText: {
    fontSize: 14,
    color: BANKING_COLORS.textSecondary,
    lineHeight: 24,
  },
  transactionSection: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BANKING_COLORS.textPrimary,
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: BANKING_COLORS.money,
    fontWeight: '600',
  },
  ctaContainer: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: 40,
  },
  ctaButton: {
    backgroundColor: BANKING_COLORS.money,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
