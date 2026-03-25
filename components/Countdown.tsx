import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PopeEvent } from '@/types';
import { getSecondsUntil, formatTime, formatEventDateShort } from '@/lib/utils';

interface CountdownProps {
  event: PopeEvent;
}

export default function Countdown({ event }: CountdownProps) {
  const [seconds, setSeconds] = useState<number>(() => getSecondsUntil(event));
  const tickScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsUntil(event));
      Animated.sequence([
        Animated.timing(tickScale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
        Animated.spring(tickScale, { toValue: 1, damping: 8, stiffness: 300, mass: 1, useNativeDriver: true }),
      ]).start();
    }, 1000);
    return () => clearInterval(interval);
  }, [event, tickScale]);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const units = days > 0
    ? [
        { value: days, label: 'DAYS' },
        { value: hours, label: 'HRS' },
        { value: mins, label: 'MIN' },
      ]
    : [
        { value: hours, label: 'HRS' },
        { value: mins, label: 'MIN' },
        { value: secs, label: 'SEC' },
      ];

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(17, 24, 39, 0.95)', 'rgba(10, 15, 28, 0.98)']}
        style={styles.cardGradient}
      >
        <View style={styles.labelRow}>
          <View style={styles.labelIconWrap}>
            <Clock size={12} color={Colors.gold} />
          </View>
          <Text style={styles.label}>NEXT EVENT</Text>
        </View>

        <Animated.View style={[styles.timerRow, { transform: [{ scale: tickScale }] }]}>
          {units.map((unit, i) => (
            <React.Fragment key={unit.label}>
              {i > 0 && <Text style={styles.colon}>:</Text>}
              <View style={styles.timerUnit}>
                <LinearGradient
                  colors={['rgba(212, 175, 55, 0.08)', 'rgba(212, 175, 55, 0.02)']}
                  style={styles.timerValueBg}
                >
                  <Text style={styles.timerValue}>
                    {String(unit.value).padStart(2, '0')}
                  </Text>
                </LinearGradient>
                <Text style={styles.timerLabel}>{unit.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
          <View style={styles.eventMetaRow}>
            <Text style={styles.eventMeta}>
              {formatEventDateShort(event.date)} at {formatTime(event.time)}
            </Text>
            <View style={styles.metaDot} />
            <Text style={styles.eventMeta}>{event.location}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.midnightBorderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 22,
  },
  labelIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.goldWarm,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2.5,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 72,
  },
  timerValueBg: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.12)',
    minWidth: 78,
    alignItems: 'center',
  },
  timerValue: {
    fontFamily: Fonts.heading.bold,
    color: Colors.goldLight,
    fontSize: 44,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
    lineHeight: 50,
  },
  timerLabel: {
    color: Colors.whiteDim,
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 2.5,
    marginTop: 8,
  },
  colon: {
    color: Colors.goldWarm,
    fontSize: 36,
    fontWeight: '200' as const,
    marginHorizontal: 2,
    marginTop: 12,
    opacity: 0.4,
  },
  eventInfo: {
    alignItems: 'center',
    gap: 6,
  },
  eventName: {
    fontFamily: Fonts.heading.regular,
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600' as const,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMeta: {
    color: Colors.whiteMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.whiteDim,
  },
});
