import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Crown, Bell, Archive, Palette, Users } from 'lucide-react-native';
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

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Premium teaser pressed');
  };

  const borderOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.4],
  });

  return (
    <Animated.View style={[styles.card, { borderColor: `rgba(212, 175, 55, 0.25)` }]}>
      <View style={styles.header}>
        <View style={styles.crownBadge}>
          <Crown size={16} color={Colors.gold} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Pope Tracker Premium</Text>
          <Text style={styles.price}>$2.99/year</Text>
        </View>
      </View>

      <View style={styles.features}>
        {FEATURES.map((feat, i) => (
          <View key={i} style={styles.featureRow}>
            <feat.icon size={14} color={Colors.goldWarm} />
            <Text style={styles.featureText}>{feat.label}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Unlock Premium</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(212, 175, 55, 0.04)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  crownBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: Colors.gold,
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
    gap: 10,
    marginBottom: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    color: Colors.whiteMuted,
    fontSize: 13,
    fontWeight: '400' as const,
  },
  button: {
    backgroundColor: Colors.gold,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: Colors.midnight,
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
});
