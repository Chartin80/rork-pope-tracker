import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface GoldSpinnerProps {
  size?: number;
}

export default function GoldSpinner({ size = 40 }: GoldSpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    spin.start();
    pulse.start();
    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [rotation, fadeAnim]);

  const spinInterp = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.center}>
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            opacity: fadeAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: spinInterp }],
          },
        ]}
      />
      <View style={[styles.innerDot, { width: size * 0.3, height: size * 0.3, borderRadius: size * 0.15 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  glowRing: {
    position: 'absolute',
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.08)',
  },
  spinner: {
    borderWidth: 2.5,
    borderColor: 'rgba(212, 175, 55, 0.08)',
    borderTopColor: Colors.gold,
    borderRightColor: Colors.goldWarm,
  },
  innerDot: {
    position: 'absolute',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
});
