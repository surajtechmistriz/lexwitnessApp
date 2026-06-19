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
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInvoices, Invoice } from "./invoice";
import InvoiceCard from "../home/components/InvoiceCard";
import { useTheme } from "../../redux/useTheme";

export default function InvoiceScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
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
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.emptyBackButton, { 
            backgroundColor: colors.card,
            shadowColor: isDark ? '#000' : '#000',
          }]} 
          onPress={handleBack}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Invoices</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          You haven't made any purchases yet.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
          Fetching your billing history...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/*  BACK BUTTON */}
      <TouchableOpacity 
        style={[styles.backButton, { 
          backgroundColor: colors.card,
          shadowColor: isDark ? '#000' : '#000',
        }]} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Invoices</Text>
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
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  //  BACK BUTTON STYLES
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  },

  listContent: {
    paddingBottom: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },

  loaderText: {
    textAlign: "center",
    marginTop: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyBackButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    borderRadius: 30,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});