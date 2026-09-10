import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Building2, AlertTriangle, Smartphone, Mail } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  const { returnTo: rawReturnTo } = useLocalSearchParams();
  const returnTo = rawReturnTo || '/';
  
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('phone'); // default to phone
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const formatPhoneNumber = (num: string) => {
    let clean = (num || '').replace(/[\s\-\(\)]/g, '');
    if (!clean.startsWith('+')) {
      if (clean.length === 10) {
        clean = '+91' + clean;
      } else if (clean.length > 0 && !clean.startsWith('+')) {
        clean = '+' + clean;
      }
    }
    return clean;
  };

  const handleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'phone') {
        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone || formattedPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91...)');
        }

        if (!otpSent) {
          // Send OTP
          const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
          if (error) throw error;

          setOtpSent(true);
          setSuccessMsg(`OTP sent to ${formattedPhone}! Check your SMS.`);
        } else {
          // Verify OTP
          if (!otp.trim()) throw new Error('Please enter the 6-digit verification OTP');

          const { data, error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: otp.trim(),
            type: 'sms',
          });
          if (error) throw error;

          if (returnTo) {
            router.replace(returnTo.toString() as any);
          } else {
            router.replace('/(tabs)/account');
          }
        }
      } else {
        // Email Auth
        if (!email.trim() || !password) {
          throw new Error('Please enter both email and password.');
        }

        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (error) throw error;

          if (returnTo) {
            router.replace(returnTo.toString() as any);
          } else {
            router.replace('/(tabs)/account');
          }
        } else {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
          });
          if (error) throw error;

          Alert.alert(
            'Registration Successful',
            data?.session
              ? 'Your account has been created!'
              : 'Verification email sent! Check your inbox to confirm your account.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (data?.session) {
                    if (returnTo) {
                      router.replace(returnTo.toString() as any);
                    } else {
                      router.replace('/(tabs)/account');
                    }
                  } else {
                    setIsLogin(true);
                    setPassword('');
                  }
                },
              },
            ]
          );
        }
      }
    } catch (error: any) {
      console.log('Auth error:', error);
      setErrorMsg(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      {/* Brand Logo Header */}
      <View style={styles.header}>
        <Building2 color="#ea580c" size={36} />
        <Text style={styles.headerTitle}>BuildBazaar</Text>
      </View>

      {/* Main card box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {authMode === 'phone' ? 'Mobile Verification' : (isLogin ? 'Sign in' : 'Create account')}
        </Text>

        {/* Tab Switcher: Mobile No vs Email */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, authMode === 'phone' && styles.activeTab]}
            onPress={() => {
              setAuthMode('phone');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <Smartphone color={authMode === 'phone' ? '#0f172a' : '#64748b'} size={16} />
            <Text style={[styles.tabText, authMode === 'phone' && styles.activeTabText]}>Mobile No.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, authMode === 'email' && styles.activeTab]}
            onPress={() => {
              setAuthMode('email');
              setErrorMsg('');
              setSuccessMsg('');
            }}
          >
            <Mail color={authMode === 'email' ? '#0f172a' : '#64748b'} size={16} />
            <Text style={[styles.tabText, authMode === 'email' && styles.activeTabText]}>Email</Text>
          </TouchableOpacity>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <AlertTriangle color="#ef4444" size={16} style={styles.errorIcon} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Inputs */}
        {authMode === 'phone' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, otpSent && styles.disabledInput]}
                keyboardType="phone-pad"
                editable={!otpSent}
                value={phone}
                onChangeText={setPhone}
                placeholder="9876543210 or +91..."
                placeholderTextColor="#94a3b8"
              />
              {otpSent && (
                <TouchableOpacity
                  onPress={() => {
                    setOtpSent(false);
                    setOtp('');
                    setSuccessMsg('');
                  }}
                  style={styles.changeNumberBtn}
                >
                  <Text style={styles.changeNumberText}>Change Number</Text>
                </TouchableOpacity>
              )}
            </View>

            {otpSent && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>One-Time Password (OTP)</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#94a3b8"
                  maxLength={6}
                />
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholder="name@company.com"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                placeholder={!isLogin ? 'At least 6 characters' : '••••••••'}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </>
        )}

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.disabledBtn]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>
              {authMode === 'phone'
                ? (otpSent ? 'Verify OTP & Sign In' : 'Send Verification OTP')
                : (isLogin ? 'Sign In' : 'Create Account')}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.consentText}>
          By continuing, you agree to BuildBazaar's Conditions of Use and Privacy Notice. Gated secure credentials apply.
        </Text>
      </View>

      {/* Switch Toggle Box for Email Mode */}
      {authMode === 'email' && (
        <View style={styles.toggleContainer}>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>
              {isLogin ? 'New to BuildBazaar?' : 'Already have an account?'}
            </Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.toggleBtn}
            onPress={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
          >
            <Text style={styles.toggleBtnText}>
              {isLogin ? 'Create your BuildBazaar account' : 'Sign in to existing account'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    width: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#0f172a',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '600',
    lineHeight: 16,
  },
  successBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
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
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  otpInput: {
    borderColor: '#ea580c',
    textAlign: 'center',
    letterSpacing: 6,
    fontWeight: '800',
    fontSize: 18,
  },
  changeNumberBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  changeNumberText: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 8,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  consentText: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  toggleContainer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#cbd5e1',
  },
  dividerText: {
    fontSize: 11,
    color: '#64748b',
    paddingHorizontal: 10,
    fontWeight: '700',
  },
  toggleBtn: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  toggleBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  }
});
