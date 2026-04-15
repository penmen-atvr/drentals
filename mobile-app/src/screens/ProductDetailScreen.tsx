import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Dimensions, Platform, Animated
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../App';
import { fetchEquipmentDetails } from '../api';
import { Equipment } from '../types';
import { useCartStore } from '../store/cartStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width: W } = Dimensions.get('window');

const ACCENT = '#E31B23';
const ACCENT_DIM = 'rgba(227,27,35,0.12)';
const BG = '#080808';
const CARD = '#111111';
const BORDER = 'rgba(255,255,255,0.06)';
const TEXT_P = '#FAFAFA';
const TEXT_S = '#666666';

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'ProductDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { slug, equipment: initEquip } = route.params;
  const [equipment, setEquipment] = useState<Equipment | undefined>(initEquip);
  const [loading, setLoading] = useState(!initEquip);
  const [imgIndex, setImgIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) => s.items.length);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(30)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;
  const barTranslate = useRef(new Animated.Value(30)).current;

  const runEntryAnimations = () => {
    heroOpacity.setValue(0);
    heroTranslate.setValue(-20);
    contentOpacity.setValue(0);
    contentTranslate.setValue(30);
    barOpacity.setValue(0);
    barTranslate.setValue(30);

    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(heroOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(heroTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.spring(contentTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      ]),
      Animated.parallel([
        Animated.timing(barOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(barTranslate, { toValue: 0, useNativeDriver: true, tension: 70, friction: 10 }),
      ]),
    ]).start();
  };

  useEffect(() => {
    let isActive = true;
    let animationTimer: ReturnType<typeof setTimeout> | undefined;

    const loadFullDetails = async () => {
      try {
        const fullData = await fetchEquipmentDetails(slug);
        if (isActive) {
          setEquipment(fullData);
          setLoading(false);
        }
      } catch (e) {
        console.log('Error loading product details', e);
        if (isActive) setLoading(false);
      }
    };

    if (!initEquip) {
      loadFullDetails();
    } else {
      animationTimer = setTimeout(runEntryAnimations, 50);
      loadFullDetails(); // Silently upgrade sparse item to full item
    }

    return () => {
      isActive = false;
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [slug, initEquip]);

  useEffect(() => {
    if (!loading && equipment && !initEquip) {
      runEntryAnimations();
    }
  }, [loading, equipment, initEquip]);

  const handleAddToCart = () => {
    if (!equipment) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addItem(equipment, 1, 1);
    navigation.navigate('MainTabs', { screen: 'Cart' } as any);
  };

  if (loading || !equipment) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  const images = equipment.imageUrls && equipment.imageUrls.length > 0 ? equipment.imageUrls : [];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        <Animated.View style={{ height: 480, opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setImgIndex(Math.round(e.nativeEvent.contentOffset.x / W));
            }}
            decelerationRate="fast"
            snapToInterval={W}
          >
            {images.length > 0 ? images.map((url, i) => (
              <Image key={i} source={{ uri: url }} style={{ width: W, height: 480 }} contentFit="cover" />
            )) : (
              <View style={{ width: W, height: 480, backgroundColor: CARD, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="camera-outline" size={60} color="#222" />
              </View>
            )}
          </ScrollView>

          <LinearGradient
            colors={['rgba(8,8,8,0)', 'rgba(8,8,8,0.6)', BG]}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 }}
            locations={[0, 0.5, 1]}
          />

          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === imgIndex && styles.dotActive]} />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); navigation.goBack(); }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cartBtn, { top: insets.top + 12 }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' } as any)}
          >
            <Ionicons name="bag-outline" size={20} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: contentOpacity, transform: [{ translateY: contentTranslate }] }]}>
          <View style={styles.metaRow}>
            {equipment.brand && (
              <View style={styles.brandPill}>
                <Text style={styles.brandPillText}>{equipment.brand}</Text>
              </View>
            )}
            {equipment.categoryName && (
              <Text style={styles.categoryText}>{equipment.categoryName}</Text>
            )}
          </View>

          <Text style={styles.title}>{equipment.name}</Text>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Daily Rate</Text>
              <Text style={styles.price}>Rs. {equipment.dailyRate}<Text style={styles.priceUnit}> / day</Text></Text>
            </View>
            {equipment.depositAmount && (
              <View style={styles.depositBadge}>
                <Text style={styles.depositLabel}>Deposit</Text>
                <Text style={styles.depositAmount}>Rs. {equipment.depositAmount}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {(equipment.weeklyRate || equipment.weekendRate || equipment.monthlyRate) && (
            <View style={styles.ratesGrid}>
              {equipment.weekendRate && (
                <View style={styles.rateCard}>
                  <Text style={styles.rateLabel}>Weekend</Text>
                  <Text style={styles.rateValue}>Rs. {equipment.weekendRate}</Text>
                </View>
              )}
              {equipment.weeklyRate && (
                <View style={styles.rateCard}>
                  <Text style={styles.rateLabel}>Weekly</Text>
                  <Text style={styles.rateValue}>Rs. {equipment.weeklyRate}</Text>
                </View>
              )}
              {equipment.monthlyRate && (
                <View style={styles.rateCard}>
                  <Text style={styles.rateLabel}>Monthly</Text>
                  <Text style={styles.rateValue}>Rs. {equipment.monthlyRate}</Text>
                </View>
              )}
            </View>
          )}

          {equipment.description && (
            <>
              <Text style={styles.sectionTitle}>About This Gear</Text>
              <Text style={styles.description}>{equipment.description}</Text>
            </>
          )}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View style={[styles.actionBar, { paddingBottom: insets.bottom + 8 }, { opacity: barOpacity, transform: [{ translateY: barTranslate }] }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.96)' }]} />
        }
        <View style={styles.actionContent}>
          <View>
            <Text style={styles.actionSub}>Daily Rate</Text>
            <Text style={styles.actionPrice}>Rs. {equipment.dailyRate}</Text>
          </View>
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.85}>
            <Ionicons name="bag-add-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  dots: { position: 'absolute', bottom: 24, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: ACCENT },
  backBtn: { position: 'absolute', left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  cartBtn: { position: 'absolute', right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  cartBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: ACCENT, borderRadius: 7, width: 14, height: 14, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 8, fontWeight: '900' },

  content: { paddingHorizontal: 24, paddingTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  brandPill: { backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: ACCENT, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
  brandPillText: { color: ACCENT, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  categoryText: { color: TEXT_S, fontSize: 13, fontWeight: '600' },
  title: { color: TEXT_P, fontSize: 30, fontWeight: '900', letterSpacing: -0.8, lineHeight: 36, marginBottom: 20 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLabel: { color: TEXT_S, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  price: { color: TEXT_P, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  priceUnit: { color: TEXT_S, fontSize: 16, fontWeight: '500' },
  depositBadge: { alignItems: 'flex-end' },
  depositLabel: { color: TEXT_S, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  depositAmount: { color: ACCENT, fontSize: 18, fontWeight: '800' },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginVertical: 24 },

  ratesGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  rateCard: { flex: 1, backgroundColor: CARD, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: BORDER },
  rateLabel: { color: TEXT_S, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  rateValue: { color: TEXT_P, fontSize: 18, fontWeight: '800' },

  sectionTitle: { color: TEXT_P, fontSize: 20, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  description: { color: '#888', fontSize: 16, lineHeight: 28, fontWeight: '400' },

  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER },
  actionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16 },
  actionSub: { color: TEXT_S, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  actionPrice: { color: TEXT_P, fontSize: 26, fontWeight: '900', letterSpacing: -0.8, marginTop: 2 },
  addToCartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: ACCENT, paddingVertical: 17, paddingHorizontal: 30, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.3 },
});
