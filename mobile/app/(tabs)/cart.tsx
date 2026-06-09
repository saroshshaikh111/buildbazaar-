import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, ShoppingCart, Plus, Minus, ArrowRight, ShieldCheck, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const insets = useSafeAreaInsets();

  const getImageUri = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://buildbazaar-two.vercel.app${imagePath}`;
  };

  const handleCheckoutRedirect = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Sourced products first!');
      return;
    }
    if (user) {
      router.push('/checkout');
    } else {
      Alert.alert(
        'Authentication Required',
        'You need to log in to complete your procurement checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Log In / Register', 
            onPress: () => router.push('/auth?redirect=/checkout') 
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={[styles.customHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/')} style={styles.logoContainer}>
            <Building2 color="#ea580c" size={20} style={{ marginRight: 6 }} />
            <Text style={styles.logoText}>
              Build<Text style={styles.orangeLogoText}>Bazaar</Text><Text style={styles.dotComText}>.com</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Procurement Cart</Text>
        </View>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <ShoppingCart color="#94a3b8" size={64} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>Your Procurement Cart is Empty</Text>
          <Text style={styles.emptyDesc}>
            Add cement, steel, pipes, or paint from the marketplace directory to start your order.
          </Text>
          <TouchableOpacity 
            style={styles.browseBtn} 
            onPress={() => router.push('/(tabs)/products')}
          >
            <Text style={styles.browseBtnText}>Browse Materials</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cartContent}>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.cartCard}>
                <Image
                  source={{ uri: getImageUri(item.images?.[0]) }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
                
                <View style={styles.cardInfo}>
                  <Text style={styles.cardBrand}>{item.brand}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardPrice}>₹{item.priceCurrent.toLocaleString('en-IN')} / {item.unit.split(' ')[1] || 'unit'}</Text>
                  
                  {/* Quantity Modifier */}
                  <View style={styles.quantityRow}>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Minus color="#475569" size={14} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Plus color="#475569" size={14} />
                    </TouchableOpacity>

                    <Text style={styles.totalItemPrice}>
                      ₹{(item.priceCurrent * item.quantity).toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>

                {/* Remove button */}
                <TouchableOpacity 
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <Trash2 color="#ef4444" size={18} />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Sourcing Summary footer */}
          <View style={styles.footerBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items Sourced:</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Cost Estimate:</Text>
              <Text style={styles.summaryValueBold}>₹{totalPrice.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.securityRow}>
              <ShieldCheck color="#16a34a" size={14} />
              <Text style={styles.securityText}>Gated secure checkout powered by Supabase Auth</Text>
            </View>

            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={handleCheckoutRedirect}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Secure Checkout</Text>
              <ArrowRight color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  browseBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  cartContent: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 2,
  },
  cardPrice: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginHorizontal: 10,
  },
  totalItemPrice: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  removeBtn: {
    padding: 8,
    marginLeft: 8,
  },
  footerBox: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '800',
  },
  summaryValueBold: {
    fontSize: 18,
    color: '#ea580c',
    fontWeight: '900',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  securityText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '700',
    marginLeft: 4,
  },
  checkoutBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
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
