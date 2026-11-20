import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserInvoices } from '../../services/invoice.service';
import type { Invoice } from '../../types/invoice.types';
import InvoiceCard from '../home/components/InvoiceCard';
import { useTheme } from '../../store/hooks/useTheme';

export default function InvoiceScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

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

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: '#D32F2F' }]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* This inner View keeps the button inside the safe area. */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Invoices
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loaderText, { color: colors.textSecondary }]}>
              Fetching your billing history...
            </Text>
          </View>
        ) : (
          <FlatList
            data={invoices}
            contentContainerStyle={[
              styles.listContent,
              invoices.length === 0 && styles.emptyList,
            ]}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <InvoiceCard item={item} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📄</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No Invoices
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  You haven't made any purchases yet.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 68,
    paddingBottom: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },

  listContent: {
    paddingBottom: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    textAlign: 'center',
    marginTop: 10,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
