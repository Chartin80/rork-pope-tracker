import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import EventCard from '@/components/EventCard';
import { PopeEvent } from '@/types';

const QUICK_FILTERS = ['audience', 'mass', 'visit', 'speech', 'prayer', 'angelus'] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { events } = usePopeEvents();
  const [query, setQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    let results = [...events];

    if (activeFilter) {
      results = results.filter(e => e.category === activeFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.locationDetail?.toLowerCase().includes(q) ?? false)
      );
    }

    return results.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.time.localeCompare(a.time);
    });
  }, [events, query, activeFilter]);

  const handleFilterPress = useCallback((filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const filterLabel = useCallback((f: string): string => {
    const labels: Record<string, string> = {
      audience: 'Audiences',
      mass: 'Masses',
      visit: 'Visits',
      speech: 'Speeches',
      prayer: 'Prayers',
      angelus: 'Angelus',
    };
    return labels[f] ?? f;
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Search</Text>
        <Text style={styles.pageSubtitle}>Find papal events and speeches</Text>
      </View>

      <View style={styles.searchBar}>
        <SearchIcon size={18} color={Colors.whiteDim} />
        <TextInput
          style={styles.input}
          placeholder="Search events, locations..."
          placeholderTextColor={Colors.whiteDim}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          testID="search-input"
        />
        {query.length > 0 && (
          <Pressable onPress={clearSearch} hitSlop={12}>
            <X size={18} color={Colors.whiteMuted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {QUICK_FILTERS.map(f => (
          <Pressable
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => handleFilterPress(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {filterLabel(f)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.results}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {!query && !activeFilter && (
          <View style={styles.browseHint}>
            <TrendingUp size={20} color={Colors.whiteDim} />
            <Text style={styles.browseHintText}>
              Browse all {events.length} events or search above
            </Text>
          </View>
        )}

        <Text style={styles.resultCount}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
        </Text>

        <View style={styles.eventsList}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} showDate />
          ))}
        </View>

        {filteredEvents.length === 0 && (
          <View style={styles.empty}>
            <SearchIcon size={40} color={Colors.whiteDim} />
            <Text style={styles.emptyTitle}>No events found</Text>
            <Text style={styles.emptyText}>Try a different search term or filter</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: {
    color: Colors.gold,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.midnightCard,
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    padding: 0,
  },
  filtersScroll: {
    maxHeight: 48,
    marginTop: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.midnightCard,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.goldMuted,
    borderColor: Colors.gold,
  },
  filterText: {
    color: Colors.whiteMuted,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  filterTextActive: {
    color: Colors.gold,
    fontWeight: '600' as const,
  },
  results: {
    flex: 1,
    marginTop: 8,
  },
  resultsContent: {
    padding: 20,
    paddingBottom: 40,
  },
  browseHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    backgroundColor: Colors.midnightCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  browseHintText: {
    color: Colors.whiteMuted,
    fontSize: 13,
    flex: 1,
  },
  resultCount: {
    color: Colors.whiteDim,
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase' as const,
  },
  eventsList: {
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 10,
  },
  emptyTitle: {
    color: Colors.whiteSecondary,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  emptyText: {
    color: Colors.whiteDim,
    fontSize: 14,
  },
});
