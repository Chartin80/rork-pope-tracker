import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { PopeEvent } from '@/types';
import { getSecondsUntil, formatTime, formatEventDateShort } from '@/lib/utils';

interface CountdownProps {
  event: PopeEvent;
}

export default function Countdown({ event }: CountdownProps) {
  const [seconds, setSeconds] = useState<number>(() => getSecondsUntil(event));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsUntil(event));
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>NEXT EVENT</Text>
      <View style={styles.timerRow}>
        <View style={styles.timerUnit}>
          <Text style={styles.timerValue}>{String(hours).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>HRS</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.timerUnit}>
          <Text style={styles.timerValue}>{String(mins).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>MIN</Text>
        </View>
        <Text style={styles.colon}>:</Text>
        <View style={styles.timerUnit}>
          <Text style={styles.timerValue}>{String(secs).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>SEC</Text>
        </View>
      </View>
      <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
      <Text style={styles.eventMeta}>
        {formatEventDateShort(event.date)} at {formatTime(event.time)} · {event.location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  label: {
    color: Colors.whiteDim,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2,
    marginBottom: 14,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 56,
  },
  timerValue: {
    color: Colors.gold,
    fontSize: 40,
    fontWeight: '200' as const,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  timerLabel: {
    color: Colors.whiteDim,
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  colon: {
    color: Colors.goldLight,
    fontSize: 32,
    fontWeight: '200' as const,
    marginHorizontal: 4,
    marginBottom: 14,
  },
  eventName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  eventMeta: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
