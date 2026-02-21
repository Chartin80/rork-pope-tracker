import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, LayoutChangeEvent } from 'react-native';
import { Newspaper } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { NEWS_HEADLINES } from '@/mocks/events';

export default function NewsTicker() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(prev => (prev + 1) % NEWS_HEADLINES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Newspaper size={14} color={Colors.gold} />
      </View>
      <Animated.Text
        style={[styles.text, { opacity: fadeAnim }]}
        numberOfLines={1}
      >
        {NEWS_HEADLINES[currentIndex]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    color: Colors.whiteSecondary,
    fontSize: 13,
    fontWeight: '400' as const,
  },
});
