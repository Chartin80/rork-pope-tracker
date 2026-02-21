import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
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
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}` as any);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={`event-card-${event.id}`}
      >
        <View style={[styles.card, event.isLive && styles.cardLive]}>
          {isTimeline && (
            <View style={styles.timelineBar}>
              <View style={[styles.timelineDot, event.isLive && styles.timelineDotLive]} />
              <View style={styles.timelineLine} />
            </View>
          )}
          <View style={styles.timeColumn}>
            <Text style={styles.time}>{formatTime(event.time)}</Text>
            {showDate && (
              <Text style={styles.dateText}>{formatEventDateShort(event.date)}</Text>
            )}
            {event.isLive && (
              <View style={styles.liveChip}>
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
          <View style={styles.content}>
            <CategoryBadge category={event.category} compact />
            <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
            <View style={styles.metaRow}>
              <MapPin size={11} color={Colors.whiteDim} />
              <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
            </View>
          </View>
          <View style={styles.chevronWrap}>
            <ChevronRight size={16} color={Colors.whiteDim} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.midnightCard,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 12,
  },
  cardLive: {
    borderColor: Colors.crimsonGlow,
    backgroundColor: 'rgba(183, 28, 28, 0.04)',
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.midnightBorderLight,
    marginTop: 20,
  },
  timelineDotLive: {
    backgroundColor: Colors.gold,
  },
  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: Colors.midnightBorder,
    marginTop: 4,
  },
  timeColumn: {
    alignItems: 'center',
    minWidth: 56,
    gap: 4,
  },
  time: {
    color: Colors.goldLight,
    fontSize: 13,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    color: Colors.whiteDim,
    fontSize: 11,
    fontWeight: '500' as const,
  },
  liveChip: {
    backgroundColor: Colors.crimsonGlow,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.midnightBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
