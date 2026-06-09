import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Polyfill WebSocket for Node.js SSR environments (Expo Export / Static Render)
if (typeof window === 'undefined' && typeof global !== 'undefined' && !global.WebSocket) {
  global.WebSocket = class DummyWebSocket {
    constructor() {}
    close() {}
    send() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing from EXPO_PUBLIC environment variables.');
}

// Custom storage wrapper to handle SSR window checks safely
const customStorage = {
  getItem: async (key) => {
    if (typeof window === 'undefined') return null;
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.error('customStorage setItem error:', e);
    }
  },
  removeItem: async (key) => {
    if (typeof window === 'undefined') return;
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.error('customStorage removeItem error:', e);
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
