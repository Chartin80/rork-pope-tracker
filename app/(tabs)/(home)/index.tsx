import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import LiveStatusHero from '@/components/LiveStatusHero';
import Countdown from '@/components/Countdown';
import EventCard from '@/components/EventCard';
import TimelineEventCard from '@/components/TimelineEventCard';
import GoldTicker from '@/components/GoldTicker';
import PapalCrest from '@/components/PapalCrest';
import GoldSpinner from '@/components/GoldSpinner';
import GoldParticles from '@/components/GoldParticles';
import PremiumTeaser from '@/components/PremiumTeaser';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentEvent, nextEvent, todaysEvents, upcomingEvents, isLoading, refetch } = usePopeEvents();
  const [refreshing, setRefreshing] = React.useState(false);
  const fabScale = useSharedValue(1);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleFindPope = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/map' as any);
  };

  const handleFabPressIn = () => {
    fabScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handleFabPressOut = () => {
    fabScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <GoldParticles />
        <GoldSpinner size={48} />
        <Text style={styles.loadingText}>Loading papal schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoldParticles />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
          />
        }
      >
        <View style={styles.heroHeader}>
          <View style={styles.heroTop}>
            <PapalCrest size={52} />
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Pope Tracker</Text>
              <Text style={styles.heroSubtitle}>Following His Holiness Pope Leo XIV</Text>
            </View>
          </View>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.3)', 'rgba(212, 175, 55, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.heroAccent}
          />
        </View>

        <View style={styles.section}>
          <LiveStatusHero event={currentEvent} />
        </View>

        {nextEvent && (
          <View style={styles.section}>
            <Countdown event={nextEvent} />
          </View>
        )}

        {todaysEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={['#D4AF37', '#B8942E']}
                style={styles.sectionAccent}
              />
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{todaysEvents.length}</Text>
              </View>
            </View>
            <View style={styles.eventsList}>
              {todaysEvents.map((event, index) => (
                <TimelineEventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isLast={index === todaysEvents.length - 1}
                />
              ))}
            </View>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={['#D4AF37', '#B8942E']}
                style={styles.sectionAccent}
              />
              <Text style={styles.sectionTitle}>Upcoming</Text>
            </View>
            <View style={styles.eventsList}>
              {upcomingEvents.slice(0, 5).map(event => (
                <EventCard key={event.id} event={event} showDate />
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <PremiumTeaser />
        </View>

        <GoldTicker />

        <View style={styles.footer}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.footerDivider}
          />
          <Text style={styles.footerCross}>✝</Text>
          <Text style={styles.footerText}>Made with love for the Church</Text>
          <Text style={styles.footerLink}>vatican.va</Text>
        </View>
      </ScrollView>

      <AnimatedPressable
        style={[styles.fab, fabAnimatedStyle, { bottom: insets.bottom + 90 }]}
        onPress={handleFindPope}
        onPressIn={handleFabPressIn}
        onPressOut={handleFabPressOut}
      >
        <LinearGradient
          colors={['#D4AF37', '#B8942E']}
          style={styles.fabGradient}
        >
          <Navigation size={22} color={Colors.midnight} />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.whiteMuted,
    fontSize: 14,
    marginTop: 16,
    letterSpacing: 0.3,
    fontStyle: 'italic' as const,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 18,
  },
  heroHeader: {
    marginBottom: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.heading.bold,
    color: Colors.goldLight,
    fontSize: 32,
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: Colors.whiteDim,
    fontSize: 13,
    fontWeight: '400' as const,
    marginTop: 4,
    fontStyle: 'italic' as const,
    letterSpacing: 0.2,
  },
  heroAccent: {
    height: 1,
    marginTop: 20,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  sectionAccent: {
    width: 3,
    height: 20,
    borderRadius: 1.5,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    color: Colors.whiteSecondary,
    fontSize: 20,
    letterSpacing: -0.4,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  sectionBadgeText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700' as const,
  },
  eventsList: {
    gap: 10,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 8,
    gap: 8,
  },
  footerDivider: {
    width: 60,
    height: 1,
    marginBottom: 8,
  },
  footerCross: {
    color: Colors.goldWarm,
    fontSize: 16,
    opacity: 0.4,
  },
  footerText: {
    color: Colors.whiteDim,
    fontSize: 12,
    fontStyle: 'italic' as const,
  },
  footerLink: {
    color: Colors.goldWarm,
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
