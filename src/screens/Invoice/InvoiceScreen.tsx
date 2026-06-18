import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons'; //  ADDED
import { getUserInvoices, Invoice } from "./invoice";
import InvoiceCard from "../home/components/InvoiceCard";

export default function InvoiceScreen() {
  const navigation = useNavigation<any>();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      const res = await getUserInvoices();

      if (res.status) {
        setInvoices(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  //  BACK BUTTON
  const handleBack = () => {
    navigation.goBack();
  };

  //  Empty State
  if (!loading && invoices.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity 
          style={styles.emptyBackButton} 
          onPress={handleBack}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyTitle}>No Invoices</Text>
        <Text style={styles.emptySubtitle}>
          You haven't made any purchases yet.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c9060a" />
        <Text style={styles.loaderText}>
          Fetching your billing history...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*  BACK BUTTON */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invoices</Text>
      </View>

      <FlatList
        data={invoices}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <InvoiceCard item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#c9060a"
            colors={["#c9060a"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  //  BACK BUTTON STYLES
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
  },

  listContent: {
    paddingBottom: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },

  loaderText: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 30,
  },

  emptyBackButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});