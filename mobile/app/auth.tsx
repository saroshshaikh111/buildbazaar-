import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';
import { Building2, AlertTriangle } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;

        // Redirect
        if (params.redirect) {
          router.replace(params.redirect.toString());
        } else {
          router.replace('/(tabs)/account');
        }
      } else {
        // Sign Up
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
                  if (params.redirect) {
                    router.replace(params.redirect.toString());
                  } else {
                    router.replace('/(tabs)/account');
                  }
                } else {
                  setIsLogin(true);
                  setPassword('');
                }
              } 
            }
          ]
        );
      }
    } catch (error) {
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
          {isLogin ? 'Sign in' : 'Create account'}
        </Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <AlertTriangle color="#ef4444" size={16} style={styles.errorIcon} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Inputs */}
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

        <TouchableOpacity 
          style={[styles.submitBtn, loading && styles.disabledBtn]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.consentText}>
          By continuing, you agree to BuildBazaar's Conditions of Use and Privacy Notice. Gated secure credentials apply.
        </Text>
      </View>

      {/* Switch Toggle Box */}
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
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
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
