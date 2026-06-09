import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { View, Platform } from 'react-native';
import { Home, Package, ShoppingCart, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useCart } from '../../context/CartContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const activeColor = '#ea580c'; // Premium construction orange

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        headerStyle: {
          backgroundColor: '#0f172a', // Slate 900
          borderBottomWidth: 1,
          borderBottomColor: '#1e293b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 20,
          letterSpacing: -0.5,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 12,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'BuildBazaar',
          tabBarIcon: ({ color }) => <View pointerEvents="none"><Home color={color} size={24} /></View>,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Materials',
          headerTitle: 'Materials Hub',
          tabBarIcon: ({ color }) => <View pointerEvents="none"><Package color={color} size={24} /></View>,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerTitle: 'Procurement Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#ea580c',
            color: 'white',
            fontSize: 10,
            fontWeight: '800',
          },
          tabBarIcon: ({ color }) => <View pointerEvents="none"><ShoppingCart color={color} size={24} /></View>,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          headerTitle: 'Pro Console',
          tabBarIcon: ({ color }) => <View pointerEvents="none"><User color={color} size={24} /></View>,
        }}
      />
    </Tabs>
  );
}
