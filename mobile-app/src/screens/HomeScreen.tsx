import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Image, ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainTabParamList, RootStackParamList } from '../../App';
import { SkeletonHorizontalCard, SkeletonPill } from '../components/SkeletonCard';
import { HomeBrandItem, HomeCategoryItem, HomeEquipmentItem, HomeSection, fetchCategories, fetchHomeSections } from '../api';
import { Category } from '../types';
import { useCartStore } from '../store/cartStore';

const { width: W } = Dimensions.get('window');
const ACCENT = '#E31B23';
const BG = '#080808';
const CARD = '#111111';
const BORDER = 'rgba(255,255,255,0.06)';
const HERO_H = 520;

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface HomeData {
  sections: HomeSection[];
  categories: Category[];
}

type HeroSection = Extract<HomeSection, { type: 'hero' }>;
type EquipmentListSection = Extract<HomeSection, { type: 'equipment_carousel' }> | Extract<HomeSection, { type: 'kit_grid' }>;
type CategoryStripSection = Extract<HomeSection, { type: 'category_strip' }>;
type BrandStripSection = Extract<HomeSection, { type: 'brand_strip' }>;

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore((state) => state.items.length);

  const [data, setData] = useState<HomeData>({ sections: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const heroScrollRef = useRef<ScrollView>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroLengthRef = useRef(0);
  const [heroIdx, setHeroIdx] = useState(0);

  const aHeroOp = useRef(new Animated.Value(0)).current;
  const aHeroY = useRef(new Animated.Value(-24)).current;
  const aPillsOp = useRef(new Animated.Value(0)).current;
  const aPillsY = useRef(new Animated.Value(20)).current;
  const aSecOp = useRef(new Animated.Value(0)).current;
  const aSecY = useRef(new Animated.Value(40)).current;

  const heroSection = data.sections.find((section): section is HeroSection => section.type === 'hero');
  const heroItems = heroSection?.items ?? [];
  const otherSections = data.sections.filter((section) => section.type !== 'hero');
  heroLengthRef.current = heroItems.length;

  const loadData = useCallback(async (bust = false) => {
    const bustParam = bust ? `?t=${Date.now()}` : '';

    try {
      const [sections, categories] = await Promise.all([
        fetchHomeSections(bustParam),
        fetchCategories(bustParam),
      ]);
      setData({ sections, categories });
      setError(null);
    } catch {
      setError('Could not load content. Check your connection and try again.');
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    (async () => {
      setLoading(true);
      await loadData();
      if (isActive) setLoading(false);
    })();

    return () => {
      isActive = false;
    };
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    if (!loading && (heroItems.length > 0 || otherSections.length > 0 || data.categories.length > 0)) {
      aHeroOp.setValue(0);
      aHeroY.setValue(-24);
      aPillsOp.setValue(0);
      aPillsY.setValue(20);
      aSecOp.setValue(0);
      aSecY.setValue(40);

      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(aHeroOp, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.spring(aHeroY, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(aPillsOp, { toValue: 1, duration: 360, useNativeDriver: true }),
          Animated.spring(aPillsY, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(aSecOp, { toValue: 1, duration: 360, useNativeDriver: true }),
          Animated.spring(aSecY, { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [loading, heroItems.length, otherSections.length, data.categories.length, aHeroOp, aHeroY, aPillsOp, aPillsY, aSecOp, aSecY]);

  const startSlide = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);

    autoTimer.current = setInterval(() => {
      const length = heroLengthRef.current;
      if (length < 2) return;

      setHeroIdx((prev) => {
        const next = (prev + 1) % length;
        heroScrollRef.current?.scrollTo({ x: next * W, animated: true });
        return next;
      });
    }, 4000);
  }, []);

  useEffect(() => {
    if (!loading && heroLengthRef.current > 1) startSlide();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [loading, heroItems.length, startSlide]);

  const onHeroBeginDrag = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  const onHeroMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / W);
    setHeroIdx(idx);
    if (heroLengthRef.current > 1) startSlide();
  };

  const openEquipment = (item: HomeEquipmentItem) => {
    navigation.navigate('ProductDetail', { slug: item.slug, equipment: item as any });
  };

  const openCategory = (item: HomeCategoryItem) => {
    navigation.navigate('Catalog', { categoryId: item.id });
  };

  const openBrand = (item: HomeBrandItem) => {
    navigation.navigate('BrandDetail', { brandName: item.brand });
  };

  const seeAllForSection = (section: HomeSection) => {
    if (section.type === 'brand_strip') {
      navigation.navigate('Brands');
      return;
    }

    navigation.navigate('Catalog', {} as never);
  };

  const equipmentImage = (item: HomeEquipmentItem) => item.customImageUrl || item.imageUrls?.[0] || item.mainImageUrl || null;

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={{ height: HERO_H, backgroundColor: CARD }} />
        <View style={{ padding: 20 }}>
          <View style={{ height: 18, width: 110, backgroundColor: CARD, borderRadius: 4, marginBottom: 16 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3, 4].map((key) => <SkeletonPill key={key} />)}
          </ScrollView>
          <View style={{ height: 18, width: 140, backgroundColor: CARD, borderRadius: 4, marginTop: 32, marginBottom: 16 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2].map((key) => <SkeletonHorizontalCard key={key} />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  if (error && data.sections.length === 0) {
    return (
      <View style={[styles.root, styles.center]}>
        <MaterialCommunityIcons name="wifi-off" size={48} color="#333" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderEquipmentCard = (item: HomeEquipmentItem, key: string | number) => {
    const imageUrl = equipmentImage(item);

    return (
      <TouchableOpacity key={key} style={styles.hCard} onPress={() => openEquipment(item)} activeOpacity={0.88}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.hCardImg} contentFit="cover" />
        ) : (
          <View style={styles.hCardPlaceholder}>
            <Ionicons name="camera-outline" size={28} color="#333" />
          </View>
        )}
        <LinearGradient colors={['transparent', 'rgba(8,8,8,0.92)']} style={styles.hCardGrad} />
        <View style={styles.hCardBody}>
          <Text style={styles.hCardTag}>{item.brand || 'CINEMA'}</Text>
          <Text style={styles.hCardTitle} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.hCardPrice}>Rs. {item.dailyRate}<Text style={styles.hCardPer}>/day</Text></Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEquipmentSection = (section: EquipmentListSection) => {
    if (section.type === 'equipment_carousel') {
      return (
        <Animated.View key={section.key} style={[styles.sec, { opacity: aSecOp, transform: [{ translateY: aSecY }] }]}>
          <View style={styles.secHead}>
            <View>
              <Text style={styles.secTitle}>{section.title}</Text>
              {section.subtitle ? <Text style={styles.secSubtitle}>{section.subtitle}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => seeAllForSection(section)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hGrid}>
            {section.items.map((item) => renderEquipmentCard(item, item.id))}
          </ScrollView>
        </Animated.View>
      );
    }

    return (
      <Animated.View key={section.key} style={[styles.sec, { opacity: aSecOp, transform: [{ translateY: aSecY }] }]}>
        <View style={styles.secHead}>
          <View>
            <Text style={styles.secTitle}>{section.title}</Text>
            {section.subtitle ? <Text style={styles.secSubtitle}>{section.subtitle}</Text> : null}
          </View>
        </View>
        <View style={styles.gGrid}>
          {section.items.map((item) => {
            const imageUrl = equipmentImage(item);

            return (
              <TouchableOpacity key={item.id} style={styles.gCard} onPress={() => openEquipment(item)} activeOpacity={0.88}>
                <View style={styles.gImgWrap}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  ) : (
                    <View style={styles.gPlaceholder} />
                  )}
                </View>
                <Text style={styles.gTitle} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.gPrice}>Rs. {item.dailyRate}/day</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderCategorySection = (section: CategoryStripSection) => (
    <Animated.View key={section.key} style={[styles.sec, { opacity: aSecOp, transform: [{ translateY: aSecY }] }]}>
      <View style={styles.secHead}>
        <View>
          <Text style={styles.secTitle}>{section.title}</Text>
          {section.subtitle ? <Text style={styles.secSubtitle}>{section.subtitle}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Catalog', {} as never)}>
          <Text style={styles.seeAll}>Open Catalog</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {section.items.map((item) => (
          <TouchableOpacity key={item.id} style={styles.categoryCard} onPress={() => openCategory(item)} activeOpacity={0.88}>
            <View style={styles.categoryIconWrap}>
              <Ionicons name="grid-outline" size={20} color={ACCENT} />
            </View>
            <Text style={styles.categoryTitle}>{item.name}</Text>
            {item.description ? <Text style={styles.categoryMeta} numberOfLines={2}>{item.description}</Text> : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderBrandSection = (section: BrandStripSection) => (
    <Animated.View key={section.key} style={[styles.sec, { opacity: aSecOp, transform: [{ translateY: aSecY }] }]}>
      <View style={styles.secHead}>
        <View>
          <Text style={styles.secTitle}>{section.title}</Text>
          {section.subtitle ? <Text style={styles.secSubtitle}>{section.subtitle}</Text> : null}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Brands')}>
          <Text style={styles.seeAll}>View Brands</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
        {section.items.map((item) => (
          <TouchableOpacity key={item.brand} style={styles.brandChip} onPress={() => openBrand(item)} activeOpacity={0.88}>
            <Text style={styles.brandChipText}>{item.brand}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderSection = (section: HomeSection) => {
    if (section.type === 'equipment_carousel' || section.type === 'kit_grid') {
      return renderEquipmentSection(section);
    }
    if (section.type === 'category_strip') {
      return renderCategorySection(section);
    }
    if (section.type === 'brand_strip') {
      return renderBrandSection(section);
    }
    return null;
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.45)' }]} />
        }
        <View style={styles.headerRow}>
          <Text style={styles.logo}>D'RENTALS</Text>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' } as any)}
          >
            <Ionicons name="bag-outline" size={22} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
            progressViewOffset={insets.top + 60}
          />
        }
      >
        {heroItems.length > 0 && (
          <Animated.View style={{ height: HERO_H, opacity: aHeroOp, transform: [{ translateY: aHeroY }] }}>
            <ScrollView
              ref={heroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              onScrollBeginDrag={onHeroBeginDrag}
              onMomentumScrollEnd={onHeroMomentumEnd}
            >
              {heroItems.map((item: HomeEquipmentItem) => {
                const imageUrl = equipmentImage(item);

                return (
                  <TouchableOpacity key={item.id} activeOpacity={0.95} onPress={() => openEquipment(item)}>
                    <ImageBackground source={imageUrl ? { uri: imageUrl } : undefined} style={[styles.heroBg, { width: W }]}>
                      <LinearGradient
                        colors={['rgba(8,8,8,0)', 'rgba(8,8,8,0.28)', 'rgba(8,8,8,0.88)', BG]}
                        locations={[0, 0.35, 0.73, 1]}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.heroBody}>
                        <View style={styles.heroBadge}>
                          <Text style={styles.heroBadgeTxt}>{heroSection?.title?.toUpperCase() ?? 'FEATURED'}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{item.name}</Text>
                        <Text style={styles.heroPrice}>
                          From <Text style={styles.heroPriceNum}>Rs. {item.dailyRate}</Text>/day
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.dots}>
              {heroItems.map((_, index) => (
                <View key={index} style={[styles.dot, index === heroIdx && styles.dotActive]} />
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View style={{ marginTop: -8, opacity: aPillsOp, transform: [{ translateY: aPillsY }] }}>
          <Text style={styles.pillLabel}>Browse by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            <TouchableOpacity style={[styles.pill, styles.pillActive]} onPress={() => navigation.navigate('Catalog', {} as never)}>
              <Text style={[styles.pillTxt, { color: '#fff' }]}>All Gear</Text>
            </TouchableOpacity>
            {data.categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.pill} onPress={() => navigation.navigate('Catalog', { categoryId: category.id })}>
                <Text style={styles.pillTxt}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {otherSections.map(renderSection)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  center: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#555', fontSize: 15, fontWeight: '600', marginTop: 16, textAlign: 'center', paddingHorizontal: 40 },
  retryButton: { marginTop: 24, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  logo: { color: '#fff', fontSize: 28, fontFamily: 'BlackOpsOne_400Regular', letterSpacing: 1 },
  cartBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BORDER },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: ACCENT, borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },

  heroBg: { height: HERO_H, justifyContent: 'flex-end', backgroundColor: CARD },
  heroBody: { paddingHorizontal: 24, paddingBottom: 32 },
  heroBadge: { backgroundColor: ACCENT, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
  heroBadgeTxt: { color: '#fff', fontSize: 11, fontFamily: 'Quantico_700Bold', letterSpacing: 1.5 },
  heroTitle: { color: '#fff', fontSize: 34, fontFamily: 'BlackOpsOne_400Regular', letterSpacing: 1, lineHeight: 40, marginBottom: 8 },
  heroPrice: { color: '#aaa', fontSize: 16, fontFamily: 'Quantico_700Bold' },
  heroPriceNum: { color: ACCENT, fontFamily: 'RobotoMono_700Bold' },

  dots: { position: 'absolute', bottom: 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)', marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: ACCENT },

  pillLabel: { color: '#555', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 12, marginTop: 28 },
  pillRow: { paddingHorizontal: 24, paddingBottom: 4 },
  pill: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 100, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, marginRight: 10 },
  pillActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  pillTxt: { color: '#aaa', fontSize: 14, fontWeight: '700' },

  sec: { marginTop: 32 },
  secHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 24, marginBottom: 16, gap: 16 },
  secTitle: { color: '#FAFAFA', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  secSubtitle: { color: '#777', fontSize: 13, marginTop: 4, maxWidth: 240 },
  seeAll: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  hGrid: { paddingHorizontal: 24, paddingBottom: 8 },
  hCard: { width: W * 0.72, marginRight: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  hCardImg: { width: '100%', height: 200 },
  hCardPlaceholder: { width: '100%', height: 200, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  hCardGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 150 },
  hCardBody: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  hCardTag: { color: ACCENT, fontSize: 10, fontFamily: 'Quantico_700Bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  hCardTitle: { color: '#fff', fontSize: 17, fontFamily: 'Quantico_700Bold', lineHeight: 22, letterSpacing: -0.3, marginBottom: 6 },
  hCardPrice: { color: '#fff', fontSize: 15, fontFamily: 'RobotoMono_700Bold' },
  hCardPer: { color: '#888', fontFamily: 'Quantico_400Regular', fontSize: 13 },

  categoryRow: { paddingHorizontal: 24, paddingBottom: 8 },
  categoryCard: { width: 180, marginRight: 14, padding: 16, borderRadius: 18, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER },
  categoryIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(227,27,35,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryTitle: { color: '#FAFAFA', fontSize: 16, fontWeight: '800', marginBottom: 6 },
  categoryMeta: { color: '#888', fontSize: 13, lineHeight: 18 },

  brandRow: { paddingHorizontal: 24, paddingBottom: 8 },
  brandChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 100, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, marginRight: 10 },
  brandChipText: { color: '#FAFAFA', fontSize: 14, fontWeight: '700' },

  gGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 16 },
  gCard: { width: (W - 64) / 2, backgroundColor: CARD, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, paddingBottom: 12 },
  gImgWrap: { width: '100%', aspectRatio: 1, backgroundColor: '#141414', marginBottom: 12 },
  gPlaceholder: { flex: 1 },
  gTitle: { color: '#FAFAFA', fontSize: 14, fontFamily: 'Quantico_700Bold', paddingHorizontal: 12, marginBottom: 4 },
  gPrice: { color: ACCENT, fontSize: 13, fontFamily: 'RobotoMono_700Bold', paddingHorizontal: 12 },
});
