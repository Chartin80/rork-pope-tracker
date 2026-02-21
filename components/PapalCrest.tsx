import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface PapalCrestProps {
  size?: number;
}

export default function PapalCrest({ size = 56 }: PapalCrestProps) {
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [glowAnim]);

  const scale = size / 56;

  return (
    <View style={[styles.outer, { width: size + 8, height: size + 8 }]}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size + 8,
            height: size + 8,
            borderRadius: (size + 8) / 2,
            opacity: glowAnim,
          },
        ]}
      />
      <LinearGradient
        colors={['#D4AF37', '#B8942E', '#8B7025']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <View style={[styles.innerRing, { width: size - 6, height: size - 6, borderRadius: (size - 6) / 2 }]}>
          <Text style={[styles.cross, { fontSize: 26 * scale }]}>&#x2629;</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  innerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 15, 28, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  cross: {
    color: Colors.goldLight,
    fontWeight: '300' as const,
  },
});
