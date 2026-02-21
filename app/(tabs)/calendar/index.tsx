import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday as isDayToday } from 'date-fns';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import EventCard from '@/components/EventCard';
import GoldParticles from '@/components/GoldParticles';
import { getEventsForDate } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { events } = usePopeEvents();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedDateStr = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const selectedEvents = useMemo(() => getEventsForDate(events, selectedDateStr), [events, selectedDateStr]);

  const eventDates = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => set.add(e.date));
    return set;
  }, [events]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const goToPrevMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  const selectDay = useCallback((day: Date) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDate(day);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GoldParticles />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <LinearGradient colors={['#D4AF37', '#B8942E']} style={styles.headerIconWrap}>
              <CalendarDays size={18} color={Colors.midnight} />
            </LinearGradient>
            <View>
              <Text style={styles.pageTitle}>Calendar</Text>
              <Text style={styles.pageSubtitle}>Papal schedule at a glance</Text>
            </View>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <LinearGradient
            colors={['rgba(17, 24, 39, 0.95)', 'rgba(10, 15, 28, 0.98)']}
            style={styles.calendarCardGradient}
          >
            <View style={styles.monthNav}>
              <Pressable onPress={goToPrevMonth} style={styles.navButton}>
                <ChevronLeft size={18} color={Colors.gold} />
              </Pressable>
              <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>
              <Pressable onPress={goToNextMonth} style={styles.navButton}>
                <ChevronRight size={18} color={Colors.gold} />
              </Pressable>
            </View>

            <View style={styles.weekdayRow}>
              {WEEKDAYS.map((d, i) => (
                <View key={`${d}-${i}`} style={styles.weekdayCell}>
                  <Text style={styles.weekdayText}>{d}</Text>
                </View>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((day, i) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const inMonth = isSameMonth(day, currentMonth);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isDayToday(day);
                const hasEvents = eventDates.has(dayStr);

                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isToday && !isSelected && styles.dayCellToday,
                    ]}
                    onPress={() => selectDay(day)}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={['#D4AF37', '#B8942E']}
                        style={styles.selectedDayGradient}
                      >
                        <Text style={[styles.dayText, styles.dayTextSelected]}>
                          {format(day, 'd')}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <Text
                        style={[
                          styles.dayText,
                          !inMonth && styles.dayTextMuted,
                          isToday && styles.dayTextToday,
                        ]}
                      >
                        {format(day, 'd')}
                      </Text>
                    )}
                    {hasEvents && inMonth && !isSelected && (
                      <View style={styles.eventDot} />
                    )}
                    {hasEvents && inMonth && isSelected && (
                      <View style={styles.eventDotSelected} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <LinearGradient
              colors={['#D4AF37', '#B8942E']}
              style={styles.sectionAccent}
            />
            <Text style={styles.eventsDateLabel}>
              {format(selectedDate, 'EEEE, MMMM d')}
            </Text>
          </View>
          {selectedEvents.length === 0 ? (
            <View style={styles.noEvents}>
              <View style={styles.noEventsIconWrap}>
                <CalendarDays size={24} color={Colors.goldWarm} />
              </View>
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <Text style={styles.noEventsSubtext}>Select a day with a gold dot</Text>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {selectedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </View>
          )}
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    color: Colors.goldLight,
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: Colors.whiteDim,
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic' as const,
  },
  calendarCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.12)',
  },
  calendarCardGradient: {
    padding: 18,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    color: Colors.goldWarm,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayCellSelected: {},
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 22,
  },
  selectedDayGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    color: Colors.whiteSecondary,
    fontSize: 15,
    fontWeight: '400' as const,
  },
  dayTextMuted: {
    color: Colors.whiteDim,
    opacity: 0.25,
  },
  dayTextSelected: {
    color: Colors.midnight,
    fontWeight: '700' as const,
  },
  dayTextToday: {
    color: Colors.goldLight,
    fontWeight: '600' as const,
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.gold,
  },
  eventDotSelected: {
    position: 'absolute',
    bottom: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.midnight,
  },
  eventsSection: {
    padding: 20,
    gap: 14,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 3,
    height: 20,
    borderRadius: 1.5,
  },
  eventsDateLabel: {
    color: Colors.whiteSecondary,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  noEvents: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 22,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 10,
  },
  noEventsIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  noEventsText: {
    color: Colors.whiteMuted,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  noEventsSubtext: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  eventsList: {
    gap: 10,
  },
});
