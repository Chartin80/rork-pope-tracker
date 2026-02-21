import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
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
      <View style={styles.labelRow}>
        <Clock size={13} color={Colors.goldWarm} />
        <Text style={styles.label}>NEXT EVENT</Text>
      </View>

      <View style={styles.timerRow}>
        {units.map((unit, i) => (
          <React.Fragment key={unit.label}>
            {i > 0 && <Text style={styles.colon}>:</Text>}
            <View style={styles.timerUnit}>
              <View style={styles.timerValueBg}>
                <Text style={styles.timerValue}>
                  {String(unit.value).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.timerLabel}>{unit.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.eventMeta}>
          {formatEventDateShort(event.date)} at {formatTime(event.time)} · {event.location}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.midnightBorderLight,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
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
    marginBottom: 20,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 64,
  },
  timerValueBg: {
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    minWidth: 72,
    alignItems: 'center',
  },
  timerValue: {
    color: Colors.gold,
    fontSize: 42,
    fontWeight: '200' as const,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
    lineHeight: 48,
  },
  timerLabel: {
    color: Colors.whiteDim,
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 2,
    marginTop: 6,
  },
  colon: {
    color: Colors.goldWarm,
    fontSize: 34,
    fontWeight: '200' as const,
    marginHorizontal: 2,
    marginTop: 10,
    opacity: 0.5,
  },
  eventInfo: {
    alignItems: 'center',
    gap: 4,
  },
  eventName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    letterSpacing: -0.3,
  },
  eventMeta: {
    color: Colors.whiteMuted,
    fontSize: 13,
    textAlign: 'center' as const,
  },
});
