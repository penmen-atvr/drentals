import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Linking, Alert, Platform, Modal
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Calendar } from 'react-native-calendars';
import { useCartStore } from '../store/cartStore';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT    = '#E31B23';
const ACCENT_DIM = 'rgba(227,27,35,0.12)';
const BG        = '#080808';
const CARD      = '#111111';
const BORDER    = 'rgba(255,255,255,0.06)';
const TEXT_P    = '#FAFAFA';
const TEXT_S    = '#666666';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Cart'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function CartScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { items, removeItem, clearCart, getTotal, startDate, endDate, setDates, updateQuantity } = useCartStore();
  const [pickerMode, setPickerMode] = useState<'start' | 'end' | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = "Hi, I'd like to reserve the following items from D'RENTALS:\n\n";
    message += `*Rental Period:* ${startDate.toDateString()} to ${endDate.toDateString()}\n\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.equipment.name}*\n`;
      message += `   Qty: ${item.quantity} | Duration: ${item.durationDays} days\n`;
      message += `   Rate: ₹${item.equipment.dailyRate}/day\n\n`;
    });
    message += `*Total Estimated Rental: ₹${getTotal().toFixed(0)}*\n\n`;
    message += "Please let me know if these are available and the next steps for payment/deposit.";

    // Use wa.me which is universally supported
    const phoneNumber = "917794872701";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappUrl).catch(err => {
      Alert.alert("Error", "Could not open WhatsApp.");
    });
  };

  const formatDateString = (d: Date) => {
    const pad = (n: number) => n < 10 ? `0${n}` : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Build a full marked date range for the calendar
  const buildMarkedDates = () => {
    const marked: Record<string, any> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(0,0,0,0);
    const cursor = new Date(start);

    while (cursor <= end) {
      const key = formatDateString(cursor);
      const isStart = cursor.getTime() === start.getTime();
      const isEnd = cursor.getTime() === end.getTime();
      marked[key] = {
        color: ACCENT,
        textColor: '#fff',
        startingDay: isStart,
        endingDay: isEnd,
      };
      cursor.setDate(cursor.getDate() + 1);
    }
    return marked;
  };
  const onDayPress = (day: any) => {
    // Construct local date at noon to avoid timezone shift issues
    const selectedDate = new Date(`${day.dateString}T12:00:00`);
    selectedDate.setHours(0, 0, 0, 0);

    if (pickerMode === 'start') {
      setDates(selectedDate, endDate > selectedDate ? endDate : selectedDate);
    } else if (pickerMode === 'end') {
      setDates(startDate < selectedDate ? startDate : selectedDate, selectedDate);
    }
    setPickerMode(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      {item.equipment.imageUrls && item.equipment.imageUrls.length > 0 ? (
        <Image source={{ uri: item.equipment.imageUrls[0] }} style={styles.cartImage} contentFit="cover" />
      ) : (
        <View style={styles.imgPlaceholder}>
          <Ionicons name="camera-outline" size={20} color="#333" />
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.equipment.name}</Text>
        {item.equipment.brand && (
          <Text style={styles.itemBrand}>{item.equipment.brand}</Text>
        )}
        <Text style={styles.itemMeta}>{item.durationDays} day(s)</Text>
        {/* Quantity stepper */}
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => updateQuantity(item.equipment.id, Math.max(1, item.quantity - 1))}
          >
            <Ionicons name="remove" size={14} color={ACCENT} />
          </TouchableOpacity>
          <Text style={styles.stepValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => updateQuantity(item.equipment.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={14} color={ACCENT} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemPrice}>
          ₹{(parseFloat(item.equipment.dailyRate) * item.quantity * item.durationDays).toFixed(0)}
        </Text>
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.equipment.id)}>
          <Ionicons name="trash-outline" size={16} color={ACCENT} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty state
  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <TouchableOpacity 
          style={{ position: 'absolute', top: insets.top + 20, left: 24, zIndex: 10 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color={TEXT_P} />
        </TouchableOpacity>
        
        <View style={styles.emptyIcon}>
          <Ionicons name="bag-outline" size={48} color="#222" />
        </View>
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptySubtitle}>Browse our catalog and add gear to get started</Text>
        <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Catalog', {})}>
          <Text style={styles.emptyBtnText}>Browse Gear</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={30} color={TEXT_P} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity onPress={clearCart} style={{ marginLeft: 12 }}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.equipment.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 210 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      <View style={[styles.actionBar, { bottom: 0, paddingBottom: insets.bottom + 12 }]}>
        {Platform.OS === 'ios'
          ? <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          : <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(8,8,8,0.96)' }]} />
        }
        
        {/* Date Selector Row */}
        <View style={styles.dateSelector}>
          <TouchableOpacity 
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.7}
            onPress={() => setPickerMode('start')}
          >
            <Ionicons name="calendar-outline" size={18} color={TEXT_S} />
            <Text style={styles.dateSelectorLabel}>Start:</Text>
            <Text style={styles.dateSelectorValue}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            activeOpacity={0.7}
            onPress={() => setPickerMode('end')}
          >
            <Ionicons name="time-outline" size={18} color={TEXT_S} />
            <Text style={styles.dateSelectorLabel}>End:</Text>
            <Text style={styles.dateSelectorValue}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContent}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.actionLabel}>Total Estimate</Text>
            <Text style={styles.actionTotal} numberOfLines={1}>₹{getTotal().toFixed(0)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.checkoutText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="slide" transparent visible={pickerMode !== null} onRequestClose={() => setPickerMode(null)}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Select {pickerMode === 'start' ? 'Start' : 'End'} Date</Text>
              <TouchableOpacity onPress={() => setPickerMode(null)}>
                <Text style={styles.sheetReset}>Close</Text>
              </TouchableOpacity>
            </View>
            {pickerMode !== null && (
              <Calendar
                current={formatDateString(pickerMode === 'start' ? startDate : endDate)}
                minDate={formatDateString(pickerMode === 'start' ? new Date() : startDate)}
                onDayPress={onDayPress}
                markingType="period"
                markedDates={buildMarkedDates()}
                theme={{
                  backgroundColor: '#141414',
                  calendarBackground: '#141414',
                  textSectionTitleColor: '#555',
                  selectedDayBackgroundColor: ACCENT,
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: ACCENT,
                  dayTextColor: '#FAFAFA',
                  textDisabledColor: '#333',
                  dotColor: ACCENT,
                  arrowColor: ACCENT,
                  monthTextColor: '#FAFAFA',
                  indicatorColor: ACCENT,
                  textDayFontWeight: '600',
                  textMonthFontWeight: '900',
                  textDayHeaderFontWeight: '800'
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: { paddingHorizontal: 24, paddingBottom: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  headerTitle: { color: TEXT_P, fontSize: 34, fontWeight: '900', letterSpacing: -1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  itemCountBadge: { backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  itemCountText: { color: TEXT_S, fontSize: 13, fontWeight: '700' },
  clearText: { color: ACCENT, fontSize: 14, fontWeight: '700' },

  list: { padding: 20 },

  cartItem: { flexDirection: 'row', backgroundColor: CARD, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER, marginBottom: 14 },
  cartImage: { width: 85, height: 85, backgroundColor: '#1a1a1a' },
  imgPlaceholder: { width: 85, height: 85, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  itemName: { color: TEXT_P, fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  itemBrand: { color: ACCENT, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  itemMeta: { color: TEXT_S, fontSize: 13, fontWeight: '500' },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between', padding: 14 },
  itemPrice: { color: TEXT_P, fontSize: 17, fontWeight: '900' },
  removeBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: 'rgba(227,27,35,0.2)', justifyContent: 'center', alignItems: 'center' },

  // Quantity stepper
  stepper: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stepBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: ACCENT_DIM, borderWidth: 1, borderColor: 'rgba(227,27,35,0.25)', justifyContent: 'center', alignItems: 'center' },
  stepValue: { color: TEXT_P, fontSize: 15, fontWeight: '800', minWidth: 28, textAlign: 'center' },

  // Empty state
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: CARD, borderWidth: 1, borderColor: BORDER, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emptyTitle: { color: TEXT_P, fontSize: 24, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  emptySubtitle: { color: TEXT_S, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  emptyBtn: { backgroundColor: ACCENT, paddingVertical: 16, paddingHorizontal: 36, borderRadius: 100, shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  emptyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // Action bar
  actionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER },
  dateSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  dateSelectorLabel: { color: TEXT_S, fontSize: 13, fontWeight: '600', marginLeft: 8 },
  dateSelectorValue: { color: TEXT_P, fontSize: 14, fontWeight: '800', marginLeft: 6 },
  actionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 16 },
  actionLabel: { color: TEXT_S, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  actionTotal: { color: TEXT_P, fontSize: 28, fontWeight: '900', letterSpacing: -0.8, marginTop: 2 },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#25D366', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 100, shadowColor: '#25D366', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: -0.2 },

  // Filter sheet / Calendar overlay
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#141414', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#333', alignSelf: 'center', marginTop: 14, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  sheetTitle: { color: TEXT_P, fontSize: 22, fontWeight: '900' },
  sheetReset: { color: TEXT_S, fontSize: 15, fontWeight: '700' },
});
