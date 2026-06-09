import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { ChevronLeft, Star, ShieldCheck, ShoppingCart, Plus, Minus, FileText } from 'lucide-react-native';
import MaterialCalculator from '../../components/MaterialCalculator';

const mockProducts = [
  {
    id: 'p1', title: 'UltraTech Cement OPC 53', brand: 'UltraTech', verified: true,
    tag: 'Best Seller', rating: 4.8, reviews: 2340, priceCurrent: 450, priceOld: 480,
    unit: 'per bag (50kg)', images: ['/products/cement.png'], category: 'Cement',
    description: 'Premium quality Ordinary Portland Cement (OPC) of 53 Grade. Ideal for high-strength concrete applications in residential and commercial buildings. Manufactured using high-quality raw materials for superior durability.',
    product_specs: { grade: "53 Grade", type: "OPC", setting_time_initial: "30 mins", compressive_strength_28d: "53 MPa", standard: "IS 12269" }
  },
  {
    id: 'p2', title: 'Tata Tiscon TMT Bars 12mm', brand: 'Tata Steel', verified: true,
    tag: 'Top Rated', rating: 4.9, reviews: 1120, priceCurrent: 65500, priceOld: 68000,
    unit: 'per tonne', images: ['/products/tmt_bars.png'], category: 'Steel & TMT',
    description: 'High-ductility TMT rebars with superior earthquake resistance and bonding strength. Produced using Virgin Steel through the primary route for maximum purity.',
    product_specs: { grade: "Fe 550D", diameter: "12mm", length: "12m", standard: "IS 1786" }
  },
  {
    id: 'p3', title: 'First Class Red Bricks', brand: 'Local Supplier', verified: true,
    tag: 'Bulk Deal', rating: 4.3, reviews: 870, priceCurrent: 8, priceOld: 10,
    unit: 'per piece', images: ['/products/red_bricks.png'], category: 'Bricks & Blocks',
    description: 'Naturally burnt red clay bricks. High thermal insulation and durability for traditional masonry. Traditional frog-indent for better mortar bonding.',
    product_specs: { compressive_strength: "10.0 N/mm2", water_absorption: "< 15%", size: "9 x 4.5 x 3 inch", type: "First Class" }
  },
  {
    id: 'p4', title: 'Finolex CPVC Pipes 1"', brand: 'Finolex', verified: true,
    tag: '', rating: 4.5, reviews: 560, priceCurrent: 245, priceOld: 280,
    unit: 'per 3m length', images: ['/products/cpvc_pipes.png'], category: 'Plumbing',
    description: 'High-quality CPVC pipes for hot and cold water distribution. Lead-free and non-toxic. ASTM D2846 compliant for plumbing systems.',
    product_specs: { material: "CPVC", diameter: "1 inch", standard: "ASTM D2846", temp_rating: "Up to 93°C" }
  }
];

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (data) {
          setProduct(data);
        } else {
          // Fallback
          const localMatch = mockProducts.find(p => p.id === id);
          if (localMatch) setProduct(localMatch);
        }
      } catch (error) {
        console.log('Error fetching product from Supabase:', error);
        const localMatch = mockProducts.find(p => p.id === id);
        if (localMatch) setProduct(localMatch);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const getImageUri = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://buildbazaar-two.vercel.app${imagePath}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} ${product.unit} of ${product.title} added to cart!`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#ea580c" size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Material not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBackBtn}>
          <ChevronLeft color="#64748b" size={20} />
        </TouchableOpacity>
        <Text style={styles.navBreadcrumb}>
          Products / <Text style={styles.navBold}>{product.category}</Text>
        </Text>
      </View>

      {/* Image Stage */}
      <View style={styles.imageStage}>
        <Image 
          source={{ uri: getImageUri(product.images?.[0]) }} 
          style={styles.mainImage}
          resizeMode="contain"
        />
        {product.tag ? <View style={styles.tagBadge}><Text style={styles.tagBadgeText}>{product.tag}</Text></View> : null}
      </View>

      {/* Brand & Verification Banner */}
      <View style={styles.brandRow}>
        <Text style={styles.brandText}>{product.brand}</Text>
        {product.verified && (
          <View style={styles.verifiedBadge}>
            <ShieldCheck color="#16a34a" size={14} />
            <Text style={styles.verifiedBadgeText}>BIS CERTIFIED</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.titleText}>{product.title}</Text>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Star color="#fbbf24" fill="#fbbf24" size={14} />
        <Text style={styles.ratingVal}>{product.rating}</Text>
        <Text style={styles.reviewsCount}>({product.reviews?.toLocaleString()} reports)</Text>
      </View>

      {/* Price Box */}
      <View style={styles.priceContainer}>
        <View style={styles.priceValRow}>
          <Text style={styles.priceText}>₹{product.priceCurrent.toLocaleString('en-IN')}</Text>
          <Text style={styles.unitText}>/ {product.unit}</Text>
        </View>
        {product.priceOld && (
          <Text style={styles.oldPriceText}>₹{product.priceOld.toLocaleString('en-IN')}</Text>
        )}
      </View>

      {/* Quantity & Add Box */}
      <View style={styles.cartActionBox}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus color="#0f172a" size={16} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus color="#0f172a" size={16} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <ShoppingCart color="#ffffff" size={18} />
          <Text style={styles.addButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <View style={styles.sectionTitleRow}>
          <FileText color="#ea580c" size={18} />
          <Text style={styles.sectionTitle}>Material Intelligence</Text>
        </View>
        <Text style={styles.descriptionText}>{product.description}</Text>
      </View>

      {/* Technical Specs Tabular */}
      <View style={styles.specsSection}>
        <Text style={styles.specsHeader}>Technical Datasheet</Text>
        {Object.entries(product.product_specs || {}).map(([key, value], idx, arr) => (
          <View 
            key={idx} 
            style={[
              styles.specRow,
              idx === arr.length - 1 && styles.lastSpecRow
            ]}
          >
            <Text style={styles.specKey}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
            <Text style={styles.specValue}>{value.toString()}</Text>
          </View>
        ))}
      </View>

      {/* Material Calculator */}
      <MaterialCalculator category={product.category} unit={product.unit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 12,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ea580c',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  navBackBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginRight: 12,
  },
  navBreadcrumb: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  navBold: {
    color: '#0f172a',
    fontWeight: '800',
  },
  imageStage: {
    width: '100%',
    height: 240,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ea580c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ea580c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
    marginLeft: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginLeft: 6,
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  unitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ea580c',
    marginLeft: 6,
  },
  oldPriceText: {
    fontSize: 14,
    color: '#cbd5e1',
    textDecorationLine: 'line-through',
    fontWeight: '700',
    marginTop: 2,
  },
  cartActionBox: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 48,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    paddingHorizontal: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#ea580c',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  descriptionSection: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    fontWeight: '500',
  },
  specsSection: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  specsHeader: {
    backgroundColor: '#f8fafc',
    padding: 12,
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastSpecRow: {
    borderBottomWidth: 0,
  },
  specKey: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
  },
  specValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  }
});
