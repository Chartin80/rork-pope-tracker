import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation } from 'lucide-react-native';
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
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentEvent, nextEvent, todaysEvents, upcomingEvents, isLoading, refetch } = usePopeEvents();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleFindPope = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/map' as any);
  };

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
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12 }]}
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

        <NewsTicker />

        <View style={styles.section}>
          <LiveStatus event={currentEvent} />
        </View>

        <Pressable style={styles.findPopeButton} onPress={handleFindPope}>
          <LinearGradient
            colors={['rgba(212, 175, 55, 0.12)', 'rgba(212, 175, 55, 0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.findPopeGradient}
          >
            <View style={styles.findPopeIconWrap}>
              <Navigation size={16} color={Colors.gold} />
            </View>
            <Text style={styles.findPopeText}>Where is the Pope now?</Text>
            <Text style={styles.findPopeArrow}>→</Text>
          </LinearGradient>
        </Pressable>

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
                <EventCard key={event.id} event={event} isTimeline={index < todaysEvents.length - 1} />
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
    color: Colors.goldLight,
    fontSize: 32,
    fontWeight: '700' as const,
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
    color: Colors.whiteSecondary,
    fontSize: 20,
    fontWeight: '700' as const,
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
  findPopeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
  },
  findPopeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  findPopeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findPopeText: {
    color: Colors.goldLight,
    fontSize: 14,
    fontWeight: '600' as const,
    flex: 1,
    letterSpacing: -0.1,
  },
  findPopeArrow: {
    color: Colors.goldWarm,
    fontSize: 18,
    fontWeight: '300' as const,
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
});
