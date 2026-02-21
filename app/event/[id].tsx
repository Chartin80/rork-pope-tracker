import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share, Platform, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Share2, ExternalLink, CalendarPlus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import CategoryBadge from '@/components/CategoryBadge';
import { formatEventDate, formatTime } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { events } = usePopeEvents();

  const event = useMemo(() => events.find(e => e.id === id), [events, id]);

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!event) return;
    try {
      await Share.share({
        message: `${event.title} - ${formatEventDate(event.date)} at ${formatTime(event.time)}, ${event.location}. Pope Tracker`,
      });
    } catch (err) {
      console.log('Share error:', err);
    }
  };

  const handleMapsLink = () => {
    if (!event) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    }
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Add to calendar:', event.id);
  };

  if (!event) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Event not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const firstLetter = event.description.charAt(0);
  const restDescription = event.description.slice(1);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => router.back()} style={styles.topBarButton} hitSlop={12}>
          <ArrowLeft size={20} color={Colors.white} />
        </Pressable>
        <View style={styles.topBarActions}>
          <Pressable onPress={handleShare} style={styles.topBarButton} hitSlop={12}>
            <Share2 size={18} color={Colors.white} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CategoryBadge category={event.category} />

        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <Clock size={16} color={Colors.gold} />
            </View>
            <View>
              <Text style={styles.metaLabel}>DATE & TIME</Text>
              <Text style={styles.metaValue}>
                {formatEventDate(event.date)}
              </Text>
              <Text style={styles.metaSubValue}>at {formatTime(event.time)}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <View style={styles.metaIcon}>
              <MapPin size={16} color={Colors.gold} />
            </View>
            <View style={styles.metaTextWrap}>
              <Text style={styles.metaLabel}>LOCATION</Text>
              <Text style={styles.metaValue}>{event.location}</Text>
              {event.locationDetail && (
                <Text style={styles.metaSubValue}>{event.locationDetail}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            onPress={handleMapsLink}
          >
            <ExternalLink size={15} color={Colors.gold} />
            <Text style={styles.actionText}>Maps</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            onPress={handleAddToCalendar}
          >
            <CalendarPlus size={15} color={Colors.gold} />
            <Text style={styles.actionText}>Calendar</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            onPress={handleShare}
          >
            <Share2 size={15} color={Colors.gold} />
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>About this event</Text>
          <View style={styles.descriptionWrap}>
            <Text style={styles.descriptionText}>
              <Text style={styles.dropCap}>{firstLetter}</Text>
              {restDescription}
            </Text>
          </View>
        </View>

        {event.isLive && (
          <View style={styles.liveBanner}>
            <View style={styles.liveIndicator} />
            <Text style={styles.liveText}>This event is currently in progress</Text>
          </View>
        )}

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.midnightBorder,
  },
  topBarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.midnightCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  metaCard: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.midnightBorderLight,
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  metaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.goldBorder,
    marginTop: 2,
  },
  metaTextWrap: {
    flex: 1,
  },
  metaLabel: {
    color: Colors.whiteDim,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  metaValue: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  metaSubValue: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 2,
  },
  metaDivider: {
    height: 1,
    backgroundColor: Colors.midnightBorder,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.midnightCard,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  actionButtonPressed: {
    backgroundColor: Colors.midnightCardHover,
    borderColor: Colors.goldBorder,
  },
  actionText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  descriptionSection: {
    gap: 12,
  },
  descriptionLabel: {
    color: Colors.whiteSecondary,
    fontSize: 19,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  descriptionWrap: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  descriptionText: {
    color: Colors.whiteMuted,
    fontSize: 15,
    lineHeight: 26,
  },
  dropCap: {
    color: Colors.gold,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.crimsonGlow,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(183, 28, 28, 0.35)',
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.crimsonLight,
  },
  liveText: {
    color: Colors.crimsonLight,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  notFoundText: {
    color: Colors.whiteMuted,
    fontSize: 18,
  },
  backButton: {
    backgroundColor: Colors.goldMuted,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.goldBorder,
  },
  backButtonText: {
    color: Colors.gold,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  footerSpacer: {
    height: 20,
  },
});
