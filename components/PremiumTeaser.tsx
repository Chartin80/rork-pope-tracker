import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, Bell, Archive, Palette, Users, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import * as Haptics from 'expo-haptics';

const FEATURES = [
  { icon: Bell, label: 'Push notifications before events' },
  { icon: Archive, label: 'Full speech archive access' },
  { icon: Palette, label: 'Exclusive sacred themes' },
  { icon: Users, label: 'Family sharing (up to 6)' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PremiumTeaser() {
  const router = useRouter();
  const shimmerOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/premium' as any);
  };

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const scaleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.outer, scaleAnimatedStyle]}>
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
            <Animated.View style={shimmerAnimatedStyle}>
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

          <AnimatedPressable
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
          </AnimatedPressable>
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
    fontFamily: Fonts.heading.bold,
    color: Colors.goldLight,
    fontSize: 17,
    letterSpacing: -0.3,
  },
  price: {
    color: Colors.goldWarm,
    fontSize: 13,
    fontWeight: '500',
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
    fontWeight: '400',
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
    fontFamily: Fonts.heading.bold,
    color: Colors.midnight,
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
