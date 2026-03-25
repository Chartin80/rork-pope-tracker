import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 22;

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isCross: boolean;
  driftX: number;
}

function ParticleDot({ particle }: { particle: Particle }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(particle.isCross ? 0.35 : 0.5, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(-15, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(particle.driftX, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0, {
            duration: particle.duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  if (particle.isCross) {
    return (
      <Animated.View
        style={[
          styles.crossContainer,
          {
            left: particle.x,
            top: particle.y,
          },
          animatedStyle,
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
        },
        animatedStyle,
      ]}
    />
  );
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
      driftX: (Math.random() - 0.5) * 20,
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
