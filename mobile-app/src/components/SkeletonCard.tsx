import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const CARD = '#111111';
const BORDER = 'rgba(255,255,255,0.06)';
const SHIMMER = '#333333';

export const Skeleton = ({ style }: { style: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8]
  });

  return (
    <Animated.View style={[styles.skeleton, style, { opacity }]} />
  );
};

export const SkeletonCatalogCard = () => (
  <View style={styles.card}>
    <Skeleton style={styles.cardImgWrapper} />
    <View style={styles.cardBody}>
      <Skeleton style={{ height: 14, width: '90%', marginBottom: 6, borderRadius: 3 }} />
      <Skeleton style={{ height: 14, width: '60%', borderRadius: 3 }} />
      <Skeleton style={{ height: 22, width: '40%', marginTop: 14, borderRadius: 4 }} />
    </View>
  </View>
);

export const SkeletonPill = () => (
   <Skeleton style={{ height: 38, width: 90, borderRadius: 100, marginRight: 10 }} />
);

export const SkeletonHorizontalCard = () => (
  <View style={[styles.card, { width: 260, marginRight: 16, padding: 8 }]}>
    <Skeleton style={{ width: '100%', height: 140, borderRadius: 14 }} />
    <View style={{ paddingTop: 12, paddingHorizontal: 4 }}>
      <Skeleton style={{ height: 16, width: '70%', marginBottom: 6, borderRadius: 3 }} />
      <Skeleton style={{ height: 14, width: '40%', borderRadius: 3 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: SHIMMER,
    overflow: 'hidden',
  },
  card: { 
    width: '48.5%', 
    backgroundColor: CARD, 
    borderRadius: 20, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: BORDER 
  },
  cardImgWrapper: { 
    width: '100%', 
    height: 170, 
  },
  cardBody: { 
    padding: 12, 
    paddingVertical: 14 
  },
});
