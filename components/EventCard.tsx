import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { PopeEvent } from '@/types';
import { formatTime } from '@/lib/utils';
import CategoryBadge from './CategoryBadge';
import * as Haptics from 'expo-haptics';

interface EventCardProps {
  event: PopeEvent;
  showDate?: boolean;
}

export default function EventCard({ event, showDate }: EventCardProps) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      testID={`event-card-${event.id}`}
    >
      <View style={styles.timeColumn}>
        <Text style={styles.time}>{formatTime(event.time)}</Text>
        {event.isLive && (
          <View style={styles.liveDot} />
        )}
      </View>
      <View style={styles.content}>
        <CategoryBadge category={event.category} />
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={styles.metaRow}>
          <MapPin size={12} color={Colors.whiteDim} />
          <Text style={styles.location} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>
      <ChevronRight size={18} color={Colors.whiteDim} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.midnightCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.8,
    backgroundColor: Colors.midnightLight,
  },
  timeColumn: {
    alignItems: 'center',
    minWidth: 54,
  },
  time: {
    color: Colors.goldLight,
    fontSize: 13,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'],
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.crimson,
    marginTop: 6,
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
});
