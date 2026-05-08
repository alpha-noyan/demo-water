import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Package,
  ArrowDownToLine,
  Boxes,
  ReceiptText,
  ChevronRight,
} from "lucide-react-native";

const Index = () => {
  const router = useRouter();

  const menuItems = [
    {
      id: "1",
      title: "Raw Items",
      subtitle: "Manage raw materials inventory",
      icon: Package,
      route: "/stock/raw",
    },
    {
      id: "2",
      title: "Inbound",
      subtitle: "Track incoming stock items",
      icon: ArrowDownToLine,
      route: "/stock/inbound",
    },
    {
      id: "3",
      title: "Ready Items",
      subtitle: "Manage finished products",
      icon: Boxes,
      route: "/stock/ready",
    },
    {
      id: "4",
      title: "Transactions",
      subtitle: "View stock transaction history",
      icon: ReceiptText,
      route: "/stock/transactions",
    },
  ];

  const renderItem = ({ item }) => {
    const Icon = item.icon;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => router.push(item.route)}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Icon size={24} color="#0284C7" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>
              {item.title}
            </Text>

            <Text style={styles.cardSubtitle}>
              {item.subtitle}
            </Text>
          </View>
        </View>

        <ChevronRight
          size={22}
          color="#94A3B8"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#DDF6FF"
        barStyle="dark-content"
      />

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                Stock Menu
              </Text>

              <Text style={styles.headerSubtitle}>
                Water Plant Stock Management
              </Text>
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Stock Categories
              </Text>

              <Text style={styles.sectionCount}>
                {menuItems.length} Modules
              </Text>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8FB",
  },

  header: {
    backgroundColor: "#DDF6FF",
    padding: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 24,
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

  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  sectionCount: {
    color: "#0284C7",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,

    elevation: 3,
  },

  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
});