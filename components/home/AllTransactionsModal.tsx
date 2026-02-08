import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import { BANKING_COLORS, hexToRgba, isSmallDevice } from './constants';
import type { Transaction } from './constants';
import { getCardShadowStyle, getShadowStyle } from './shadowStyles';

interface AllTransactionsModalProps {
  visible: boolean;
  onClose: () => void;
  transactions: Transaction[];
  loadedCount: number;
  onLoadMore: () => void;
}

export function AllTransactionsModal({
  visible,
  onClose,
  transactions,
  loadedCount,
  onLoadMore,
}: AllTransactionsModalProps) {
  const displayedTransactions = transactions.slice(0, loadedCount);
  const allLoaded = loadedCount >= 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>All Transactions</Text>
          <Pressable onPress={onClose} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>✕</Text>
          </Pressable>
        </View>
        <FlatList
          data={displayedTransactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={true}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={styles.loadingFooter}>
              <Text style={styles.loadingFooterText}>
                {allLoaded ? 'All transactions loaded' : 'Loading more...'}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={{ ...styles.modalTransactionItem, ...getCardShadowStyle() }}>
              <View style={styles.modalTransactionRow}>
                <View
                  style={{
                    ...styles.modalTransactionIcon,
                    backgroundColor: hexToRgba(item.iconColor, 0.1),
                  }}
                >
                  <Text style={styles.modalTransactionIconText}>{item.icon}</Text>
                </View>
                <View style={styles.modalTransactionDetails}>
                  <Text style={styles.modalTransactionTitle}>{item.title}</Text>
                  <Text style={styles.modalTransactionDate}>{item.date}</Text>
                </View>
                <Text
                  style={{
                    ...styles.modalTransactionAmount,
                    color:
                      item.type === 'credit'
                        ? BANKING_COLORS.success
                        : BANKING_COLORS.error,
                  }}
                >
                  {item.type === 'credit' ? '+' : '-'}${item.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: BANKING_COLORS.menuBg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: BANKING_COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: BANKING_COLORS.border,
    ...getShadowStyle(),
  },
  modalTitle: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '700',
    color: BANKING_COLORS.textPrimary,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BANKING_COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BANKING_COLORS.border,
  },
  modalCloseText: {
    color: BANKING_COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '300',
  },
  modalContent: {
    padding: 16,
    paddingBottom: 32,
  },
  modalTransactionItem: {
    backgroundColor: BANKING_COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalTransactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTransactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTransactionIconText: {
    fontSize: 22,
  },
  modalTransactionDetails: {
    flex: 1,
  },
  modalTransactionTitle: {
    color: BANKING_COLORS.textPrimary,
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalTransactionDate: {
    color: BANKING_COLORS.textSecondary,
    fontSize: isSmallDevice ? 12 : 13,
  },
  modalTransactionAmount: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '700',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingFooterText: {
    color: BANKING_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
