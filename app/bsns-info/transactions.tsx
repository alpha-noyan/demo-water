import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { useBsns } from './context';
import { Ionicons } from '@expo/vector-icons';

const TransactionsScreen = () => {
  const { transactions, reverseTransaction, getTotalInvested, getTotalWithdrawn, totalPage, currentPage, setCurrentPage, fetchMoreTransactionsFromDB, loadingMore } = useBsns();

  const getStatusColor = (status) => {
    switch(status) {
      case 'invested': return '#27AE60';
      case 'withdrawn': return '#E74C3C';
      case 'reversed': return '#95A5A6';
      default: return '#7F8C8D';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'invested': return 'arrow-up-circle';
      case 'withdrawn': return 'arrow-down-circle';
      case 'reversed': return 'refresh-circle';
      default: return 'alert-circle';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatAmount = (amount) => {
    return `₨${amount.toLocaleString()}`;
  };

  const renderTransaction = ({ item, index }) => (
    <View style={[styles.transactionCard, item.status === 'reversed' && styles.reversedCard]}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={24} 
            color={getStatusColor(item.status)} 
          />
          <View>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <Text style={[
          styles.transactionAmount,
          item.type === 'credit' ? styles.creditAmount : styles.debitAmount
        ]}>
          {item.type === 'credit' ? '+' : '-'}{formatAmount(item.amount)}
        </Text>
      </View>
      
      <View style={styles.transactionFooter}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status !== 'reversed' && (
            <TouchableOpacity 
              style={styles.reverseButton}
              onPress={() => reverseTransaction(item.id)}
            >
              <Ionicons name="refresh-outline" size={18} color="#E74C3C" />
              <Text style={styles.reverseButtonText}>Reverse</Text>
            </TouchableOpacity>
          )}
          
          {/* <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteTransaction(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#E74C3C" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color="#BDC3C7" />
      <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
      <Text style={styles.emptyStateText}>Add some cash to get started</Text>
    </View>
  );

  const SummaryHeader = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Invested</Text>
        <Text style={[styles.summaryValue, styles.investedValue]}>
          {formatAmount(getTotalInvested())}
        </Text>
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Current Amount</Text>
        <Text style={[styles.summaryValue, styles.investedValue]}>
          {formatAmount(getTotalWithdrawn())}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SummaryHeader />
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if(currentPage < totalPage) {
            // fetch more transactions if available
            // fetchTransactionsFromDB(); // Uncomment this line to enable pagination
            console.log("Load more transactions..."); // Placeholder for pagination logic
            fetchMoreTransactionsFromDB(currentPage + 1);
            setCurrentPage(currentPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
      />
      {
        loadingMore && (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#7F8C8D' }}>Loading more transactions...</Text>
          </View>
        )
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  investedValue: {
    color: "#27AE60",
  },
  withdrawnValue: {
    color: "#E74C3C",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reversedCard: {
    opacity: 0.7,
    backgroundColor: "#F8FAFC",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  transactionDate: {
    fontSize: 12,
    color: "#95A5A6",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  creditAmount: {
    color: "#27AE60",
  },
  debitAmount: {
    color: "#E74C3C",
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  reverseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reverseButtonText: {
    fontSize: 12,
    color: "#E74C3C",
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#E74C3C",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 8,
  },
});

export default TransactionsScreen;