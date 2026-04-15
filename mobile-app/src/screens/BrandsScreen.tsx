import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Animated
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCatalogStore } from '../store/catalogStore';

const ACCENT  = '#E31B23';
const BG      = '#080808';
const CARD    = '#111111';
const BORDER  = 'rgba(255,255,255,0.06)';
const TEXT_P  = '#FAFAFA';
const TEXT_S  = '#666666';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Brands'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function BrandsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { brands, isLoading, error, fetchCatalogData } = useCatalogStore();

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  const renderBrand = ({ item, index }: { item: string; index: number }) => {
    return <AnimatedBrandRow item={item} index={index} navigation={navigation} />;
  };

  const AnimatedBrandRow = ({ item, index, navigation }: { item: string; index: number; navigation: any }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(15)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 40, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 40, useNativeDriver: true })
      ]).start();
    }, []);

    return (
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('BrandDetail', { brandName: item })}
          activeOpacity={0.85}
        >
          {/* Initials avatar */}
          <View style={[styles.avatar, { borderColor: index === 0 ? ACCENT : BORDER }]}>
            <Text style={[styles.avatarText, { color: index === 0 ? ACCENT : '#555' }]}>
              {item.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.brandName}>{item}</Text>
          <View style={styles.rowRight}>
            <Ionicons name="chevron-forward" size={18} color="#333" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Brands</Text>
        <Text style={styles.headerSub}>{brands.length} manufacturers</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color={ACCENT} /></View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color="#2a2a2a" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchCatalogData(true)}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={item => item}
          renderItem={renderBrand}
          contentContainerStyle={[styles.list, { paddingTop: 0, paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: TEXT_S, fontSize: 15, fontWeight: '600', marginTop: 16, textAlign: 'center', paddingHorizontal: 40 },
  retryBtn: { marginTop: 24, backgroundColor: ACCENT, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 100 },
  retryText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  header: { paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  headerTitle: { color: TEXT_P, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  headerSub: { color: TEXT_S, fontSize: 14, fontWeight: '600', marginTop: 4 },

  list: { paddingHorizontal: 20 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginLeft: 80 },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: CARD, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  brandName: { flex: 1, color: TEXT_P, fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  rowRight: { opacity: 0.5 },
});
