import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  Switch,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const Orders = () => {
  const router = useRouter();

  const products = [
    {
      id: "1",
      name: "500ml Water Bottle",
      price: 50,
    },
    {
      id: "2",
      name: "1L Water Bottle",
      price: 90,
    },
    {
      id: "3",
      name: "2L Water Bottle",
      price: 150,
    },
  ];

  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Form states
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [deliver, setDeliver] = useState(false);
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [deliveryCommission, setDeliveryCommission] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderStatus, setOrderStatus] = useState("pending");

  const itemsPerPage = 5;

  // Load orders from AsyncStorage on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Simulating loading from storage
    const storedOrders = [
      {
        id: "ORD001",
        clientName: "John Doe",
        clientAddress: "123 Main St",
        deliver: true,
        deliveryPerson: "Mike Driver",
        deliveryCommission: "50",
        products: [
          { name: "500ml Water Bottle", quantity: "2", price: 50 },
          { name: "1L Water Bottle", quantity: "1", price: 90 },
        ],
        totalBill: 190,
        date: "2024-01-15 10:30:00",
        status: "pending"
      },
      {
        id: "ORD002",
        clientName: "Jane Smith",
        clientAddress: "456 Oak Ave",
        deliver: false,
        deliveryPerson: "",
        deliveryCommission: "",
        products: [
          { name: "2L Water Bottle", quantity: "3", price: 150 },
        ],
        totalBill: 450,
        date: "2024-01-16 14:20:00",
        status: "in-progress"
      },
      {
        id: "ORD003",
        clientName: "Bob Johnson",
        clientAddress: "789 Pine Rd",
        deliver: true,
        deliveryPerson: "Sarah Driver",
        deliveryCommission: "30",
        products: [
          { name: "500ml Water Bottle", quantity: "5", price: 50 },
          { name: "2L Water Bottle", quantity: "2", price: 150 },
        ],
        totalBill: 580,
        date: "2024-01-17 09:15:00",
        status: "ready"
      },
      {
        id: "ORD004",
        clientName: "Alice Brown",
        clientAddress: "321 Elm St",
        deliver: true,
        deliveryPerson: "Tom Driver",
        deliveryCommission: "40",
        products: [
          { name: "1L Water Bottle", quantity: "4", price: 90 },
        ],
        totalBill: 400,
        date: "2024-01-18 16:45:00",
        status: "delivered"
      },
    ];
    setOrders(storedOrders);
  };

  // Filtered orders based on status
  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter(order => order.status === filterStatus);
  }, [orders, filterStatus]);

  // Paginated orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Reset form
  const resetForm = () => {
    setClientName("");
    setClientAddress("");
    setDeliver(false);
    setDeliveryPerson("");
    setDeliveryCommission("");
    setSelectedProducts([]);
    setQuantities({});
    setOrderStatus("pending");
    setEditingOrder(null);
  };

  // Select Product
  const toggleProduct = (product) => {
    const exists = selectedProducts.find((p) => p.id === product.id);

    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
      const updated = { ...quantities };
      delete updated[product.id];
      setQuantities(updated);
    } else {
      setSelectedProducts([...selectedProducts, product]);
      setQuantities({ ...quantities, [product.id]: "" });
    }
  };

  // Quantity Change
  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  // Total Bill
  const totalBill = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((product) => {
      const quantity = Number(quantities[product.id]) || 0;
      total += quantity * product.price;
    });
    if (deliver) {
      total += Number(deliveryCommission) || 0;
    }
    return total;
  }, [selectedProducts, quantities, deliveryCommission, deliver]);

  // Create or Update Order
  const handleSaveOrder = () => {
    if (!clientName.trim()) {
      Alert.alert("Missing Client", "Please enter client name.");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("No Products", "Please select products.");
      return;
    }

    const hasEmptyQuantity = selectedProducts.some(
      (product) => !quantities[product.id]
    );

    if (hasEmptyQuantity) {
      Alert.alert("Missing Quantity", "Please enter product quantities.");
      return;
    }

    if (deliver && !deliveryPerson) {
      Alert.alert("Missing Delivery Person", "Please enter delivery person name.");
      return;
    }

    if (editingOrder) {
      // Update existing order
      const updatedOrders = orders.map(order =>
        order.id === editingOrder.id
          ? {
              ...order,
              clientName,
              clientAddress,
              deliver,
              deliveryPerson,
              deliveryCommission,
              products: selectedProducts.map((product) => ({
                name: product.name,
                quantity: quantities[product.id],
                price: product.price,
              })),
              totalBill,
              status: orderStatus,
            }
          : order
      );
      setOrders(updatedOrders);
      Alert.alert("Success", "Order updated successfully.");
    } else {
      // Create new order
      const newOrder = {
        id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
        clientName,
        clientAddress,
        deliver,
        deliveryPerson,
        deliveryCommission,
        products: selectedProducts.map((product) => ({
          name: product.name,
          quantity: quantities[product.id],
          price: product.price,
        })),
        totalBill,
        date: new Date().toLocaleString(),
        status: orderStatus,
      };
      setOrders([newOrder, ...orders]);
      Alert.alert("Success", "Order created successfully.");
    }

    resetForm();
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    Alert.alert("Status Updated", `Order status changed to ${newStatus}`);
  };

  // Edit order
  const editOrder = (order) => {
    setEditingOrder(order);
    setClientName(order.clientName);
    setClientAddress(order.clientAddress);
    setDeliver(order.deliver);
    setDeliveryPerson(order.deliveryPerson || "");
    setDeliveryCommission(order.deliveryCommission || "");
    setOrderStatus(order.status);
    
    // Reconstruct selected products and quantities
    const selected = [];
    const qty = {};
    order.products.forEach(product => {
      const foundProduct = products.find(p => p.name === product.name);
      if (foundProduct) {
        selected.push(foundProduct);
        qty[foundProduct.id] = product.quantity;
      }
    });
    setSelectedProducts(selected);
    setQuantities(qty);
    
    setEditModalVisible(true);
  };

  // Delete order
  const deleteOrder = (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setOrders(orders.filter(order => order.id !== orderId));
            Alert.alert("Success", "Order deleted successfully.");
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#F59E0B';
      case 'in-progress': return '#3B82F6';
      case 'ready': return '#10B981';
      case 'delivered': return '#8B5CF6';
      default: return '#64748B';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'ready': return 'Ready';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const renderOrderCard = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.clientName}>{item.clientName}</Text>
      {item.clientAddress ? <Text style={styles.clientAddress}>{item.clientAddress}</Text> : null}
      
      <View style={styles.orderProducts}>
        {item.products.map((product, idx) => (
          <Text key={idx} style={styles.productItem}>
            {product.quantity}x {product.name} @ ₨{product.price}
          </Text>
        ))}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>Total: ₨ {item.totalBill}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => editOrder(item)}
          >
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => deleteOrder(item.id)}
          >
            <Text style={styles.actionBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statusUpdate}>
        <Text style={styles.updateStatusLabel}>Update Status:</Text>
        <View style={styles.statusButtons}>
          {['pending', 'in-progress', 'ready', 'delivered'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                item.status === status && styles.statusOptionActive,
                { backgroundColor: item.status === status ? getStatusColor(status) : '#E2E8F0' }
              ]}
              onPress={() => updateOrderStatus(item.id, status)}
            >
              <Text style={[
                styles.statusOptionText,
                item.status === status && styles.statusOptionTextActive
              ]}>
                {getStatusText(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#DDF6FF" barStyle="dark-content" />

      <FlatList
        data={paginatedOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Orders</Text>
                <Text style={styles.headerSubtitle}>Manage your orders</Text>
              </View>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => {
                  resetForm();
                  setEditModalVisible(true);
                }}
              >
                <Text style={styles.createButtonText}>+ New Order</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Filter by Status:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {['all', 'pending', 'in-progress', 'ready', 'delivered'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterButton,
                      filterStatus === status && styles.filterButtonActive,
                    ]}
                    onPress={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                    }}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      filterStatus === status && styles.filterButtonTextActive,
                    ]}>
                      {status === 'all' ? 'All' : getStatusText(status)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Stats Summary */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{orders.filter(o => o.status === 'pending').length}</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{orders.filter(o => o.status === 'in-progress').length}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{orders.filter(o => o.status === 'ready').length}</Text>
                <Text style={styles.statLabel}>Ready</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{orders.filter(o => o.status === 'delivered').length}</Text>
                <Text style={styles.statLabel}>Delivered</Text>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          orders.length > 0 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 1 && styles.pageButtonDisabled]}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === totalPages && styles.pageButtonDisabled]}
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Create/Edit Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingOrder ? "Edit Order" : "Create New Order"}
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Order Form - Same as sales but with status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Details</Text>
              <View style={styles.card}>
                <Text style={styles.label}>Client Name</Text>
                <TextInput
                  placeholder="Enter Client Name"
                  placeholderTextColor="#94A3B8"
                  value={clientName}
                  onChangeText={setClientName}
                  style={styles.input}
                />

                <Text style={styles.label}>Client Address</Text>
                <TextInput
                  placeholder="Enter Client Address"
                  placeholderTextColor="#94A3B8"
                  value={clientAddress}
                  onChangeText={setClientAddress}
                  style={styles.input}
                />

                <Text style={styles.label}>Order Status</Text>
                <View style={styles.statusPicker}>
                  {['pending', 'in-progress', 'ready', 'delivered'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusOptionModal,
                        orderStatus === status && { backgroundColor: getStatusColor(status) }
                      ]}
                      onPress={() => setOrderStatus(status)}
                    >
                      <Text style={[
                        styles.statusOptionModalText,
                        orderStatus === status && styles.statusOptionModalTextActive
                      ]}>
                        {getStatusText(status)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.deliveryToggle}>
                  <Text style={styles.deliveryText}>Deliver</Text>
                  <Switch
                    value={deliver}
                    onValueChange={setDeliver}
                    trackColor={{ false: "#CBD5E1", true: "#38BDF8" }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {deliver && (
                  <>
                    <Text style={styles.label}>Delivery Person Name</Text>
                    <TextInput
                      placeholder="Enter Delivery Person Name"
                      placeholderTextColor="#94A3B8"
                      value={deliveryPerson}
                      onChangeText={setDeliveryPerson}
                      style={styles.input}
                    />

                    <Text style={styles.label}>Delivery Commission</Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={deliveryCommission}
                      onChangeText={setDeliveryCommission}
                      style={styles.input}
                    />
                  </>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Products</Text>
              <View style={styles.productsContainer}>
                {products.map((product) => {
                  const active = selectedProducts.find((p) => p.id === product.id);
                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[styles.productButton, active && styles.productButtonActive]}
                      onPress={() => toggleProduct(product)}
                    >
                      <Text style={[styles.productButtonText, active && styles.productButtonTextActive]}>
                        {product.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {selectedProducts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Quantities</Text>
                {selectedProducts.map((product) => (
                  <View key={product.id} style={styles.quantityCard}>
                    <View style={styles.quantityTop}>
                      <Text style={styles.quantityTitle}>{product.name}</Text>
                      <Text style={styles.priceText}>₨ {product.price}</Text>
                    </View>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={quantities[product.id]}
                      onChangeText={(value) => handleQuantityChange(product.id, value)}
                      style={styles.input}
                    />
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Total Bill</Text>
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>Order Total</Text>
                <Text style={styles.totalAmount}>₨ {totalBill}</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrder}>
                <Text style={styles.buttonText}>{editingOrder ? "Update" : "Create"} Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#DDF6FF",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 15,
  },
  createButton: {
    backgroundColor: "#38BDF8",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: "#38BDF8",
  },
  filterButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  orderDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  clientAddress: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 12,
  },
  orderProducts: {
    marginBottom: 12,
  },
  productItem: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0284C7",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: "#3B82F6",
  },
  deleteBtn: {
    backgroundColor: "#EF4444",
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  statusUpdate: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
  },
  updateStatusLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusOptionActive: {
    opacity: 1,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
  statusOptionTextActive: {
    color: "#FFFFFF",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    gap: 16,
  },
  pageButton: {
    backgroundColor: "#38BDF8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: "#CBD5E1",
    opacity: 0.5,
  },
  pageButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: 14,
    color: "#64748B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#F4F8FB",
    margin: 20,
    borderRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalClose: {
    fontSize: 24,
    color: "#64748B",
    fontWeight: "600",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#EFF6FB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 18,
  },
  deliveryToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },
  statusOptionModal: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  statusOptionModalText: {
    color: "#334155",
    fontWeight: "600",
  },
  statusOptionModalTextActive: {
    color: "#FFFFFF",
  },
  productsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  productButton: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  productButtonActive: {
    backgroundColor: "#38BDF8",
  },
  productButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  productButtonTextActive: {
    color: "#FFFFFF",
  },
  quantityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  quantityTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  quantityTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  priceText: {
    color: "#0284C7",
    fontWeight: "700",
  },
  totalCard: {
    backgroundColor: "#DDF6FF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  totalLabel: {
    color: "#64748B",
    fontSize: 15,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0284C7",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 14,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#38BDF8",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelText: {
    color: "#334155",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default Orders;