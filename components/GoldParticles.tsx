import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 18;

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isCross: boolean;
}

export default function GoldParticles() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: 1.5 + Math.random() * 3.5,
      duration: 4000 + Math.random() * 5000,
      delay: Math.random() * 4000,
      isCross: i % 5 === 0,
    }));
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => (
        <ParticleDot key={i} particle={p} />
      ))}
    </View>
  );
}

function ParticleDot({ particle }: { particle: Particle }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeAnim = Animated.loop(
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: particle.isCross ? 0.35 : 0.5,
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -12,
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    fadeAnim.start();
    return () => fadeAnim.stop();
  }, [opacity, translateY, particle.delay, particle.duration, particle.isCross]);

  if (particle.isCross) {
    return (
      <Animated.View
        style={[
          styles.crossContainer,
          {
            left: particle.x,
            top: particle.y,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.crossH, { width: particle.size * 3, height: particle.size * 0.8 }]} />
        <View style={[styles.crossV, { width: particle.size * 0.8, height: particle.size * 3 }]} />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    backgroundColor: Colors.gold,
  },
  crossContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossH: {
    position: 'absolute',
    backgroundColor: Colors.goldWarm,
    borderRadius: 1,
  },
  crossV: {
    position: 'absolute',
    backgroundColor: Colors.goldWarm,
    borderRadius: 1,
  },
});
