import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { logout } from '../../redux/slices/authSlice';

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();

  const { user, subscription } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    await AsyncStorage.clear();

    dispatch(logout());

    navigation.replace('SignIn');
  };

  const currentPlanDuration = `${subscription?.plan?.duration_value || ''} ${
    subscription?.plan?.duration_unit || ''
  }`;

  const nextPlanDuration = `${
    subscription?.next_subscription?.plan?.duration_value || ''
  } ${subscription?.next_subscription?.plan?.duration_unit || ''}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#b30404" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}
        <LinearGradient
          colors={['#d10a0f', '#8f0205']}
          style={styles.header}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.welcome}>Welcome Back</Text>

              <Text style={styles.name}>
                {user?.first_name} {user?.last_name}
              </Text>
            </View>

            <TouchableOpacity style={styles.notificationBtn}>
              <Icon name="bell" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* PERSONAL INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>

            <View style={styles.iconCircle}>
              <Icon name="user" size={16} color="#c9060a" />
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>{user?.contact}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>
              {user?.city}, {user?.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>{user?.country}</Text>
          </View>
        </View>

        {/* CURRENT SUBSCRIPTION */}
        <View style={styles.subscriptionCard}>
          <LinearGradient
            colors={['#ffffff', '#fff5f5']}
            style={styles.subscriptionInner}
          >
            <View style={styles.subscriptionHeader}>
              <View>
                <Text style={styles.subscriptionTitle}>
                  Current Subscription
                </Text>

                <Text style={styles.planName}>
                  {subscription?.plan?.name}
                </Text>
              </View>

              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {currentPlanDuration}
                </Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>
                {subscription?.status}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailGrid}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Start Date</Text>

                <Text style={styles.detailValue}>
                  {subscription?.start_date}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>End Date</Text>

                <Text style={styles.detailValue}>
                  {subscription?.end_date}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Amount</Text>

                <Text style={styles.detailValue}>
                  ₹{subscription?.total_amount}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Plan Type</Text>

                <Text style={styles.detailValue}>
                  {subscription?.purchase_type || 'NEW'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* UPCOMING SUBSCRIPTION */}
        {subscription?.next_subscription && (
          <View style={styles.subscriptionCard}>
            <LinearGradient
              colors={['#ffffff', '#fff7f0']}
              style={styles.subscriptionInner}
            >
              <View style={styles.subscriptionHeader}>
                <View>
                  <Text style={styles.subscriptionTitle}>
                    Upcoming Subscription
                  </Text>

                  <Text style={styles.planName}>
                    {subscription?.next_subscription?.plan?.name}
                  </Text>
                </View>

                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>
                    {nextPlanDuration}
                  </Text>
                </View>
              </View>

              <View style={styles.pendingRow}>
                <Icon name="clock" size={14} color="#ff8a00" />

                <Text style={styles.pendingText}>
                  {subscription?.next_subscription?.status}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailGrid}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Starts</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.start_date}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Ends</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.end_date}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Amount</Text>

                  <Text style={styles.detailValue}>
                    ₹{subscription?.next_subscription?.total_amount}
                  </Text>
                </View>

                <View style={styles.detailBox}>
                  <Text style={styles.detailLabel}>Purchase</Text>

                  <Text style={styles.detailValue}>
                    {subscription?.next_subscription?.purchase_type}
                  </Text>
                </View>
              </View>

              <Text style={styles.gstText}>
                GST Included (18%)
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Icon name="log-out" size={18} color="#fff" />

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },

  scrollContainer: {
    paddingBottom: 40,
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },

  welcome: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },

  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },

  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 22,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoRow: {
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },

  value: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },

  subscriptionCard: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 4,
  },

  subscriptionInner: {
    padding: 20,
  },

  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  subscriptionTitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },

  planName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  durationBadge: {
    backgroundColor: '#c9060a',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  durationText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'capitalize',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#18b76a',
    marginRight: 8,
  },

  activeText: {
    color: '#18b76a',
    fontWeight: '700',
  },

  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  pendingText: {
    marginLeft: 8,
    color: '#ff8a00',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 18,
  },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  detailBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '700',
  },

  gstText: {
    marginTop: 6,
    color: '#888',
    fontSize: 12,
  },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: '#c9060a',
    borderRadius: 18,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
});