import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PopeEvent } from '@/types';
import { formatTime, formatEventDateShort } from '@/lib/utils';
import CategoryBadge from './CategoryBadge';
import * as Haptics from 'expo-haptics';

interface EventCardProps {
  event: PopeEvent;
  showDate?: boolean;
  isTimeline?: boolean;
}

export default function EventCard({ event, showDate, isTimeline }: EventCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.965, damping: 15, stiffness: 300, mass: 1, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, damping: 15, stiffness: 300, mass: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}` as any);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={`event-card-${event.id}`}
      >
        <View style={[styles.cardOuter, event.isLive && styles.cardOuterLive]}>
          {isTimeline && (
            <View style={styles.timelineBar}>
              <View style={[styles.timelineDot, event.isLive && styles.timelineDotLive]} />
              <View style={styles.timelineLine} />
            </View>
          )}
          <View style={styles.cardInner}>
            <View style={styles.timeColumn}>
              <View style={styles.timeBadge}>
                <Text style={styles.time}>{formatTime(event.time)}</Text>
              </View>
              {showDate && (
                <Text style={styles.dateText}>{formatEventDateShort(event.date)}</Text>
              )}
              {event.isLive && (
                <LinearGradient
                  colors={['rgba(183, 28, 28, 0.25)', 'rgba(183, 28, 28, 0.1)']}
                  style={styles.liveChip}
                >
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </LinearGradient>
              )}
            </View>
            <View style={styles.content}>
              <CategoryBadge category={event.category} compact />
              <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
              <View style={styles.metaRow}>
                <MapPin size={11} color={Colors.goldWarm} />
                <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
              </View>
            </View>
            <View style={styles.chevronWrap}>
              <ChevronRight size={14} color={Colors.goldWarm} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    backgroundColor: Colors.midnightCard,
  },
  cardOuterLive: {
    borderColor: 'rgba(183, 28, 28, 0.3)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  timelineBar: {
    position: 'absolute',
    left: -18,
    top: 0,
    bottom: 0,
    width: 2,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.midnightBorderLight,
    marginTop: 22,
    borderWidth: 2,
    borderColor: Colors.midnight,
  },
  timelineDotLive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldMuted,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    marginTop: 4,
  },
  timeColumn: {
    alignItems: 'center',
    minWidth: 60,
    gap: 5,
  },
  timeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  time: {
    color: Colors.goldLight,
    fontSize: 12,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  dateText: {
    color: Colors.whiteDim,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.crimsonLight,
  },
  liveText: {
    color: Colors.crimsonLight,
    fontSize: 8,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: Fonts.heading.regular,
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  chevronWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
