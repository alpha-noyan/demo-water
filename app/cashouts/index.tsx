import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const CashoutsScreen = () => {
  const [cashouts, setCashouts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState('all') // all, pending, returned
  const itemsPerPage = 5

  // Load cashouts from storage on start
  useEffect(() => {
    loadCashouts()
  }, [])

  const loadCashouts = async () => {
    try {
      // Load from AsyncStorage if needed
      // const saved = await AsyncStorage.getItem('cashouts')
      // if (saved) setCashouts(JSON.parse(saved))
      
      // Sample data for testing
      const sampleCashouts = [
        {
          id: 1,
          amount: 50000,
          reason: "Office Supplies",
          description: "Purchased stationery and printer cartridges",
          date: new Date().toISOString(),
          status: "completed",
          returnedAt: null,
        },
        {
          id: 2,
          amount: 25000,
          reason: "Travel Expenses",
          description: "Fuel and toll charges for business trip",
          date: new Date(Date.now() - 7 * 86400000).toISOString(),
          status: "completed",
          returnedAt: null,
        },
      ]
      setCashouts(sampleCashouts)
    } catch (error) {
      console.error("Error loading cashouts:", error)
    }
  }

  const saveCashouts = async (newCashouts) => {
    try {
      // Save to AsyncStorage
      // await AsyncStorage.setItem('cashouts', JSON.stringify(newCashouts))
    } catch (error) {
      console.error("Error saving cashouts:", error)
    }
  }

  const addCashout = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount")
      return
    }
    if (!reason.trim()) {
      Alert.alert("Invalid Reason", "Please enter a reason for cashout")
      return
    }

    const newCashout = {
      id: Date.now(),
      amount: parseFloat(amount),
      reason: reason.trim(),
      description: description.trim(),
      date: new Date().toISOString(),
      status: "completed",
      returnedAt: null,
    }

    const updatedCashouts = [newCashout, ...cashouts]
    setCashouts(updatedCashouts)
    saveCashouts(updatedCashouts)
    
    // Reset form
    setAmount('')
    setReason('')
    setDescription('')
    setShowModal(false)
    
    Alert.alert("Success", "Cashout recorded successfully!")
  }

  const returnCashout = (id) => {
    Alert.alert(
      "Return Cashout",
      "Are you sure you want to return this cashout amount?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Return",
          style: "destructive",
          onPress: () => {
            const updatedCashouts = cashouts.map(cashout =>
              cashout.id === id
                ? { 
                    ...cashout, 
                    status: "returned", 
                    returnedAt: new Date().toISOString() 
                  }
                : cashout
            )
            setCashouts(updatedCashouts)
            saveCashouts(updatedCashouts)
            Alert.alert("Success", "Cashout returned successfully!")
          }
        }
      ]
    )
  }

  const deleteCashout = (id) => {
    Alert.alert(
      "Delete Cashout",
      "Are you sure you want to delete this cashout record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedCashouts = cashouts.filter(cashout => cashout.id !== id)
            setCashouts(updatedCashouts)
            saveCashouts(updatedCashouts)
            Alert.alert("Success", "Cashout deleted successfully!")
          }
        }
      ]
    )
  }

  const getFilteredCashouts = () => {
    if (selectedFilter === 'all') return cashouts
    if (selectedFilter === 'pending') return cashouts.filter(c => c.status === 'pending')
    if (selectedFilter === 'returned') return cashouts.filter(c => c.status === 'returned')
    return cashouts
  }

  const getPaginatedCashouts = () => {
    const filtered = getFilteredCashouts()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(getFilteredCashouts().length / itemsPerPage)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const formatAmount = (amount) => {
    return `₨${amount.toLocaleString()}`
  }

  const getTotalCashouts = () => {
    return cashouts.reduce((sum, c) => sum + c.amount, 0)
  }

  const getTotalReturned = () => {
    return cashouts
      .filter(c => c.status === 'returned')
      .reduce((sum, c) => sum + c.amount, 0)
  }

  const getActiveCashouts = () => {
    return cashouts
      .filter(c => c.status !== 'returned')
      .reduce((sum, c) => sum + c.amount, 0)
  }

  const CashoutCard = ({ cashout }) => (
    <View style={[styles.cashoutCard, cashout.status === 'returned' && styles.returnedCard]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardAmount}>{formatAmount(cashout.amount)}</Text>
          <Text style={styles.cardReason}>{cashout.reason}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          cashout.status === 'returned' ? styles.returnedBadge : styles.completedBadge
        ]}>
          <Text style={styles.statusText}>
            {cashout.status === 'returned' ? 'Returned' : 'Active'}
          </Text>
        </View>
      </View>
      
      {cashout.description ? (
        <Text style={styles.cardDescription}>{cashout.description}</Text>
      ) : null}
      
      <View style={styles.cardFooter}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#7F8C8D" />
          <Text style={styles.cardDate}>{formatDate(cashout.date)}</Text>
        </View>
        
        <View style={styles.cardActions}>
          {cashout.status !== 'returned' && (
            <TouchableOpacity 
              style={styles.returnButton}
              onPress={() => returnCashout(cashout.id)}
            >
              <Ionicons name="refresh-outline" size={18} color="#27AE60" />
              <Text style={styles.returnButtonText}>Return</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteCashout(cashout.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#E74C3C" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cash-outline" size={64} color="#BDC3C7" />
      <Text style={styles.emptyStateTitle}>No Cashouts Yet</Text>
      <Text style={styles.emptyStateText}>
        Tap the + button to record your first cashout
      </Text>
    </View>
  )

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Cashout</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cashouts</Text>
            <Text style={styles.statValue}>{formatAmount(getTotalCashouts())}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active</Text>
            <Text style={[styles.statValue, styles.activeValue]}>{formatAmount(getActiveCashouts())}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Returned</Text>
            <Text style={[styles.statValue, styles.returnedValue]}>{formatAmount(getTotalReturned())}</Text>
          </View>
        </ScrollView>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilter]}
            onPress={() => {
              setSelectedFilter('all')
              setCurrentPage(1)
            }}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'pending' && styles.activeFilter]}
            onPress={() => {
              setSelectedFilter('pending')
              setCurrentPage(1)
            }}
          >
            <Text style={[styles.filterText, selectedFilter === 'pending' && styles.activeFilterText]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'returned' && styles.activeFilter]}
            onPress={() => {
              setSelectedFilter('returned')
              setCurrentPage(1)
            }}
          >
            <Text style={[styles.filterText, selectedFilter === 'returned' && styles.activeFilterText]}>
              Returned
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cashouts List */}
        <FlatList
          data={getPaginatedCashouts()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CashoutCard cashout={item} />}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Pagination */}
        {getFilteredCashouts().length > 0 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity 
              style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? "#BDC3C7" : "#005B9F"} />
              <Text style={[styles.paginationText, currentPage === 1 && styles.disabledText]}>
                Previous
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>
            
            <TouchableOpacity 
              style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <Text style={[styles.paginationText, currentPage === totalPages && styles.disabledText]}>
                Next
              </Text>
              <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? "#BDC3C7" : "#005B9F"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add Cashout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Cashout</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount *</Text>
                <TextInput
                  style={styles.textInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Enter amount"
                  placeholderTextColor="#BDC3C7"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Reason *</Text>
                <TextInput
                  style={styles.textInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="e.g., Office Supplies, Travel, etc."
                  placeholderTextColor="#BDC3C7"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Additional details about this cashout"
                  placeholderTextColor="#BDC3C7"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelModalButton} 
                  onPress={() => {
                    setShowModal(false)
                    setAmount('')
                    setReason('')
                    setDescription('')
                  }}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmModalButton} 
                  onPress={addCashout}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.confirmModalButtonText}>Record Cashout</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FD",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#7F8C8D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#005B9F",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#005B9F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#005B9F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statsScroll: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  activeValue: {
    color: "#005B9F",
  },
  returnedValue: {
    color: "#27AE60",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0F0FF",
  },
  activeFilter: {
    backgroundColor: "#005B9F",
    borderColor: "#005B9F",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7F8C8D",
  },
  activeFilterText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  cashoutCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  returnedCard: {
    backgroundColor: "#F8FAFC",
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  cardReason: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: "#E6F7FF",
  },
  returnedBadge: {
    backgroundColor: "#F0FFF4",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#005B9F",
  },
  cardDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#95A5A6",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  returnButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  returnButtonText: {
    fontSize: 12,
    color: "#27AE60",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#005B9F",
  },
  disabledText: {
    color: "#BDC3C7",
  },
  pageInfo: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 6,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0F0FF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  cancelModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#ECF0F1",
    alignItems: "center",
  },
  cancelModalButtonText: {
    color: "#7F8C8D",
    fontWeight: "600",
  },
  confirmModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#005B9F",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  confirmModalButtonText: {
    color: "white",
    fontWeight: "600",
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
    textAlign: "center",
  },
})

export default CashoutsScreen