import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation, MapPin, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import { PopeEvent } from '@/types';
import { formatTime, formatEventDateShort } from '@/lib/utils';
import { getCategoryLabel, getCategoryColor } from '@/lib/locations';
import CategoryBadge from '@/components/CategoryBadge';
import * as Haptics from 'expo-haptics';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { events, currentEvent } = usePopeEvents();
  const [selectedEvent, setSelectedEvent] = useState<PopeEvent | null>(null);

  const uniqueLocations = useMemo(() => {
    const seen = new Map<string, PopeEvent>();
    events.forEach(e => {
      const key = `${e.latitude.toFixed(3)},${e.longitude.toFixed(3)}`;
      if (!seen.has(key)) {
        seen.set(key, e);
      }
    });
    return Array.from(seen.values());
  }, [events]);

  const handleLocatePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentEvent) {
      setSelectedEvent(currentEvent);
    }
  }, [currentEvent]);

  const handleEventSelect = useCallback((event: PopeEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(event);
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Papal Map</Text>
          <Text style={styles.headerSubtitle}>Locations of recent and upcoming events</Text>
        </View>

        <ScrollView style={styles.webList} contentContainerStyle={styles.webListContent}>
          {uniqueLocations.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            const isCurrent = currentEvent?.id === event.id;
            return (
              <Pressable
                key={event.id}
                style={[styles.locationCard, isSelected && styles.locationCardSelected]}
                onPress={() => handleEventSelect(event)}
              >
                <View style={[styles.mapPinIcon, { backgroundColor: getCategoryColor(event.category) + '30' }]}>
                  <MapPin size={18} color={isCurrent ? Colors.gold : getCategoryColor(event.category)} />
                </View>
                <View style={styles.locationInfo}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.locationName}>{event.location}</Text>
                    {isCurrent && (
                      <View style={styles.currentChip}>
                        <View style={styles.currentDot} />
                        <Text style={styles.currentText}>Current</Text>
                      </View>
                    )}
                  </View>
                  {event.locationDetail && (
                    <Text style={styles.locationSubtext}>{event.locationDetail}</Text>
                  )}
                  <Text style={styles.locationEvent}>{event.title}</Text>
                  <Text style={styles.locationMeta}>
                    {formatEventDateShort(event.date)} · {formatTime(event.time)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={[styles.locateButton, { bottom: 20 }]}
          onPress={handleLocatePress}
        >
          <Navigation size={20} color={Colors.midnight} />
          <Text style={styles.locateText}>Find the Pope</Text>
        </Pressable>
      </View>
    );
  }

  let MapViewComponent: React.ComponentType<any> | null = null;
  let MarkerComponent: React.ComponentType<any> | null = null;
  try {
    const Maps = require('react-native-maps');
    MapViewComponent = Maps.default;
    MarkerComponent = Maps.Marker;
  } catch {
    console.log('react-native-maps not available');
  }

  if (!MapViewComponent || !MarkerComponent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Map not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapViewComponent
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 41.9022,
          longitude: 12.4539,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        customMapStyle={darkMapStyle}
      >
        {uniqueLocations.map(event => (
          <MarkerComponent
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
            description={event.location}
            onPress={() => handleEventSelect(event)}
            pinColor={currentEvent?.id === event.id ? Colors.gold : Colors.crimson}
          />
        ))}
      </MapViewComponent>

      <View style={[styles.mapOverlayTop, { top: insets.top + 10 }]}>
        <Text style={styles.mapTitle}>Papal Map</Text>
      </View>

      {selectedEvent && (
        <View style={[styles.selectedCard, { bottom: insets.bottom + 20 }]}>
          <Pressable style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
            <X size={16} color={Colors.whiteMuted} />
          </Pressable>
          <CategoryBadge category={selectedEvent.category} />
          <Text style={styles.selectedTitle}>{selectedEvent.title}</Text>
          <View style={styles.selectedMeta}>
            <MapPin size={12} color={Colors.gold} />
            <Text style={styles.selectedLocation}>{selectedEvent.location}</Text>
          </View>
          <Text style={styles.selectedTime}>
            {formatEventDateShort(selectedEvent.date)} at {formatTime(selectedEvent.time)}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.locateButton, { bottom: selectedEvent ? 200 : insets.bottom + 20 }]}
        onPress={handleLocatePress}
      >
        <Navigation size={20} color={Colors.midnight} />
        <Text style={styles.locateText}>Find the Pope</Text>
      </Pressable>
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#0e1626' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.midnightBorder,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: 24,
    fontWeight: '700' as const,
  },
  headerSubtitle: {
    color: Colors.whiteMuted,
    fontSize: 13,
    marginTop: 4,
  },
  webList: {
    flex: 1,
  },
  webListContent: {
    padding: 20,
    gap: 10,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.midnightCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 14,
    marginBottom: 10,
  },
  locationCardSelected: {
    borderColor: Colors.goldMuted,
  },
  mapPinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  currentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  currentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  currentText: {
    color: Colors.gold,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  locationSubtext: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  locationEvent: {
    color: Colors.whiteSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
    marginTop: 2,
  },
  locationMeta: {
    color: Colors.whiteDim,
    fontSize: 12,
    marginTop: 2,
  },
  mapOverlayTop: {
    position: 'absolute',
    left: 20,
    backgroundColor: Colors.overlay,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mapTitle: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  selectedCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.goldMuted,
    gap: 6,
  },
  closeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 1,
  },
  selectedTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedLocation: {
    color: Colors.gold,
    fontSize: 14,
  },
  selectedTime: {
    color: Colors.whiteMuted,
    fontSize: 13,
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  locateText: {
    color: Colors.midnight,
    fontSize: 14,
    fontWeight: '700' as const,
  },
});
