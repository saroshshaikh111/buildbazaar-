import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Modal, ActivityIndicator, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { TrendingUp, Package, PackageOpen, DollarSign, Clock, Plus, X, Building2, ChevronLeft, Search, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', fileUri: null, originCity: 'National', deliverySpeed: 'Standard (3-5 Days)'
  });
  const [uploading, setUploading] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [onboardingData, setOnboardingData] = useState({ businessName: '', warehouseCity: '' });

  useEffect(() => {
    if (!user) {
      router.replace('/auth?redirect=/seller');
      return;
    }

    const adminEmail = 'admin@buildbazaar.com';
    const userEmail = (user?.email || '').toLowerCase();
    const isAdmin = adminEmail && userEmail === adminEmail;

    const warehouseCity = user.user_metadata?.warehouse_city;
    if (isAdmin || warehouseCity) {
      setIsAuthorized(true);
    }

    async function fetchData() {
      try {
        let ordersQuery = supabase.from('orders').select('*, order_items(*)');
        let productsQuery = supabase.from('products').select('*');

        if (!isAdmin) {
          ordersQuery = ordersQuery.eq('user_id', user.id);
          productsQuery = productsQuery.eq('seller_id', user.id);
        }

        const [ordersRes, productsRes] = await Promise.all([
          ordersQuery.order('created_at', { ascending: false }),
          productsQuery.order('created_at', { ascending: false })
        ]);
        
        if (ordersRes.data) setOrders(ordersRes.data);
        if (productsRes.data) setProducts(productsRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (user && (isAuthorized || (user.email.toLowerCase() === adminEmail))) {
      fetchData();
    } else if (user) {
      setLoading(false);
    }
  }, [user, isAuthorized]);

  const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, order) => sum + Number(order.vendor_payout || order.total_amount || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'Processing').length;

  const handleOnboarding = async () => {
    if (!onboardingData.businessName || !onboardingData.warehouseCity) {
      Alert.alert('Required', 'Please fill in all details to activate your seller account.');
      return;
    }
    setUploading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          business_name: onboardingData.businessName,
          warehouse_city: onboardingData.warehouseCity 
        }
      });
      if (error) throw error;
      setIsAuthorized(true);
      setLoading(true); // Trigger re-fetch
    } catch (err) {
      Alert.alert('Onboarding Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      Alert.alert('Success', `Order marked as ${newStatus}`);
    } else {
      Alert.alert("Error updating status", error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewProduct({ ...newProduct, fileUri: result.assets[0].uri });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.priceCurrent || !newProduct.brand || !newProduct.unit) {
      Alert.alert('Missing Fields', 'Please fill in all required product fields.');
      return;
    }

    setUploading(true);
    let imageUrl = '';

    try {
      if (newProduct.fileUri) {
        // Prepare file for upload
        const fileExt = newProduct.fileUri.split('.').pop() || 'jpeg';
        const fileName = `${Math.random()}.${fileExt}`;
        const formData = new FormData();
        formData.append('file', {
          uri: newProduct.fileUri,
          name: fileName,
          type: `image/${fileExt}`,
        });

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, formData, {
            contentType: `image/${fileExt}`
          });

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const payload = {
        title: newProduct.title,
        brand: newProduct.brand,
        category: newProduct.category,
        priceCurrent: Number(newProduct.priceCurrent),
        priceOld: newProduct.priceOld ? Number(newProduct.priceOld) : null,
        unit: newProduct.unit,
        verified: true,
        seller_id: user.id,
        origin_city: newProduct.originCity || user.user_metadata?.warehouse_city || 'National',
        delivery_speed: newProduct.deliverySpeed || 'Standard (3-5 Days)'
      };
      
      if (imageUrl) {
        payload.images = [imageUrl];
      } else if (!editingProductId) {
        payload.images = [];
      }

      if (editingProductId) {
        const { data: updatedData, error: dbError } = await supabase.from('products').update(payload).eq('id', editingProductId).select();
        if (dbError) throw dbError;
        if (updatedData) {
          setProducts(products.map(p => p.id === editingProductId ? updatedData[0] : p));
        }
      } else {
        payload.id = 'v_' + Math.random().toString(36).substring(2, 9);
        const { data: insertedData, error: dbError } = await supabase.from('products').insert([payload]).select();
        if (dbError) throw dbError;
        if (insertedData) {
          setProducts([insertedData[0], ...products]);
        }
      }
      
      setShowModal(false);
      setEditingProductId(null);
      setNewProduct({ title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', fileUri: null, originCity: 'National', deliverySpeed: 'Standard (3-5 Days)' });
      Alert.alert('Success', 'Catalog updated successfully!');

    } catch (err) {
      Alert.alert('Upload Error', err.message || 'Error uploading product.');
    } finally {
      setUploading(false);
    }
  };

  const StatCard = ({ title, value, IconComponent, trend, colorCode }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <View style={[styles.statIconBox, { backgroundColor: `${colorCode}15` }]}>
          <IconComponent color={colorCode} size={20} />
        </View>
      </View>
      <Text style={styles.statTrend}>{trend}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#ea580c" size="large" />
      </View>
    );
  }

  // ONBOARDING UI
  if (!isAuthorized && user?.email.toLowerCase() !== 'admin@buildbazaar.com') {
    return (
      <View style={styles.onboardingContainer}>
        <TouchableOpacity onPress={() => router.back()} style={{position: 'absolute', top: insets.top + 20, left: 20}}>
          <ChevronLeft color="#0f172a" size={28} />
        </TouchableOpacity>
        
        <View style={styles.onboardingBox}>
          <View style={styles.onboardingIconBox}>
            <Building2 color="#ea580c" size={32} />
          </View>
          <Text style={styles.onboardingTitle}>Open your Shop</Text>
          <Text style={styles.onboardingDesc}>Verify your logistics location to start listing materials on BuildBazaar.</Text>
          
          <Text style={styles.label}>Business Name</Text>
          <TextInput 
            style={styles.input}
            placeholder="e.g. Hubli Cements Ltd"
            value={onboardingData.businessName}
            onChangeText={t => setOnboardingData({...onboardingData, businessName: t})}
          />

          <Text style={styles.label}>Warehouse / Yard City</Text>
          <TextInput 
            style={styles.input}
            placeholder="e.g. Hubli"
            value={onboardingData.warehouseCity}
            onChangeText={t => setOnboardingData({...onboardingData, warehouseCity: t})}
          />
          <Text style={styles.helpText}>This ensures we only show your products to nearby buyers.</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleOnboarding} disabled={uploading}>
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Activate Seller Account</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Seller Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <View style={styles.headerLogo}>
            <Building2 color="#ea580c" size={20} style={{ marginRight: 6 }} />
            <Text style={styles.headerLogoText}>Vendor Hub</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/')} style={styles.storefrontBtn}>
            <Text style={styles.storefrontBtnText}>Storefront</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'overview' && styles.tabBtnActive]}
            onPress={() => setActiveTab('overview')}
          >
            <TrendingUp color={activeTab === 'overview' ? '#ea580c' : '#94a3b8'} size={18} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
            onPress={() => setActiveTab('orders')}
          >
            <PackageOpen color={activeTab === 'orders' ? '#ea580c' : '#94a3b8'} size={18} />
            <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>Orders</Text>
            {pendingCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{pendingCount}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'inventory' && styles.tabBtnActive]}
            onPress={() => setActiveTab('inventory')}
          >
            <Package color={activeTab === 'inventory' ? '#ea580c' : '#94a3b8'} size={18} />
            <Text style={[styles.tabText, activeTab === 'inventory' && styles.tabTextActive]}>Inventory</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentScroll}>
        {activeTab === 'overview' && (
          <View>
            <Text style={styles.sectionTitle}>Global Analytics</Text>
            <Text style={styles.sectionDesc}>Live breakdown of platform metrics and incoming orders.</Text>
            
            <StatCard title="Net Revenue Payout" value={`₹${revenue.toLocaleString('en-IN')}`} IconComponent={DollarSign} trend="Deducted 3% Platform Fee" colorCode="#10b981" />
            <StatCard title="Total Active Products" value={products.length} IconComponent={Package} trend="Live catalog size" colorCode="#3b82f6" />
            <StatCard title="Pending Fulfillment" value={pendingCount} IconComponent={Clock} trend={pendingCount > 0 ? "Requires attention" : "All orders fulfilled"} colorCode="#f59e0b" />

            <View style={styles.recentOrdersBox}>
              <Text style={styles.recentOrdersTitle}>Recent Order Activity</Text>
              {orders.slice(0, 5).map(order => (
                <View key={order.id} style={styles.recentOrderRow}>
                  <View style={{flex: 1}}>
                    <Text style={styles.roCustomer}>{order.customer_name}</Text>
                    <Text style={styles.roDate}>{new Date(order.created_at).toLocaleDateString()} • {order.project_name || 'Standard Site'}</Text>
                  </View>
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.roAmount}>₹{Number(order.total_amount).toLocaleString('en-IN')}</Text>
                    <Text style={[styles.roStatus, {color: order.status === 'Processing' ? '#f59e0b' : '#10b981'}]}>{order.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'orders' && (
          <View>
            <Text style={styles.sectionTitle}>Fulfillment Queue</Text>
            <Text style={styles.sectionDesc}>Manage and progress live orders across the network.</Text>

            {orders.map(order => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderMetaLabel}>ORDER ID</Text>
                    <Text style={styles.orderMetaValue}>{order.id.split('-')[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.orderMeta}>
                    <Text style={styles.orderMetaLabel}>PAYOUT</Text>
                    <Text style={styles.orderMetaValue}>₹{Number(order.vendor_payout || order.total_amount).toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                <View style={styles.orderItemsBox}>
                  {order.order_items?.map(item => (
                    <View key={item.id} style={styles.orderItemRow}>
                      <Text style={styles.orderItemTitle}>{item.title}</Text>
                      <Text style={styles.orderItemQty}>Qty: {item.quantity} x ₹{Number(item.price).toLocaleString('en-IN')}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.orderActions}>
                  <Text style={styles.statusUpdateLabel}>Update Status:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Processing', 'Dispatched', 'Delivered', 'Cancelled'].map(s => (
                      <TouchableOpacity 
                        key={s}
                        style={[styles.statusChip, order.status === s && styles.statusChipActive]}
                        onPress={() => handleStatusUpdate(order.id, s)}
                      >
                        <Text style={[styles.statusChipText, order.status === s && styles.statusChipTextActive]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'inventory' && (
          <View>
            <View style={styles.invHeaderRow}>
              <View style={{flex: 1}}>
                <Text style={styles.sectionTitle}>Inventory Catalog</Text>
                <Text style={styles.sectionDesc}>Manage your storefront products.</Text>
              </View>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => {
                  setEditingProductId(null);
                  setNewProduct({ title: '', brand: '', category: 'Cement', priceCurrent: '', priceOld: '', unit: '', fileUri: null, originCity: 'National', deliverySpeed: 'Standard (3-5 Days)' });
                  setShowModal(true);
                }}
              >
                <Plus color="#ffffff" size={16} style={{marginRight: 4}} />
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            {products.map(prod => (
              <View key={prod.id} style={styles.prodCard}>
                <View style={styles.prodImgBox}>
                  {prod.images?.[0] ? (
                    <Image source={{ uri: prod.images[0] }} style={styles.prodImg} />
                  ) : (
                    <ImageIcon color="#94a3b8" size={24} />
                  )}
                </View>
                <View style={styles.prodInfo}>
                  <Text style={styles.prodTitle} numberOfLines={2}>{prod.title}</Text>
                  <Text style={styles.prodBrand}>{prod.brand} • {prod.category}</Text>
                  <Text style={styles.prodPrice}>₹{Number(prod.priceCurrent).toLocaleString('en-IN')} <Text style={{fontSize: 11, color: '#64748b'}}>{prod.unit}</Text></Text>
                  <Text style={styles.prodOrigin}>{prod.origin_city || 'National'} Fulfillment</Text>
                </View>
                <TouchableOpacity 
                  style={styles.editBtn}
                  onPress={() => {
                    const validCats = ['Cement', 'Steel & TMT', 'Bricks & Blocks', 'Plumbing', 'Electricals', 'Paint & Finishes'];
                    const safeCat = validCats.includes(prod.category) ? prod.category : 'Cement';
                    setEditingProductId(prod.id);
                    setNewProduct({
                      title: prod.title,
                      brand: prod.brand,
                      category: safeCat,
                      priceCurrent: prod.priceCurrent ? prod.priceCurrent.toString() : '',
                      priceOld: prod.priceOld ? prod.priceOld.toString() : '',
                      unit: prod.unit,
                      originCity: prod.origin_city || 'National',
                      deliverySpeed: prod.delivery_speed || 'Standard (3-5 Days)',
                      fileUri: null
                    });
                    setShowModal(true);
                  }}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Product Modal */}
      <Modal visible={showModal} animationType="slide" transparent={false} onRequestClose={() => setShowModal(false)}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeBtn}>
            <X color="#0f172a" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{editingProductId ? 'Edit Material' : 'List New Material'}</Text>
        </View>
        
        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Title</Text>
            <TextInput style={styles.input} value={newProduct.title} onChangeText={t => setNewProduct({...newProduct, title: t})} placeholder="e.g. UltraTech Weather Plus Cement" />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalfLeft}>
              <Text style={styles.label}>Brand</Text>
              <TextInput style={styles.input} value={newProduct.brand} onChangeText={t => setNewProduct({...newProduct, brand: t})} placeholder="e.g. UltraTech" />
            </View>
            <View style={styles.formGroupHalfRight}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerFake}>
                <TextInput style={styles.input} value={newProduct.category} onChangeText={t => setNewProduct({...newProduct, category: t})} placeholder="Cement, Steel..." />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formGroupHalfLeft}>
              <Text style={styles.label}>Current Price (₹)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={newProduct.priceCurrent} onChangeText={t => setNewProduct({...newProduct, priceCurrent: t})} placeholder="450" />
            </View>
            <View style={styles.formGroupHalfRight}>
              <Text style={styles.label}>Selling Unit</Text>
              <TextInput style={styles.input} value={newProduct.unit} onChangeText={t => setNewProduct({...newProduct, unit: t})} placeholder="per bag" />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Shipping Origin City</Text>
            <TextInput style={styles.input} value={newProduct.originCity} onChangeText={t => setNewProduct({...newProduct, originCity: t})} placeholder="e.g. Hubli, Delhi, or National" />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Image</Text>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
              {newProduct.fileUri ? (
                <Image source={{uri: newProduct.fileUri || undefined}} style={{width: '100%', height: '100%', borderRadius: 8}} />
              ) : (
                <View style={{alignItems: 'center'}}>
                  <ImageIcon color="#94a3b8" size={32} style={{marginBottom: 8}} />
                  <Text style={{color: '#64748b', fontWeight: '600'}}>Tap to upload photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.primaryBtn, {marginTop: 20, marginBottom: 40}]} onPress={handleAddProduct} disabled={uploading}>
            {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{editingProductId ? 'Save Changes' : 'Publish Material'}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  storefrontBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  storefrontBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    gap: 8,
  },
  tabBtnActive: {
    borderBottomColor: '#ea580c',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  contentScroll: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  statIconBox: {
    padding: 10,
    borderRadius: 12,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  recentOrdersBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recentOrdersTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  recentOrderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  roCustomer: {
    fontWeight: '800',
    color: '#0f172a',
    fontSize: 14,
  },
  roDate: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 4,
  },
  roAmount: {
    fontWeight: '800',
    color: '#0f172a',
    fontSize: 14,
  },
  roStatus: {
    fontWeight: '700',
    fontSize: 12,
    marginTop: 4,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  orderMeta: {
    flex: 1,
  },
  orderMetaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 2,
  },
  orderMetaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  orderItemsBox: {
    padding: 16,
  },
  orderItemRow: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderItemTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 4,
  },
  orderItemQty: {
    fontSize: 12,
    color: '#64748b',
  },
  orderActions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statusUpdateLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  statusChipActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  statusChipTextActive: {
    color: '#fff',
  },
  invHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ea580c',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  prodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  prodImgBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  prodImg: {
    width: '100%',
    height: '100%',
  },
  prodInfo: {
    flex: 1,
  },
  prodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  prodBrand: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  prodPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ea580c',
  },
  prodOrigin: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 4,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  closeBtn: {
    padding: 4,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalScroll: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formGroupHalfLeft: {
    marginBottom: 16,
    flex: 1,
    marginRight: 10,
  },
  formGroupHalfRight: {
    marginBottom: 16,
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  imagePickerBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  primaryBtn: {
    backgroundColor: '#ea580c',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    padding: 20,
  },
  onboardingBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  onboardingIconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#fff7ed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  onboardingDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  helpText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 16,
  }
});
