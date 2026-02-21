import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(prev => (prev + 1) % NEWS_HEADLINES.length);
        slideAnim.setValue(10);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.08)', 'rgba(212, 175, 55, 0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <LinearGradient
          colors={['#D4AF37', '#B8942E']}
          style={styles.iconWrap}
        >
          <Zap size={11} color={Colors.midnight} />
        </LinearGradient>
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.12)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  badgeText: {
    color: Colors.gold,
    fontSize: 8,
    fontWeight: '800' as const,
    letterSpacing: 1.2,
  },
});
