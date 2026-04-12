import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ScrollView, RefreshControl, Animated,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { useCatalogStore } from '../store/catalogStore';
import { SkeletonHorizontalCard, SkeletonPill } from '../components/SkeletonCard';
import { Equipment } from '../types';
import { HomepageSection } from '../api';
import { useCartStore } from '../store/cartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width: W } = Dimensions.get('window');

const ACCENT = '#E31B23';
const BG = '#080808';
const CARD = '#111111';
const BORDER = 'rgba(255,255,255,0.06)';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { categories, homepageSections, isLoading, error, fetchCatalog } = useCatalogStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const heroScrollRef = useRef<ScrollView>(null);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cartItemCount = useCartStore((state) => state.items.length);

  // The hero section is always the first "hero" type section
  const heroSection = homepageSections.find((s) => s.type === 'hero');
  const heroItems = heroSection?.items ?? [];
  const carouselSections = homepageSections.filter((s) => s.type === 'carousel');

  const startAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    autoSlideTimer.current = setInterval(() => {
      setHeroIndex(prev => {
        const next = heroItems.length > 0 ? (prev + 1) % heroItems.length : 0;
        heroScrollRef.current?.scrollTo({ x: next * W, animated: true });
        return next;
      });
    }, 4000);
  }, [heroItems.length]);

  useEffect(() => {
    if (!isLoading && heroItems.length > 1) startAutoSlide();
    return () => { if (autoSlideTimer.current) clearInterval(autoSlideTimer.current); };
  }, [isLoading, heroItems.length, startAutoSlide]);

  // Stagger animations
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(-30)).current;
  const pillsOpacity = useRef(new Animated.Value(0)).current;
  const pillsTranslate = useRef(new Animated.Value(20)).current;
  const sectionsOpacity = useRef(new Animated.Value(0)).current;
  const sectionsTranslate = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    if (!isLoading && (heroItems.length > 0 || categories.length > 0)) {
      Animated.stagger(120, [
        Animated.parallel([
          Animated.timing(heroOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.spring(heroTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
        ]),
        Animated.parallel([
          Animated.timing(pillsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(pillsTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
        ]),
        Animated.parallel([
          Animated.timing(sectionsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(sectionsTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
        ]),
      ]).start();
    }
  }, [isLoading, heroItems.length, categories.length]);

  const onHeroScrollBegin = () => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
  };

  const onHeroScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setHeroIndex(idx);
    if (heroItems.length > 1) startAutoSlide();
  };

  if (isLoading && homepageSections.length === 0) return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ height: 520, backgroundColor: CARD, marginBottom: 20 }} />
      <View style={{ padding: 16 }}>
        <View style={{ height: 20, width: 120, backgroundColor: CARD, marginBottom: 16, borderRadius: 4 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1,2,3,4].map(i => <SkeletonPill key={i} />)}
        </ScrollView>
        <View style={{ height: 20, width: 140, backgroundColor: CARD, marginTop: 32, marginBottom: 16, borderRadius: 4 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1,2].map(i => <SkeletonHorizontalCard key={i} />)}
        </ScrollView>
      </View>
    </View>
  );

  if (error && homepageSections.length === 0) return (
    <View style={[styles.container, styles.centered]}>
      <MaterialCommunityIcons name="wifi-off" size={48} color="#333" />
      <Text style={{ color: '#555', fontSize: 16, fontWeight: '600', marginTop: 16, textAlign: 'center', paddingHorizontal: 40 }}>{error}</Text>
      <TouchableOpacity
        onPress={() => fetchCatalog(true)}
        style={{ marginTop: 24, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 }}
      >
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHorizontalCard = (item: Equipment) => (
    <TouchableOpacity
      key={item.id}
      style={styles.hCard}
      onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, equipment: item })}
      activeOpacity={0.88}
    >
      {item.imageUrls && item.imageUrls.length > 0 ? (
        <Image 
          source={{ uri: item.imageUrls[0] }} 
          style={styles.hCardImage} 
          contentFit="cover" 
        />
      ) : (
        <View style={styles.hCardPlaceholder}>
          <Ionicons name="camera-outline" size={28} color="#333" />
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(8,8,8,0.9)']}
        style={styles.hCardGradient}
      />
      <View style={styles.hCardContent}>
        <Text style={styles.hCardBrand}>{item.brand || 'CINEMA'}</Text>
        <Text style={styles.hCardTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.hCardPrice}>₹{item.dailyRate}<Text style={styles.hCardPer}>/day</Text></Text>
      </View>
    </TouchableOpacity>
  );

  const renderCarouselSection = (section: HomepageSection) => (
    <Animated.View key={section.id} style={[styles.section, { opacity: sectionsOpacity, transform: [{ translateY: sectionsTranslate }] }]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Catalog', {})}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hGrid}
        decelerationRate="fast"
        snapToInterval={W * 0.72 + 16}
      >
        {section.items.map(renderHorizontalCard)}
      </ScrollView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* FIXED FLOATING HEADER */}
      <View style={[styles.homeHeader, { paddingTop: insets.top }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.4)' }]} />
        }
        <View style={styles.homeHeaderContent}>
          <Text style={styles.appName}>D'RENTALS</Text>
          <TouchableOpacity
            style={styles.cartHeaderBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' } as any)}
          >
            <Ionicons name="bag-outline" size={22} color="#fff" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: 0 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => fetchCatalog(true)} tintColor={ACCENT} progressViewOffset={insets.top + 60} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO CAROUSEL (from DB) ── */}
        {heroItems.length > 0 && (
          <Animated.View style={{ height: 520, opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}>
            <ScrollView
              ref={heroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={onHeroScrollBegin}
              onMomentumScrollEnd={onHeroScrollEnd}
              decelerationRate="fast"
              snapToInterval={W}
            >
              {heroItems.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.95}
                  onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, equipment: item })}
                >
                  <ImageBackground
                    source={{ uri: item.imageUrls?.[0] }}
                    style={[styles.heroBanner, { width: W }]}
                  >
                    <LinearGradient
                      colors={['rgba(8,8,8,0)', 'rgba(8,8,8,0.3)', 'rgba(8,8,8,0.85)', BG]}
                      style={StyleSheet.absoluteFill}
                      locations={[0, 0.35, 0.75, 1]}
                    />
                    <View style={styles.heroContent}>
                      <View style={styles.heroBadge}>
                        <Text style={styles.heroBadgeText}>{heroSection?.title?.toUpperCase() ?? 'FEATURED'}</Text>
                      </View>
                      <Text style={styles.heroTitle}>{item.name}</Text>
                      <Text style={styles.heroPrice}>
                        From <Text style={styles.heroPriceNum}>₹{item.dailyRate}</Text>/day
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Dot indicators */}
            <View style={styles.dots}>
              {heroItems.map((_, i) => (
                <View key={i} style={[styles.dot, i === heroIndex && styles.dotActive]} />
              ))}
            </View>
          </Animated.View>
        )}

        {/* ── CATEGORY PILLS ── */}
        <Animated.View style={{ marginTop: -8, opacity: pillsOpacity, transform: [{ translateY: pillsTranslate }] }}>
          <Text style={styles.sectionLabel}>Browse by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            <TouchableOpacity
              style={[styles.pill, styles.pillAllActive]}
              onPress={() => navigation.navigate('Catalog', {})}
            >
              <Text style={[styles.pillText, { color: '#fff' }]}>All Gear</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={styles.pill}
                onPress={() => navigation.navigate('Catalog', { categoryId: cat.id })}
              >
                <Text style={styles.pillText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── DYNAMIC CAROUSEL SECTIONS (from DB) ── */}
        {carouselSections.map(renderCarouselSection)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: 'center', alignItems: 'center' },

  // Fixed Header
  homeHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  homeHeaderContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  appName: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  cartHeaderBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  cartBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: ACCENT, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },

  // Hero
  heroBanner: { height: 520, justifyContent: 'flex-end' },
  heroBadge: { backgroundColor: ACCENT, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  heroContent: { paddingHorizontal: 24, paddingBottom: 32 },
  heroTitle: { color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -1, lineHeight: 40, marginBottom: 8 },
  heroPrice: { color: '#aaa', fontSize: 16, fontWeight: '500' },
  heroPriceNum: { color: ACCENT, fontWeight: '800' },

  // Dot indicators
  dots: { position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: ACCENT },

  // Category pills
  sectionLabel: { color: '#555', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 12, marginTop: 28 },
  pillRow: { paddingHorizontal: 24, paddingBottom: 4 },
  pill: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 100, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, marginRight: 10 },
  pillAllActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  pillText: { color: '#aaa', fontSize: 14, fontWeight: '700' },

  // Section
  section: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { color: '#FAFAFA', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  seeAll: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  // Horizontal cards
  hGrid: { paddingHorizontal: 24, paddingBottom: 8 },
  hCard: { width: W * 0.72, marginRight: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  hCardImage: { width: '100%', height: 200 },
  hCardPlaceholder: { width: '100%', height: 200, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  hCardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 140 },
  hCardContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  hCardBrand: { color: ACCENT, fontSize: 10, fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  hCardTitle: { color: '#fff', fontSize: 17, fontWeight: '800', lineHeight: 22, letterSpacing: -0.3, marginBottom: 6 },
  hCardPrice: { color: '#fff', fontSize: 15, fontWeight: '800' },
  hCardPer: { color: '#888', fontWeight: '500', fontSize: 13 },
});
