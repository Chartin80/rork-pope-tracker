import React, { useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Clock, ChevronRight, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PopeEvent } from '@/types';
import { formatTime, formatEventDateShort } from '@/lib/utils';
import CategoryBadge from '@/components/CategoryBadge';

interface EventDetailBottomSheetProps {
  event: PopeEvent | null;
  onClose: () => void;
}

export interface EventDetailBottomSheetRef {
  expand: () => void;
  close: () => void;
}

const EventDetailBottomSheet = forwardRef<EventDetailBottomSheetRef, EventDetailBottomSheetProps>(
  ({ event, onClose }, ref) => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      expand: () => setVisible(true),
      close: () => {
        setVisible(false);
        onClose();
      },
    }));

    const handleViewDetails = useCallback(() => {
      if (event) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setVisible(false);
        onClose();
        router.push(`/event/${event.id}` as any);
      }
    }, [event, router, onClose]);

    const handleClose = useCallback(() => {
      setVisible(false);
      onClose();
    }, [onClose]);

    if (!event) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handleBar} />
            <View style={styles.content}>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <X size={16} color={Colors.whiteMuted} />
              </Pressable>

              <View style={styles.header}>
                <CategoryBadge category={event.category} />
                {event.isLive && (
                  <View style={styles.liveChip}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                )}
              </View>

              <Text style={styles.title}>{event.title}</Text>

              <View style={styles.metaRow}>
                <MapPin size={14} color={Colors.gold} />
                <Text style={styles.location}>{event.location}</Text>
              </View>

              {event.locationDetail && (
                <Text style={styles.locationDetail}>{event.locationDetail}</Text>
              )}

              <View style={styles.metaRow}>
                <Clock size={14} color={Colors.goldWarm} />
                <Text style={styles.time}>
                  {formatEventDateShort(event.date)} at {formatTime(event.time)}
                </Text>
              </View>

              <Text style={styles.description} numberOfLines={3}>
                {event.description}
              </Text>

              <Pressable onPress={handleViewDetails} style={styles.detailButton}>
                <LinearGradient
                  colors={['#D4AF37', '#B8942E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.detailButtonGradient}
                >
                  <Text style={styles.detailButtonText}>View Full Details</Text>
                  <ChevronRight size={16} color={Colors.midnight} />
                </LinearGradient>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
);

EventDetailBottomSheet.displayName = 'EventDetailBottomSheet';

export default EventDetailBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.midnightCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 300,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.goldWarm,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 42, 69, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(183, 28, 28, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.crimson,
  },
  liveText: {
    color: Colors.crimson,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    color: Colors.white,
    fontSize: 22,
    letterSpacing: -0.5,
    paddingRight: 40,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    color: Colors.gold,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  locationDetail: {
    color: Colors.whiteMuted,
    fontSize: 14,
    marginLeft: 22,
    marginTop: -8,
  },
  time: {
    color: Colors.whiteMuted,
    fontSize: 14,
  },
  description: {
    color: Colors.whiteSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
  detailButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  detailButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  detailButtonText: {
    fontFamily: Fonts.heading.bold,
    color: Colors.midnight,
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
