import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Briefcase, CreditCard, Truck, ArrowRight, ShieldCheck, Calendar, Clock } from 'lucide-react-native';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [projectName, setProjectName] = useState('');
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Morning (8AM-12PM)');

  // Auto-fill user email
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setCustomerName(user.user_metadata?.full_name || user.user_metadata?.name || '');
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!projectName || !customerName || !email || !phone || !shippingAddress || !pincode || !deliveryDate) {
      Alert.alert('Incomplete Form', 'Please complete all required fields before placing your order.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        cart,
        formData: {
          customerName,
          email,
          phone,
          shippingAddress,
          pincode,
          projectName,
          gstin,
          businessName,
          deliveryDate,
          deliverySlot,
          paymentMethod: 'Cash on Delivery'
        },
        userId: user?.id
      };

      // Call the live Next.js backend API directly to trigger secure validations, platform split, and Resend emails
      const response = await fetch('https://buildbazaar-two.vercel.app/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Success
      clearCart();
      Alert.alert(
        'Procurement Confirmed',
        `Your materials order has been successfully scheduled! Ref ID: ${data.orderId.substring(0, 8).toUpperCase()}`,
        [
          { 
            text: 'View Dashboard', 
            onPress: () => router.replace('/(tabs)/account') 
          }
        ]
      );
    } catch (err) {
      console.log('Order error:', err);
      Alert.alert('Sourcing Failure', err.message || 'Failed to connect to order pipeline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBackBtn}>
          <ChevronLeft color="#64748b" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Procurement Checkout</Text>
      </View>

      {/* Step Indicators */}
      <View style={styles.stepsContainer}>
        {[
          { id: 1, label: 'Project', icon: Briefcase },
          { id: 2, label: 'Tax', icon: CreditCard },
          { id: 3, label: 'Logistics', icon: Truck }
        ].map((s) => (
          <TouchableOpacity 
            key={s.id} 
            style={[styles.stepTab, step === s.id && styles.activeStepTab]}
            onPress={() => setStep(s.id)}
          >
            <Text style={[styles.stepTabText, step === s.id && styles.activeStepTabText]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step 1: Project Info */}
      {step === 1 && (
        <View style={styles.formCard}>
          <Text style={styles.sectionHeader}>Where are we building?</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Project / Site Name *</Text>
            <TextInput
              style={styles.input}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="e.g. Parkview Phase II"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Contact Person *</Text>
            <TextInput
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Full name of site manager"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Site Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@company.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Site Address *</Text>
            <TextInput
              style={[styles.input, { height: 80, paddingVertical: 10 }]}
              value={shippingAddress}
              onChangeText={setShippingAddress}
              placeholder="Plot No, Landmark, Sector, etc."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Pincode *</Text>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              placeholder="6-digit pincode"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
            <Text style={styles.nextBtnText}>SAVE & CONTINUE</Text>
            <ArrowRight color="#ffffff" size={16} />
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Tax & Billing */}
      {step === 2 && (
        <View style={styles.formCard}>
          <Text style={styles.sectionHeader}>Billing Intelligence</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Business / GSTIN (Optional)</Text>
            <TextInput
              style={[styles.input, { fontFamily: 'monospace', letterSpacing: 1 }]}
              value={gstin}
              onChangeText={setGstin}
              placeholder="22AAAAA0000A1Z5"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registered Business Name</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g. Skyline Construction Ltd."
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={styles.backBtnText}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtnHalf} onPress={() => setStep(3)}>
              <Text style={styles.nextBtnText}>NEXT STEP</Text>
              <ArrowRight color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Logistics */}
      {step === 3 && (
        <View style={styles.formCard}>
          <Text style={styles.sectionHeader}>Site Logistics</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Delivery Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.input}
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholder="e.g. 2026-06-15"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Unloading Slot *</Text>
            <TextInput
              style={styles.input}
              value={deliverySlot}
              onChangeText={setDeliverySlot}
              placeholder="Morning (8AM-12PM)"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.summaryHighlight}>
            <View style={styles.highlightHeader}>
              <ShieldCheck color="#ea580c" size={18} />
              <Text style={styles.highlightTitle}>Order Summary</Text>
            </View>
            <Text style={styles.highlightText}>
              Total Items: {totalItems}
            </Text>
            <Text style={styles.highlightTextBold}>
              Total Cost: ₹{totalPrice.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
              <Text style={styles.backBtnText}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.checkoutBtn, loading && styles.disabledBtn]} 
              onPress={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.checkoutBtnText}>FINALIZE ORDER</Text>
                  <ArrowRight color="#ffffff" size={16} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Padding spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  navBackBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  stepsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    justifyContent: 'space-between',
  },
  stepTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeStepTab: {
    borderBottomColor: '#ea580c',
  },
  stepTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  activeStepTabText: {
    color: '#ea580c',
  },
  formCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  nextBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  backBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#64748b',
    fontWeight: '800',
    fontSize: 14,
  },
  nextBtnHalf: {
    flex: 2,
    backgroundColor: '#ea580c',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  checkoutBtn: {
    flex: 2,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  summaryHighlight: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 20,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#7c2d12',
  },
  highlightText: {
    fontSize: 13,
    color: '#7c2d12',
    fontWeight: '600',
    marginBottom: 4,
  },
  highlightTextBold: {
    fontSize: 15,
    color: '#ea580c',
    fontWeight: '900',
  }
});
