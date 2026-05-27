import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getUserInvoices, Invoice } from "./invoice";
import InvoiceCard from "../home/components/InvoiceCard";


export default function InvoiceScreen() {
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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#f8f9fa" }}>
        <ActivityIndicator size="large" color="#c9060a" />
        <Text style={{ textAlign: "center", marginTop: 10, color: "#666" }}>
          Fetching your billing history...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
       <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#333" }}>
            Invoices
          </Text>
       </View>
       <FlatList
          data={invoices}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <InvoiceCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#c9060a" // iOS spinner color
              colors={["#c9060a"]} // Android spinner color
            />
          }
        />
    </View>
  )
}