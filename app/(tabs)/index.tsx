import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const DashboardCard = ({ title, icon, color, path }) => {
function goTo (path) {
    router.push(path)
  }
  return (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]} activeOpacity={0.8} onPress={()=>goTo(path)}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
)};

const index = () => {
  const menuItems = [
    { title: 'Business Information', icon: '🏢', color: '#E6F7FF',path: '/bsns-info' },
    { title: 'Stock', icon: '📦', color: '#E0F7FA', path:'asd' },
    { title: 'Employees', icon: '👥', color: '#B2EBF2', path:'asd' },
    { title: 'Sales', icon: '📈', color: '#80DEEA', path:'asd' },
    { title: 'Orders', icon: '🛒', color: '#4DD0E1', path:'asd' },
    { title: 'Wasooli', icon: '💰', color: '#26C6DA', path:'asd' },
    { title: 'Cashouts', icon: '💵', color: '#00BCD4', path:'asd' },
    { title: 'Vehicles', icon: '🚚', color: '#00ACC1', path:'asd' },
    { title: 'Other Expenses', icon: '📊', color: '#0097A7', path:'asd' },
  ];

  

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₨ 0</Text>
          <Text style={styles.statLabel}>Today's Sales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            color={item.color}
            path={item.path}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9FD', // Light grey-blue background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#7F8C8D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#005B9F', // Deep blue water
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D', // Grey water
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#7F8C8D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0F0FF',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#005B9F',
  },
  statLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
  },
});

export default index;