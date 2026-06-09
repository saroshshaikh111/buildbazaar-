import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { Search, Star, Filter, Package, Building2, MapPin, ShoppingCart, User, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const mockProducts = [
  {
    id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', verified: true,
    tag: 'Best Seller', rating: 4.8, reviews: 2340, priceCurrent: 450, priceOld: 480,
    unit: 'per bag (50kg)', images: ['/products/cement.png'], category: 'Cement', origin_city: 'National'
  },
  {
    id: 'p2', title: 'Tata Tiscon TMT Bars 12mm', brand: 'Tata Steel', verified: true,
    tag: 'Top Rated', rating: 4.9, reviews: 1120, priceCurrent: 65500, priceOld: 68000,
    unit: 'per tonne', images: ['/products/tmt_bars.png'], category: 'Steel & TMT', origin_city: 'National'
  },
  {
    id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', verified: true,
    tag: 'Bulk Deal', rating: 4.3, reviews: 870, priceCurrent: 8, priceOld: 10,
    unit: 'per piece', images: ['/products/red_bricks.png'], category: 'Bricks & Blocks', origin_city: 'Delhi'
  },
  {
    id: 'p4', title: 'Finolex CPVC Pipes 1"', brand: 'Finolex', verified: true,
    tag: '', rating: 4.5, reviews: 560, priceCurrent: 245, priceOld: 280,
    unit: 'per 3m length', images: ['/products/cpvc_pipes.png'], category: 'Plumbing', origin_city: 'National'
  },
  {
    id: 'p5', title: 'Havells LifeLine Wire 1.5mm', brand: 'Havells', verified: true,
    tag: 'Popular', rating: 4.7, reviews: 1230, priceCurrent: 1450, priceOld: 1650,
    unit: 'per 90m coil', images: ['/products/electrical_wire.png'], category: 'Electricals', origin_city: 'National'
  },
  {
    id: 'p6', title: 'Asian Paints Ace Exterior', brand: 'Asian Paints', verified: true,
    tag: '', rating: 4.4, reviews: 980, priceCurrent: 2150, priceOld: 2500,
    unit: 'per 20 L', images: ['/products/paint_bucket.png'], category: 'Paint & Finishes', origin_city: 'Mumbai'
  }
];

const categories = ['All', 'Cement', 'Steel & TMT', 'Bricks & Blocks', 'Sand & Aggregates', 'Paint & Finishes', 'Plumbing', 'Electricals', 'Wood & Plywood'];

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const insets = useSafeAreaInsets();

  // Delivery Location State
  const [pincode, setPincode] = useState('110001');
  const [city, setCity] = useState('Delhi');
  
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

  // Parse deep-link incoming parameters
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category.toString());
    }
    if (params.search) {
      setSearchQuery(params.search.toString());
    }
  }, [params.category, params.search]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log("Supabase load products failed, using mock:", err);
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

  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
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

      {/* Premium Header */}
      <View style={[styles.customHeader, { paddingTop: insets.top }]}>
        <View style={styles.headerTopRow}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.logoContainer}>
              <Building2 color="#ea580c" size={24} style={{ marginRight: 6 }} />
              <Text style={styles.logoText}>
                Build<Text style={styles.orangeLogoText}>Bazaar</Text><Text style={styles.dotComText}>.com</Text>
              </Text>
            </TouchableOpacity>
          </Link>
          <View style={styles.headerRightContainer}>
            <Link href="/account" asChild>
              <TouchableOpacity style={styles.headerIconBtn}>
                <View pointerEvents="none"><User color="#ffffff" size={20} /></View>
              </TouchableOpacity>
            </Link>
            <Link href="/cart" asChild>
              <TouchableOpacity style={styles.headerCartBtn}>
                <View pointerEvents="none"><ShoppingCart color="#ffffff" size={20} /></View>
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
            />
            <TouchableOpacity style={styles.searchButton}>
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
      </View>

      {/* Category Chips Scroll */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.activeCategoryChip
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.activeCategoryChipText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Product List */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#ea580c" size="large" />
          <Text style={styles.loadingText}>Fetching database materials...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Package color="#94a3b8" size={48} />
          <Text style={styles.emptyText}>No materials match your query.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          key={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.itemCard}
              onPress={() => router.navigate(`/products/${item.id}`)}
            >
              {/* Card Header (Badges) */}
              <View style={styles.cardHeader}>
                <View style={styles.badgeColumn}>
                  {item.verified && (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck color="#16a34a" size={10} style={{ marginRight: 2 }} />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                  <View style={[
                    styles.shippingBadge, 
                    { backgroundColor: item.origin_city && item.origin_city !== 'National' ? '#fff7ed' : '#f1f5f9' }
                  ]}>
                    <Text style={[
                      styles.shippingText,
                      { color: item.origin_city && item.origin_city !== 'National' ? '#f97316' : '#64748b' }
                    ]}>
                      {item.origin_city && item.origin_city !== 'National' ? `SHIPS FROM ${item.origin_city.toUpperCase()}` : 'SHIPS NATIONWIDE'}
                    </Text>
                  </View>
                </View>
                {item.tag ? (
                  <View style={[
                    styles.tagBadge,
                    { backgroundColor: item.tag === 'Best Seller' ? '#fff7ed' : '#f0fdf4' }
                  ]}>
                    <Text style={[
                      styles.tagText,
                      { color: item.tag === 'Best Seller' ? '#ea580c' : '#16a34a' }
                    ]}>{item.tag}</Text>
                  </View>
                ) : <View />}
              </View>

              {/* Image Container */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: getImageUri(item.images?.[0]) }}
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.ratingRow}>
                <Star color="#eab308" fill="#eab308" size={12} style={{ marginRight: 4 }} />
                <Text style={styles.ratingText}>
                  <Text style={{fontWeight: '800', color: '#0f172a'}}>{item.rating || 0}</Text> ({item.reviews || 0} reviews)
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.priceContainer}>
                  <View style={styles.priceRowInner}>
                    <Text style={styles.itemPrice}>₹{item.priceCurrent?.toLocaleString('en-IN') || 0}</Text>
                    {item.priceOld && (
                      <Text style={styles.itemPriceOld}>₹{item.priceOld.toLocaleString('en-IN')}</Text>
                    )}
                  </View>
                  <Text style={styles.itemUnit}>{item.unit}</Text>
                </View>

                <TouchableOpacity
                  style={styles.cartButton}
                  onPress={() => {
                    addToCart(item, 1);
                    alert(`${item.title} added to cart!`);
                  }}
                >
                  <ShoppingCart color="#ea580c" size={16} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
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
  categoryScroll: {
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryChip: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  activeCategoryChipText: {
    color: '#ffffff',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#64748b',
    fontWeight: '700',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: (width - 40) / 2,
    padding: 12,
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  badgeColumn: {
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#16a34a',
  },
  shippingBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  shippingText: {
    fontSize: 7,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  imageContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 18,
    height: 36,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 10,
    color: '#64748b',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  priceContainer: {
    flex: 1,
  },
  priceRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  itemPriceOld: {
    fontSize: 10,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  itemUnit: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: '#f1f5f9',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
  }
});
