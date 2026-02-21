import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Crown, Bell, Archive, Palette, Users, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

const FEATURES = [
  { icon: Bell, label: 'Push notifications before events' },
  { icon: Archive, label: 'Full speech archive access' },
  { icon: Palette, label: 'Exclusive sacred themes' },
  { icon: Users, label: 'Family sharing (up to 6)' },
];

export default function PremiumTeaser() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Premium teaser pressed');
  };

  const borderOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  return (
    <Animated.View style={[styles.outer, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['rgba(212, 175, 55, 0.08)', 'rgba(212, 175, 55, 0.02)', 'rgba(10, 15, 28, 0.95)']}
          locations={[0, 0.3, 1]}
          style={styles.card}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={['#D4AF37', '#B8942E']}
              style={styles.crownBadge}
            >
              <Crown size={16} color={Colors.midnight} />
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.title}>Pope Tracker Premium</Text>
              <Text style={styles.price}>$2.99/year</Text>
            </View>
            <Animated.View style={{ opacity: shimmerAnim }}>
              <Sparkles size={18} color={Colors.goldWarm} />
            </Animated.View>
          </View>

          <View style={styles.features}>
            {FEATURES.map((feat, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <feat.icon size={13} color={Colors.gold} />
                </View>
                <Text style={styles.featureText}>{feat.label}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.buttonWrap}
          >
            <LinearGradient
              colors={['#D4AF37', '#C5A26F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Crown size={14} color={Colors.midnight} />
              <Text style={styles.buttonText}>Unlock Premium</Text>
            </LinearGradient>
          </Pressable>
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 24,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  card: {
    padding: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  crownBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: Colors.goldLight,
    fontSize: 17,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  price: {
    color: Colors.goldWarm,
    fontSize: 13,
    fontWeight: '500' as const,
    marginTop: 2,
  },
  features: {
    gap: 12,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    color: Colors.whiteMuted,
    fontSize: 13,
    fontWeight: '400' as const,
    flex: 1,
  },
  buttonWrap: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  buttonText: {
    color: Colors.midnight,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
});
