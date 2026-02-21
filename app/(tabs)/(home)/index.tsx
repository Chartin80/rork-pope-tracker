import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import LiveStatus from '@/components/LiveStatus';
import Countdown from '@/components/Countdown';
import EventCard from '@/components/EventCard';
import NewsTicker from '@/components/NewsTicker';
import PapalCrest from '@/components/PapalCrest';
import GoldSpinner from '@/components/GoldSpinner';

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
        <GoldSpinner size={48} />
        <Text style={styles.loadingText}>Loading papal schedule...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <PapalCrest size={36} />
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Pope Tracker</Text>
              <Text style={styles.headerSubtitle}>Following Pope Leo XIV</Text>
            </View>
          </View>
          <View style={styles.headerLine} />
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
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <View style={styles.eventsList}>
              {todaysEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}

        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <View style={styles.eventsList}>
              {upcomingEvents.slice(0, 5).map(event => (
                <EventCard key={event.id} event={event} showDate />
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
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
    marginTop: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: Colors.whiteMuted,
    fontSize: 14,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  headerLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.goldMuted,
    marginTop: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: Colors.whiteSecondary,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  eventsList: {
    gap: 10,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
    gap: 6,
  },
  footerLine: {
    width: 40,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.midnightBorder,
    marginBottom: 10,
  },
  footerText: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  footerLink: {
    color: Colors.goldLight,
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
