import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PARTICLE_COUNT = 15;

interface ParticleData {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  isCross: boolean;
  driftX: number;
}

function ParticleDot({ particle }: { particle: ParticleData }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const maxOpacity = particle.isCross ? 0.35 : 0.5;
    const halfDur = particle.duration / 2;

    const opacityAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: maxOpacity,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          delay: particle.delay,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const yAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          delay: particle.delay,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const xAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: particle.driftX,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          delay: particle.delay,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: halfDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    opacityAnim.start();
    yAnim.start();
    xAnim.start();

    return () => {
      opacityAnim.stop();
      yAnim.stop();
      xAnim.stop();
    };
  }, [particle.delay, particle.duration, particle.driftX, particle.isCross, opacity, translateX, translateY]);

  if (particle.isCross) {
    return (
      <Animated.View
        style={[
          styles.crossContainer,
          {
            left: particle.x,
            top: particle.y,
            opacity,
            transform: [{ translateY }, { translateX }],
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
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

export default function GoldParticles() {
  const particles = useMemo<ParticleData[]>(() => {
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
