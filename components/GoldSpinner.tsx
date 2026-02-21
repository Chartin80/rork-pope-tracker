import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Colors from '@/constants/colors';

interface GoldSpinnerProps {
  size?: number;
}

export default function GoldSpinner({ size = 40 }: GoldSpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.4,
          duration: 700,
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
      <Animated.View style={[styles.glowRing, { width: size + 16, height: size + 16, borderRadius: (size + 16) / 2, opacity: fadeAnim }]} />
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
    backgroundColor: Colors.goldShimmer,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  spinner: {
    borderWidth: 2.5,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    borderTopColor: Colors.gold,
    borderRightColor: Colors.goldWarm,
  },
});
