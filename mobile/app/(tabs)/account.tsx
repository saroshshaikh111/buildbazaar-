import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, ClipboardList, LogOut, CheckCircle, Clock, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      setLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.log("Failed to load order history from Supabase:", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    setOrders([]);
    alert('Logged out successfully!');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Premium Header */}
      <View style={[styles.customHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/')} style={styles.logoContainer}>
            <Building2 color="#ea580c" size={20} style={{ marginRight: 6 }} />
            <Text style={styles.logoText}>
              Build<Text style={styles.orangeLogoText}>Bazaar</Text><Text style={styles.dotComText}>.com</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Pro Console</Text>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {!user ? (
          <View style={styles.loginGateBox}>
            <User color="#64748b" size={64} style={styles.gateIcon} />
            <Text style={styles.gateTitle}>Pro Sourcing Console</Text>
            <Text style={styles.gateDesc}>
              Log in to manage project allocations, save checkout details, and track dispatch shipments in real-time.
            </Text>
            <TouchableOpacity 
              style={styles.loginBtn}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.loginBtnText}>Log In or Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileBox}>
            {/* User Profile Info */}
            <View style={styles.userCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.email?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userRole}>CONTRACTOR CONSOLE</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut color="#ef4444" size={20} />
              </TouchableOpacity>
            </View>

            {/* Sourcing Order History */}
            <View style={styles.historyHeader}>
              <ClipboardList color="#0f172a" size={20} />
              <Text style={styles.historyTitle}>Procurement Log</Text>
            </View>

            {loadingOrders ? (
              <ActivityIndicator color="#ea580c" size="large" style={{ marginVertical: 20 }} />
            ) : orders.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No orders dispatched yet.</Text>
                <TouchableOpacity 
                  style={styles.startOrderBtn}
                  onPress={() => router.push('/(tabs)/products')}
                >
                  <Text style={styles.startOrderBtnText}>Start Sourcing Materials</Text>
                </TouchableOpacity>
              </View>
            ) : (
            <View style={styles.orderList}>
              {orders.map((order) => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={styles.orderCardHeader}>
                    <View>
                      <Text style={styles.orderIdText}>Order Ref: {order.id.substring(0, 8).toUpperCase()}</Text>
                      <Text style={styles.orderDateText}>
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      order.status === 'Delivered' ? styles.statusBadgeDelivered : styles.statusBadgeProcessing
                    ]}>
                      {order.status === 'Delivered' ? (
                        <CheckCircle color="#16a34a" size={12} />
                      ) : (
                        <Clock color="#ea580c" size={12} />
                      )}
                      <Text style={[
                        styles.statusBadgeText,
                        order.status === 'Delivered' ? styles.statusBadgeTextDelivered : styles.statusBadgeTextProcessing
                      ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>

                  {/* Order Items list preview */}
                  <View style={styles.orderItemsBox}>
                    {order.order_items?.map((item) => (
                      <Text key={item.id} style={styles.orderItemRow}>
                        • {item.title} <Text style={styles.dimText}>x {item.quantity}</Text>
                      </Text>
                    ))}
                  </View>

                  <View style={styles.orderCardFooter}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      Site: {order.shipping_address}
                    </Text>
                    <Text style={styles.totalPriceText}>
                      ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loginGateBox: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  gateIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  gateDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  loginBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  profileBox: {
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  userInfo: {
    flex: 1,
  },
  userRole: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 1.5,
  },
  userEmail: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoutBtn: {
    padding: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginLeft: 8,
  },
  emptyHistory: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    alignItems: 'center',
  },
  emptyHistoryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  startOrderBtn: {
    borderWidth: 1.5,
    borderColor: '#ea580c',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  startOrderBtnText: {
    color: '#ea580c',
    fontWeight: '800',
    fontSize: 13,
  },
  orderList: {
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderDateText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusBadgeProcessing: {
    backgroundColor: '#fff7ed',
  },
  statusBadgeDelivered: {
    backgroundColor: '#f0fdf4',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeTextProcessing: {
    color: '#ea580c',
  },
  statusBadgeTextDelivered: {
    color: '#16a34a',
  },
  orderItemsBox: {
    marginBottom: 12,
  },
  orderItemRow: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 4,
  },
  dimText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  totalPriceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ea580c',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  customHeader: {
    backgroundColor: '#0f172a', // Slate 900
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  orangeLogoText: {
    color: '#ea580c',
  },
  dotComText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  headerTitleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
