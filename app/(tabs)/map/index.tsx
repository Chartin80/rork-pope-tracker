import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation, MapPin, X, Globe, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { usePopeEvents } from '@/contexts/PopeEventsContext';
import { PopeEvent } from '@/types';
import { formatTime, formatEventDateShort } from '@/lib/utils';
import { getCategoryColor } from '@/lib/locations';
import CategoryBadge from '@/components/CategoryBadge';
import GoldParticles from '@/components/GoldParticles';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  const handleEventDetail = useCallback((event: PopeEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}` as any);
  }, [router]);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <GoldParticles />
        <View style={styles.headerBar}>
          <View style={styles.headerRow}>
            <LinearGradient colors={['#D4AF37', '#B8942E']} style={styles.headerIconWrap}>
              <Globe size={18} color={Colors.midnight} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Papal Map</Text>
              <Text style={styles.headerSubtitle}>Locations of recent and upcoming events</Text>
            </View>
          </View>
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
                <View style={[styles.mapPinIcon, { backgroundColor: getCategoryColor(event.category) + '15' }]}>
                  <MapPin size={18} color={isCurrent ? Colors.gold : getCategoryColor(event.category)} />
                </View>
                <View style={styles.locationInfo}>
                  <View style={styles.locationHeader}>
                    <Text style={styles.locationName}>{event.location}</Text>
                    {isCurrent && (
                      <LinearGradient
                        colors={['rgba(212, 175, 55, 0.15)', 'rgba(212, 175, 55, 0.05)']}
                        style={styles.currentChip}
                      >
                        <View style={styles.currentDot} />
                        <Text style={styles.currentText}>Current</Text>
                      </LinearGradient>
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
                <Pressable
                  style={styles.detailButton}
                  onPress={() => handleEventDetail(event)}
                >
                  <ChevronRight size={14} color={Colors.goldWarm} />
                </Pressable>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          style={[styles.locateButton, { bottom: 24 }]}
          onPress={handleLocatePress}
        >
          <LinearGradient
            colors={['#D4AF37', '#C5A26F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.locateButtonGradient}
          >
            <Navigation size={16} color={Colors.midnight} />
            <Text style={styles.locateText}>Find the Pope</Text>
          </LinearGradient>
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

      <View style={[styles.mapOverlayTop, { top: insets.top + 12 }]}>
        <LinearGradient
          colors={['rgba(10, 15, 28, 0.95)', 'rgba(10, 15, 28, 0.85)']}
          style={styles.mapTitlePill}
        >
          <Globe size={14} color={Colors.gold} />
          <Text style={styles.mapTitle}>Papal Map</Text>
        </LinearGradient>
      </View>

      {selectedEvent && (
        <View style={[styles.selectedCard, { bottom: insets.bottom + 24 }]}>
          <LinearGradient
            colors={['rgba(17, 24, 39, 0.98)', 'rgba(10, 15, 28, 0.99)']}
            style={styles.selectedCardGradient}
          >
            <Pressable style={styles.closeButton} onPress={() => setSelectedEvent(null)}>
              <X size={14} color={Colors.whiteMuted} />
            </Pressable>
            <CategoryBadge category={selectedEvent.category} compact />
            <Text style={styles.selectedTitle}>{selectedEvent.title}</Text>
            <View style={styles.selectedMeta}>
              <MapPin size={12} color={Colors.gold} />
              <Text style={styles.selectedLocation}>{selectedEvent.location}</Text>
            </View>
            <Text style={styles.selectedTime}>
              {formatEventDateShort(selectedEvent.date)} at {formatTime(selectedEvent.time)}
            </Text>
          </LinearGradient>
        </View>
      )}

      <Pressable
        style={[styles.locateButton, { bottom: selectedEvent ? 200 : insets.bottom + 24 }]}
        onPress={handleLocatePress}
      >
        <LinearGradient
          colors={['#D4AF37', '#C5A26F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.locateButtonGradient}
        >
          <Navigation size={16} color={Colors.midnight} />
          <Text style={styles.locateText}>Find the Pope</Text>
        </LinearGradient>
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
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.08)',
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
  headerTitle: {
    color: Colors.goldLight,
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: Colors.whiteDim,
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic' as const,
  },
  webList: {
    flex: 1,
  },
  webListContent: {
    padding: 20,
    gap: 10,
    paddingBottom: 100,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.midnightCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
    gap: 14,
    alignItems: 'center',
  },
  locationCardSelected: {
    borderColor: 'rgba(212, 175, 55, 0.25)',
    backgroundColor: 'rgba(212, 175, 55, 0.03)',
  },
  mapPinIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    gap: 3,
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
    letterSpacing: -0.2,
  },
  currentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  currentDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.gold,
  },
  currentText: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  locationSubtext: {
    color: Colors.whiteDim,
    fontSize: 12,
  },
  locationEvent: {
    color: Colors.whiteSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
    marginTop: 3,
  },
  locationMeta: {
    color: Colors.whiteDim,
    fontSize: 12,
    marginTop: 2,
  },
  detailButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayTop: {
    position: 'absolute',
    left: 20,
  },
  mapTitlePill: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.12)',
  },
  mapTitle: {
    color: Colors.gold,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  selectedCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  selectedCardGradient: {
    padding: 20,
    gap: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(30, 42, 69, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    paddingRight: 30,
  },
  selectedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectedLocation: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  selectedTime: {
    color: Colors.whiteMuted,
    fontSize: 13,
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  locateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  locateText: {
    color: Colors.midnight,
    fontSize: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
});
