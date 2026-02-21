import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday as isDayToday } from 'date-fns';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import EventCard from '@/components/EventCard';
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <CalendarDays size={22} color={Colors.gold} />
            <Text style={styles.pageTitle}>Calendar</Text>
          </View>
          <Text style={styles.pageSubtitle}>Papal schedule at a glance</Text>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <Pressable onPress={goToPrevMonth} style={styles.navButton}>
              <ChevronLeft size={20} color={Colors.gold} />
            </Pressable>
            <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>
            <Pressable onPress={goToNextMonth} style={styles.navButton}>
              <ChevronRight size={20} color={Colors.gold} />
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
                  <Text
                    style={[
                      styles.dayText,
                      !inMonth && styles.dayTextMuted,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                  {hasEvents && inMonth && (
                    <View style={[styles.eventDot, isSelected && styles.eventDotSelected]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <View style={styles.sectionAccent} />
            <Text style={styles.eventsDateLabel}>
              {format(selectedDate, 'EEEE, MMMM d')}
            </Text>
          </View>
          {selectedEvents.length === 0 ? (
            <View style={styles.noEvents}>
              <CalendarDays size={28} color={Colors.whiteDim} />
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
    gap: 10,
  },
  pageTitle: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: Colors.whiteDim,
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic' as const,
  },
  calendarCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.midnightCard,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.midnightBorderLight,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.goldMuted,
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
    color: Colors.whiteDim,
    fontSize: 12,
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
  dayCellSelected: {
    backgroundColor: Colors.gold,
    borderRadius: 22,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderColor: Colors.goldGlow,
    borderRadius: 22,
  },
  dayText: {
    color: Colors.whiteSecondary,
    fontSize: 15,
    fontWeight: '400' as const,
  },
  dayTextMuted: {
    color: Colors.whiteDim,
    opacity: 0.3,
  },
  dayTextSelected: {
    color: Colors.midnight,
    fontWeight: '700' as const,
  },
  dayTextToday: {
    color: Colors.gold,
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
    height: 18,
    borderRadius: 1.5,
    backgroundColor: Colors.gold,
  },
  eventsDateLabel: {
    color: Colors.whiteSecondary,
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  noEvents: {
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 8,
  },
  noEventsText: {
    color: Colors.whiteMuted,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  noEventsSubtext: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  eventsList: {
    gap: 10,
  },
});
