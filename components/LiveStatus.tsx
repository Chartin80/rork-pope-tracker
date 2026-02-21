import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MapPin, Radio } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { PopeEvent } from '@/types';

interface LiveStatusProps {
  event: PopeEvent | null;
}

export default function LiveStatus({ event }: LiveStatusProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.2)).current;
  const ringAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.6,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const ring = Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    glow.start();
    ring.start();
    return () => {
      pulse.stop();
      glow.stop();
      ring.stop();
    };
  }, [pulseAnim, glowAnim, ringAnim]);

  if (!event) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyState}>
          <View style={styles.emptyDot} />
          <Text style={styles.emptyLabel}>No current event</Text>
          <Text style={styles.emptySubtext}>Schedule will resume shortly</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.liveChip}>
          <View style={styles.liveIndicatorWrap}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseAnim }], opacity: glowAnim },
              ]}
            />
            <View style={styles.liveDotCore} />
          </View>
          <Text style={styles.liveLabel}>{event.isLive ? 'LIVE NOW' : 'CURRENT'}</Text>
        </View>
        <Radio size={16} color={Colors.goldWarm} style={{ opacity: 0.5 }} />
      </View>

      <Text style={styles.popeTitle}>Pope Leo XIV</Text>
      <Text style={styles.statusText}>is currently at</Text>

      <View style={styles.locationBlock}>
        <View style={styles.locationIconWrap}>
          <Animated.View style={[styles.locationGlow, { opacity: glowAnim, transform: [{ scale: ringAnim }] }]} />
          <MapPin size={20} color={Colors.gold} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  liveIndicatorWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  liveDotCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  liveLabel: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1.8,
  },
  popeTitle: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  statusText: {
    color: Colors.whiteDim,
    fontSize: 14,
    fontWeight: '400' as const,
    marginBottom: 14,
    fontStyle: 'italic' as const,
  },
  locationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.goldShimmer,
  },
  locationIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.goldGlow,
  },
  locationTextWrap: {
    flex: 1,
  },
  locationName: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  locationDetail: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.midnightBorder,
    marginVertical: 16,
  },
  eventTitle: {
    color: Colors.whiteSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  emptyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.whiteDim,
    marginBottom: 6,
  },
  emptyLabel: {
    color: Colors.whiteMuted,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  emptySubtext: {
    color: Colors.whiteDim,
    fontSize: 13,
  },
});
