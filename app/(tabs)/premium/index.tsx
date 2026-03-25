import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crown, Bell, FileText, Palette, Users, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import GoldParticles from '@/components/GoldParticles';

const FEATURES = [
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Instant alerts for live papal events and breaking news',
  },
  {
    icon: FileText,
    title: 'Speech Archive',
    description: 'Full transcripts and translations of all papal addresses',
  },
  {
    icon: Palette,
    title: 'Sacred Themes',
    description: 'Exclusive liturgical themes for each season',
  },
  {
    icon: Users,
    title: 'Family Sharing',
    description: 'Share your subscription with up to 5 family members',
  },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const shimmerPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerPosition]);

  const shimmerTranslateX = shimmerPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  const handleSubscribe = () => {
    console.log('Subscribe pressed - RevenueCat integration placeholder');
  };

  const handleRestore = () => {
    console.log('Restore purchases pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GoldParticles />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#D4AF37', '#B8942E', '#C9A227']}
            style={styles.crownWrap}
          >
            <Crown size={32} color={Colors.midnight} />
          </LinearGradient>
          <Text style={styles.title}>Pope Tracker</Text>
          <Text style={styles.premiumBadge}>PREMIUM</Text>
          <Text style={styles.subtitle}>
            Unlock the full sacred experience
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                style={styles.featureIconWrap}
              >
                <feature.icon size={22} color={Colors.gold} />
              </LinearGradient>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <View style={styles.checkWrap}>
                <Check size={16} color={Colors.gold} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pricingContainer}>
          <Text style={styles.priceAmount}>$2.99</Text>
          <Text style={styles.pricePeriod}>per year</Text>
          <Text style={styles.priceNote}>Less than a penny a day</Text>
        </View>

        <Pressable onPress={handleSubscribe} style={styles.subscribeButtonWrap}>
          <LinearGradient
            colors={['#D4AF37', '#B8942E', '#C9A227']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subscribeButton}
          >
            <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerTranslateX }, { rotate: '25deg' }] }]} />
            <Text style={styles.subscribeText}>Subscribe Now</Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={handleRestore} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </Pressable>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  crownWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 32,
    color: Colors.goldLight,
    letterSpacing: -0.5,
  },
  premiumBadge: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 3,
    color: Colors.gold,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
  },
  subtitle: {
    color: Colors.whiteDim,
    fontSize: 16,
    marginTop: 16,
    fontStyle: 'italic' as const,
  },
  featuresContainer: {
    gap: 12,
    marginTop: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.midnightCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 14,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontFamily: Fonts.heading.regular,
    fontSize: 17,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.whiteMuted,
    lineHeight: 18,
  },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingContainer: {
    alignItems: 'center',
    marginTop: 32,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  priceAmount: {
    fontFamily: Fonts.heading.bold,
    fontSize: 48,
    color: Colors.gold,
    letterSpacing: -1,
  },
  pricePeriod: {
    fontSize: 18,
    color: Colors.whiteMuted,
    marginTop: 4,
  },
  priceNote: {
    fontSize: 13,
    color: Colors.whiteDim,
    marginTop: 8,
    fontStyle: 'italic' as const,
  },
  subscribeButtonWrap: {
    marginTop: 32,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    width: 100,
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subscribeText: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.midnight,
    letterSpacing: 0.5,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  restoreText: {
    fontSize: 14,
    color: Colors.gold,
    textDecorationLine: 'underline' as const,
  },
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 11,
    color: Colors.whiteDim,
    textAlign: 'center',
    lineHeight: 16,
  },
});
