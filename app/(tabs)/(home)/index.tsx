import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import LiveStatus from '@/components/LiveStatus';
import Countdown from '@/components/Countdown';
import EventCard from '@/components/EventCard';
import NewsTicker from '@/components/NewsTicker';
import PapalCrest from '@/components/PapalCrest';
import GoldSpinner from '@/components/GoldSpinner';
import GoldParticles from '@/components/GoldParticles';
import PremiumTeaser from '@/components/PremiumTeaser';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { currentEvent, nextEvent, todaysEvents, upcomingEvents, isLoading, refetch } = usePopeEvents();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 8 }]}
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
            <PapalCrest size={44} />
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Pope Tracker</Text>
              <Text style={styles.heroSubtitle}>Following His Holiness Pope Leo XIV</Text>
            </View>
          </View>
          <View style={styles.heroAccent} />
        </View>

        <NewsTicker />

        <View style={styles.section}>
          <LiveStatus event={currentEvent} />
        </View>

        {nextEvent && (
          <View style={styles.section}>
            <Countdown event={nextEvent} />
          </View>
        )}

        {todaysEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
            </View>
            <View style={styles.eventsList}>
              {todaysEvents.map((event, index) => (
                <EventCard key={event.id} event={event} isTimeline={index < todaysEvents.length - 1} />
              ))}
            </View>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionAccent} />
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

        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Text style={styles.footerText}>Made with love for the Church</Text>
          <Text style={styles.footerLink}>vatican.va</Text>
        </View>
      </ScrollView>
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
    gap: 14,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: Colors.gold,
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    color: Colors.whiteDim,
    fontSize: 13,
    fontWeight: '400' as const,
    marginTop: 3,
    fontStyle: 'italic' as const,
  },
  heroAccent: {
    height: 1,
    backgroundColor: Colors.goldBorder,
    marginTop: 18,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 2,
  },
  sectionAccent: {
    width: 3,
    height: 18,
    borderRadius: 1.5,
    backgroundColor: Colors.gold,
  },
  sectionTitle: {
    color: Colors.whiteSecondary,
    fontSize: 19,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
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
    width: 50,
    height: 1,
    backgroundColor: Colors.midnightBorder,
    marginBottom: 8,
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
  },
});
