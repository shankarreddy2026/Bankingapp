import { GradientView } from './GradientView';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BANKING_COLORS } from './constants';
import { getQuickActionShadowStyle } from './shadowStyles';
import { isSmallDevice } from './constants';
import { flattenStyleForWeb } from './webSafeStyles';

export function QuickActionsSection() {
  return (
    <View style={flattenStyleForWeb(styles.quickActionsSection)}>
      <Text style={flattenStyleForWeb(styles.sectionTitle)}>Quick Actions</Text>
      <View style={flattenStyleForWeb(styles.quickActions)}>
        <Pressable style={flattenStyleForWeb({ ...styles.quickActionCard, ...getQuickActionShadowStyle() })}>
          <GradientView
            colors={[BANKING_COLORS.primary, BANKING_COLORS.primaryLight]}
            style={flattenStyleForWeb(styles.quickActionGradient)}
          >
            <Text style={flattenStyleForWeb(styles.quickActionIcon)}>💳</Text>
            <Text style={flattenStyleForWeb(styles.quickActionText)}>Accounts</Text>
          </GradientView>
        </Pressable>
        <Pressable style={flattenStyleForWeb({ ...styles.quickActionCard, ...getQuickActionShadowStyle() })}>
          <GradientView
            colors={[BANKING_COLORS.secondary, '#34D399']}
            style={flattenStyleForWeb(styles.quickActionGradient)}
          >
            <Text style={flattenStyleForWeb(styles.quickActionIcon)}>📊</Text>
            <Text style={flattenStyleForWeb(styles.quickActionText)}>Transactions</Text>
          </GradientView>
        </Pressable>
        <Pressable style={flattenStyleForWeb({ ...styles.quickActionCard, ...getQuickActionShadowStyle() })}>
          <GradientView
            colors={[BANKING_COLORS.accent, '#FBBF24']}
            style={flattenStyleForWeb(styles.quickActionGradient)}
          >
            <Text style={flattenStyleForWeb(styles.quickActionIcon)}>💰</Text>
            <Text style={flattenStyleForWeb(styles.quickActionText)}>Balance</Text>
          </GradientView>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: isSmallDevice ? 100 : 110,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  quickActionGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  quickActionText: {
    color: BANKING_COLORS.cardBg,
    fontSize: isSmallDevice ? 13 : 15,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
