import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { Search, MapPin, Plus, Calculator, Star, AlertTriangle, ShoppingCart, User, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Mock Data Fallbacks
const mockCategories = [
  { id: 'c1', title: 'Cement', count: '120+ Products', bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af' },
  { id: 'c2', title: 'Steel & TMT', count: '85+ Products', bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
  { id: 'c3', title: 'Bricks & Blocks', count: '45+ Products', bg: '#fdf2f8', border: '#fbcfe8', color: '#9d174d' },
  { id: 'c4', title: 'Sand & Aggregates', count: '30+ Products', bg: '#fefbeb', border: '#fef08a', color: '#854d0e' },
  { id: 'c5', title: 'Paint & Finishes', count: '200+ Products', bg: '#faf5ff', border: '#e9d5ff', color: '#6b21a8' },
  { id: 'c6', title: 'Plumbing', count: '150+ Products', bg: '#ecfeff', border: '#a5f3fc', color: '#075985' },
  { id: 'c7', title: 'Electricals', count: '300+ Products', bg: '#fff7ed', border: '#ffedd5', color: '#c2410c' },
  { id: 'c8', title: 'Wood & Plywood', count: '60+ Products', bg: '#f0fdfa', border: '#99f6e4', color: '#0f766e' }
];

const mockProducts = [
  {
    id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', verified: true,
    tag: 'Best Seller', rating: 4.8, reviews: 2340, priceCurrent: 450, priceOld: 480,
    unit: 'per bag (50kg)', images: ['/products/cement.png'], category: 'Cement'
  },
  {
    id: 'p2', title: 'Tata Tiscon TMT Bars 12mm', brand: 'Tata Steel', verified: true,
    tag: 'Top Rated', rating: 4.9, reviews: 1120, priceCurrent: 65500, priceOld: 68000,
    unit: 'per tonne', images: ['/products/tmt_bars.png'], category: 'Steel & TMT'
  },
  {
    id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', verified: true,
    tag: 'Bulk Deal', rating: 4.3, reviews: 870, priceCurrent: 8, priceOld: 10,
    unit: 'per piece', images: ['/products/red_bricks.png'], category: 'Bricks & Blocks'
  },
  {
    id: 'p4', title: 'Finolex CPVC Pipes 1"', brand: 'Finolex', verified: true,
    tag: '', rating: 4.5, reviews: 560, priceCurrent: 245, priceOld: 280,
    unit: 'per 3m length', images: ['/products/cpvc_pipes.png'], category: 'Plumbing'
  }
];

export default function TabOneScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);

  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculator State
  const [calcArea, setCalcArea] = useState('');
  const [calcFloors, setCalcFloors] = useState('1');
  const [estimates, setEstimates] = useState(null);

  // Delivery Location State
  const [pincode, setPincode] = useState('110001');
  const [city, setCity] = useState('Delhi');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.navigate({
        pathname: '/products',
        params: { search: searchQuery.trim() }
      });
    }
  };

  // Modal state for pincode
  const [modalVisible, setModalVisible] = useState(false);
  const [tempPin, setTempPin] = useState('');
  const [loadingPin, setLoadingPin] = useState(false);

  const fetchCity = async (pin) => {
    setLoadingPin(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === "Success") {
        const cityName = data[0].PostOffice[0].District || data[0].PostOffice[0].State;
        setCity(cityName);
        setPincode(pin);
        setModalVisible(false);
      } else {
        alert(`Oops! Pincode ${pin} not found. Please try another.`);
      }
    } catch (err) {
      console.error("Pincode API failed:", err);
      alert("Network error. Please try again later.");
    } finally {
      setLoadingPin(false);
    }
  };

  const handleUpdatePincodeSubmit = () => {
    if (tempPin.length === 6 && /^\d+$/.test(tempPin)) {
      fetchCity(tempPin);
    } else {
      alert("Please enter a valid 6-digit numeric pincode.");
    }
  };

  const handleUpdatePincode = () => {
    setTempPin(pincode);
    setModalVisible(true);
  };

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log("Supabase fetch failed, using mock fallbacks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const getImageUri = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://buildbazaar-two.vercel.app${imagePath}`;
  };

  const calculateMaterials = () => {
    const area = parseFloat(calcArea);
    const floors = parseInt(calcFloors) || 1;
    if (!area || area <= 0) {
      alert('Please enter a valid built-up area.');
      return;
    }
    const totalArea = area * floors;
    setEstimates({
      cement: Math.ceil(totalArea * 0.4),
      steel: Math.ceil(totalArea * 4),
      sand: Math.ceil(totalArea * 1.8),
      bricks: Math.ceil(totalArea * 8)
    });
  };

  const addAllEstimatesToCart = () => {
    if (!estimates) return;
    
    const cementProduct = products.find(p => p.category === 'Cement') || {
      id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', priceCurrent: 450, unit: 'per bag (50kg)'
    };
    const steelProduct = products.find(p => p.category === 'Steel & TMT') || {
      id: 'p2', title: 'Tata Tiscon TMT Bars 12mm', brand: 'Tata Steel', priceCurrent: 65500, unit: 'per tonne'
    };
    const bricksProduct = products.find(p => p.category === 'Bricks & Blocks') || {
      id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', priceCurrent: 8, unit: 'per piece'
    };

    addToCart(cementProduct, estimates.cement);
    addToCart(steelProduct, Math.ceil(estimates.steel / 1000) || 1); // convert kg to tonne estimate
    addToCart(bricksProduct, estimates.bricks);

    alert('Material estimates successfully added to your cart!');
    setEstimates(null);
    setCalcArea('');
  };

  return (
    <View style={styles.mainContainer}>
      {/* Pincode Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter Delivery Pincode</Text>
            <Text style={styles.modalDesc}>
              Enter your 6-digit postal code to check supplier availability in your area.
            </Text>
            
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              maxLength={6}
              value={tempPin}
              onChangeText={setTempPin}
              placeholder="e.g. 110001"
              placeholderTextColor="#94a3b8"
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalCancelBtn]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalSubmitBtn]} 
                onPress={handleUpdatePincodeSubmit}
                disabled={loadingPin}
              >
                {loadingPin ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.modalSubmitBtnText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Top Header Bar (Fixed) */}
      <View style={[styles.customHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })} 
            style={styles.logoContainer}
          >
            <Building2 color="#ea580c" size={24} style={{ marginRight: 6 }} />
            <Text style={styles.logoText}>
              Build<Text style={styles.orangeLogoText}>Bazaar</Text><Text style={styles.dotComText}>.com</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.headerRightContainer}>
            <Link href="/account" asChild>
              <TouchableOpacity style={styles.headerIconBtn}>
                <View pointerEvents="none"><User color="#ffffff" size={20} /></View>
              </TouchableOpacity>
            </Link>
            <Link href="/cart" asChild>
              <TouchableOpacity style={styles.headerCartBtn}>
                <View pointerEvents="none"><ShoppingCart color="#ffffff" size={20} /></View>
                {totalItems > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{totalItems}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Search Row */}
        <View style={styles.headerSearchRow}>
          <View style={styles.searchBarContainer}>
            <Search color="#94a3b8" size={16} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search materials, brands, suppliers..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
              <Search color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Row */}
        <TouchableOpacity style={styles.headerLocationRow} onPress={handleUpdatePincode}>
          <MapPin color="#ea580c" size={13} style={{ marginRight: 4 }} />
          <Text style={styles.locationText}>
            Delivering to <Text style={styles.boldText}>{city} {pincode}</Text> <Text style={styles.orangeText}>• Change</Text>
          </Text>
        </TouchableOpacity>

        {/* Sub-Navbar (Horizontal Navigation List) */}
        <View style={styles.subNavbarContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.subNavbarScroll}
          >
            <Link href="/products" asChild>
              <TouchableOpacity style={styles.subNavAction}>
                <Text style={styles.subNavText}>All Materials</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/seller" asChild>
              <TouchableOpacity style={styles.subNavAction}>
                <Text style={[styles.subNavText, { color: '#ea580c' }]}>Sell on BuildBazaar</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.subNavAction} onPress={() => router.navigate('/products?category=Cement')}>
              <Text style={styles.subNavText}>Cement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavAction} onPress={() => router.navigate('/products?category=Steel%20%26%20TMT')}>
              <Text style={styles.subNavText}>Steel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavAction} onPress={() => router.navigate('/products?category=Bricks%20%26%20Blocks')}>
              <Text style={styles.subNavText}>Bricks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.subNavAction} onPress={() => {
              scrollViewRef.current?.scrollTo({ y: 550, animated: true });
            }}>
              <Text style={styles.subNavText}>Calculator</Text>
            </TouchableOpacity>
            <Link href="/account" asChild>
              <TouchableOpacity style={styles.subNavAction}>
                <Text style={styles.subNavText}>My Orders</Text>
              </TouchableOpacity>
            </Link>
          </ScrollView>
        </View>
      </View>

      <ScrollView ref={scrollViewRef} style={styles.container} keyboardShouldPersistTaps="handled">

        {/* Hero Banner Section */}
        <View style={styles.heroSection}>
          <View style={styles.marketBadge}>
            <Text style={styles.marketBadgeText}>MARKETPLACE</Text>
          </View>
          <Text style={styles.heroTitle}>
            Transparent Prices.{'\n'}
            <Text style={styles.orangeText}>Zero Hassle.</Text>
          </Text>
          <Text style={styles.heroSub}>
            India's trusted digital marketplace for construction materials.
          </Text>
          <View style={styles.heroActionRow}>
            <TouchableOpacity 
              style={styles.heroPrimaryBtn}
              onPress={() => router.navigate('/products')}
            >
              <Text style={styles.heroPrimaryBtnText}>Browse Materials</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.heroSecondaryBtn}
              onPress={() => alert('Watch Demo Video feature coming soon!')}
            >
              <Text style={styles.heroSecondaryBtnText}>Watch Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Horizontal Scroller */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Material Categories</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryScroll}
        >
          {mockCategories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.categoryChip, { backgroundColor: cat.bg, borderColor: cat.border }]}
              onPress={() => router.navigate(`/products?category=${encodeURIComponent(cat.title)}`)}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: '#ffffff', borderColor: cat.border }]}>
                <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.title.substring(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={[styles.categoryText, { color: cat.color }]} numberOfLines={1}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Materials</Text>
          <TouchableOpacity onPress={() => router.navigate('/products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#ea580c" size="large" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.productsGrid}>
            {products.slice(0, 4).map((prod) => (
              <TouchableOpacity 
                key={prod.id} 
                style={styles.productCard}
                onPress={() => router.navigate(`/products/${prod.id}`)}
              >
                <Image 
                  source={{ uri: getImageUri(prod.images?.[0]) }} 
                  style={styles.productImage} 
                  resizeMode="contain"
                />
                <Text style={styles.productBrand}>{prod.brand}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>{prod.title}</Text>
                
                <View style={styles.priceRow}>
                  <View>
                    <Text style={styles.productPrice}>₹{prod.priceCurrent.toLocaleString('en-IN')}</Text>
                    <Text style={styles.productUnit}>{prod.unit}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => {
                      addToCart(prod, 1);
                      alert(`${prod.title} added to cart!`);
                    }}
                  >
                    <Plus color="#ffffff" size={16} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Calculator Section */}
        <View style={styles.calcCard}>
          <View style={styles.calcHeader}>
            <Calculator color="#ea580c" size={24} />
            <Text style={styles.calcTitle}>Pro Material Calculator</Text>
          </View>
          <Text style={styles.calcDesc}>
            Estimate exact concrete, steel, and masonry counts needed for your build.
          </Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Built-up Area (sq.ft)</Text>
              <TextInput
                style={styles.calcInput}
                placeholder="e.g. 1000"
                keyboardType="numeric"
                value={calcArea}
                onChangeText={setCalcArea}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Floors</Text>
              <TextInput
                style={styles.calcInput}
                placeholder="e.g. 1"
                keyboardType="numeric"
                value={calcFloors}
                onChangeText={setCalcFloors}
              />
            </View>
          </View>

          {!estimates ? (
            <TouchableOpacity style={styles.calcBtn} onPress={calculateMaterials}>
              <Text style={styles.calcBtnText}>Calculate Estimates</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.resultsBox}>
              <Text style={styles.resultsTitle}>Estimated Materials Needed</Text>
              
              <View style={styles.resultsGrid}>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Cement</Text>
                  <Text style={styles.resultValue}>{estimates.cement} Bags</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Steel</Text>
                  <Text style={styles.resultValue}>{estimates.steel} Kg</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Sand</Text>
                  <Text style={styles.resultValue}>{estimates.sand} Cft</Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Bricks</Text>
                  <Text style={styles.resultValue}>{estimates.bricks} Pcs</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.addAllBtn} onPress={addAllEstimatesToCart}>
                <Text style={styles.addAllBtnText}>Add All Sourced Items to Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetBtn} onPress={() => setEstimates(null)}>
                <Text style={styles.resetBtnText}>Reset Estimator</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Padding at the bottom for scrolling stability */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingVertical: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orangeLogoText: {
    color: '#ea580c',
  },
  dotComText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerCartBtn: {
    padding: 4,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#ea580c',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  headerSearchRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingLeft: 12,
    height: 42,
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#ea580c',
    height: '100%',
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '800',
    color: '#ffffff',
  },
  orangeText: {
    color: '#ea580c',
    fontWeight: '700',
  },
  subNavbarContainer: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 8,
  },
  subNavbarScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  subNavAction: {
    paddingVertical: 2,
  },
  subNavText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  heroSection: {
    backgroundColor: '#0f172a',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  marketBadge: {
    backgroundColor: '#ea580c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  marketBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '900',
    lineHeight: 34,
    marginBottom: 8,
  },
  orangeText: {
    color: '#ea580c',
  },
  heroSub: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 18,
    fontWeight: '500',
  },
  heroActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroPrimaryBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPrimaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSecondaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#ea580c',
    fontWeight: '800',
  },
  categoryScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  categoryChip: {
    alignItems: 'center',
    marginRight: 12,
    width: 95,
    padding: 10,
    borderWidth: 1,
    borderRadius: 16,
  },
  categoryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '900',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: (width - 32) / 2,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ea580c',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    height: 36,
    lineHeight: 18,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  productUnit: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcCard: {
    backgroundColor: '#fff7ed',
    borderWidth: 2,
    borderColor: '#ffedd5',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
  },
  calcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calcTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#7c2d12',
    marginLeft: 8,
  },
  calcDesc: {
    fontSize: 13,
    color: '#7c2d12',
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    width: '47%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c2410c',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  calcInput: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#fed7aa',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  calcBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  calcBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  resultsBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7c2d12',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  addAllBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addAllBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  resetBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  resetBtnText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    fontWeight: '500',
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  modalCancelBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '800',
  },
  modalSubmitBtn: {
    backgroundColor: '#ea580c',
  },
  modalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
