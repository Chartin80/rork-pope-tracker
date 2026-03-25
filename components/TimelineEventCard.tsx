import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';
import { PopeEvent } from '@/types';
import CategoryBadge from '@/components/CategoryBadge';

interface TimelineEventCardProps {
  event: PopeEvent;
  index?: number;
  isLast?: boolean;
}

export default function TimelineEventCard({ event, index = 0, isLast = false }: TimelineEventCardProps) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = index * 100;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        damping: 15,
        stiffness: 100,
        mass: 1,
        useNativeDriver: true,
      }),
    ]).start();

    if (event.isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotPulse, { toValue: 1.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(dotPulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [index, event.isLive, opacity, translateY, dotPulse]);

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}` as any);
  };

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.98, damping: 15, stiffness: 300, mass: 1, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, damping: 15, stiffness: 300, mass: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        <Animated.View style={[styles.dot, event.isLive && styles.dotLive, { transform: [{ scale: dotPulse }] }]} />
        {!isLast && <View style={styles.line} />}
      </View>

      <Animated.View style={[styles.cardWrap, { transform: [{ scale }, { translateY }], opacity }]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(17, 24, 39, 0.8)', 'rgba(10, 15, 28, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.header}>
                <View style={styles.timeWrap}>
                  <Clock size={12} color={Colors.gold} />
                  <Text style={styles.time}>{event.time}</Text>
                </View>
                <CategoryBadge category={event.category} />
              </View>

              <Text style={styles.title}>{event.title}</Text>

              <Text style={styles.location} numberOfLines={1}>
                {event.location}
                {event.locationDetail && ` - ${event.locationDetail}`}
              </Text>
            </LinearGradient>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineColumn: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: Colors.midnightDeep,
    zIndex: 1,
  },
  dotLive: {
    backgroundColor: Colors.crimson,
    shadowColor: Colors.crimson,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    marginTop: 4,
  },
  cardWrap: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.midnightBorder,
  },
  cardGradient: {
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: Fonts.heading.regular,
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  location: {
    color: Colors.whiteMuted,
    fontSize: 13,
    letterSpacing: 0.1,
  },
});
