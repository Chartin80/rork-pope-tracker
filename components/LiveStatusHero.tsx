import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MapPin, Radio } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PopeEvent } from '@/types';

interface LiveStatusHeroProps {
  event: PopeEvent | null;
}

export default function LiveStatusHero({ event }: LiveStatusHeroProps) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.2)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const borderGlow = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: 1.3, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.8, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const ring = Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 0.8, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    const border = Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlow, { toValue: 0.45, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(borderGlow, { toValue: 0.15, duration: 2200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    glow.start();
    ring.start();
    border.start();
    return () => { pulse.stop(); glow.stop(); ring.stop(); border.stop(); };
  }, [pulseScale, glowOpacity, ringScale, borderGlow]);

  const pulseOpacity = pulseScale.interpolate({
    inputRange: [1, 1.3],
    outputRange: [0.8, 0],
  });

  if (!event) {
    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['rgba(17, 24, 39, 0.9)', 'rgba(10, 15, 28, 0.95)']}
          style={styles.cardGradient}
        >
          <View style={styles.emptyState}>
            <View style={styles.emptyDotOuter}>
              <View style={styles.emptyDot} />
            </View>
            <Text style={styles.emptyLabel}>No current event</Text>
            <Text style={styles.emptySubtext}>Schedule will resume shortly</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.06)', 'rgba(17, 24, 39, 0.95)', 'rgba(10, 15, 28, 0.98)']}
        locations={[0, 0.4, 1]}
        style={styles.cardGradient}
      >
        <View style={styles.topRow}>
          <View style={styles.liveChip}>
            <View style={styles.liveIndicatorWrap}>
              <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
              <View style={styles.liveDotCore} />
            </View>
            <Text style={styles.liveLabel}>{event.isLive ? 'LIVE NOW' : 'CURRENT'}</Text>
          </View>
          <Animated.View style={{ opacity: borderGlow }}>
            <Radio size={16} color={Colors.goldWarm} />
          </Animated.View>
        </View>

        <Text style={styles.popeTitle}>Pope Leo XIV</Text>
        <Text style={styles.statusText}>is currently at</Text>

        <View style={styles.locationBlock}>
          <View style={styles.locationIconWrap}>
            <Animated.View style={[styles.locationGlow, { opacity: glowOpacity, transform: [{ scale: ringScale }] }]} />
            <LinearGradient
              colors={['#D4AF37', '#B8942E']}
              style={styles.locationIconGradient}
            >
              <MapPin size={18} color={Colors.midnight} />
            </LinearGradient>
          </View>
          <View style={styles.locationTextWrap}>
            <Text style={styles.locationName}>{event.location}</Text>
            {event.locationDetail && (
              <Text style={styles.locationDetail}>{event.locationDetail}</Text>
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.eventTitle}>{event.title}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  cardGradient: {
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  liveIndicatorWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.crimson,
  },
  liveDotCore: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.crimson,
  },
  liveLabel: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  popeTitle: {
    fontFamily: Fonts.heading.bold,
    color: Colors.white,
    fontSize: 32,
    letterSpacing: -1,
    marginBottom: 2,
  },
  statusText: {
    color: Colors.whiteDim,
    fontSize: 15,
    fontWeight: '400' as const,
    marginBottom: 16,
    fontStyle: 'italic' as const,
    letterSpacing: 0.3,
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(212, 175, 55, 0.04)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
  },
  locationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  locationIconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: {
    flex: 1,
  },
  locationName: {
    fontFamily: Fonts.heading.regular,
    color: Colors.goldLight,
    fontSize: 19,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  locationDetail: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    marginVertical: 18,
  },
  eventTitle: {
    color: Colors.whiteSecondary,
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  emptyDotOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 107, 130, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.whiteDim,
  },
  emptyLabel: {
    color: Colors.whiteMuted,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  emptySubtext: {
    color: Colors.whiteDim,
    fontSize: 13,
  },
});
