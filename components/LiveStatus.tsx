import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PopeEvent } from '@/types';

interface LiveStatusProps {
  event: PopeEvent | null;
}

export default function LiveStatus({ event }: LiveStatusProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    glow.start();
    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  if (!event) {
    return (
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: Colors.whiteDim }]} />
          <Text style={styles.statusLabel}>No current event</Text>
        </View>
        <Text style={styles.locationText}>Schedule will resume shortly</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.liveChip}>
          <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }], opacity: glowAnim }]} />
          <View style={styles.liveDotInner} />
          <Text style={styles.liveText}>{event.isLive ? 'LIVE' : 'NOW'}</Text>
        </View>
      </View>
      <Text style={styles.title}>Pope Leo XIV</Text>
      <View style={styles.locationRow}>
        <MapPin size={16} color={Colors.gold} />
        <Text style={styles.locationText}>{event.location}</Text>
      </View>
      {event.locationDetail && (
        <Text style={styles.locationDetail}>{event.locationDetail}</Text>
      )}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{event.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    position: 'absolute',
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  liveDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  liveText: {
    color: Colors.gold,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
  title: {
    color: Colors.white,
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  locationDetail: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginLeft: 22,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusLabel: {
    color: Colors.whiteMuted,
    fontSize: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventInfo: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.midnightBorder,
  },
  eventTitle: {
    color: Colors.whiteSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
  },
});
