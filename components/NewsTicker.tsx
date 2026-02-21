import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { NEWS_HEADLINES } from '@/mocks/events';

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(prev => (prev + 1) % NEWS_HEADLINES.length);
        slideAnim.setValue(8);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Zap size={12} color={Colors.gold} />
      </View>
      <View style={styles.textWrap}>
        <Animated.Text
          style={[
            styles.text,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
          numberOfLines={1}
        >
          {NEWS_HEADLINES[currentIndex]}
        </Animated.Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>NEWS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  text: {
    color: Colors.whiteSecondary,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  badge: {
    backgroundColor: Colors.goldMuted,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.goldWarm,
    fontSize: 8,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
});
