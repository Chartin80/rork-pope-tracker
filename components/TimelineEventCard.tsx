import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TimelineEventCard({ event, index = 0, isLast = false }: TimelineEventCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const dotPulse = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(
      index * 100,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      index * 100,
      withSpring(0, { damping: 15, stiffness: 100 })
    );

    if (event.isLive) {
      dotPulse.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [index, event.isLive]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/event/${event.id}` as any);
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotPulse.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.timelineColumn}>
        <Animated.View style={[styles.dot, event.isLive && styles.dotLive, dotAnimatedStyle]} />
        {!isLast && <View style={styles.line} />}
      </View>

      <AnimatedPressable
        style={[styles.card, cardAnimatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
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
      </AnimatedPressable>
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
  card: {
    flex: 1,
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
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: Fonts.heading.regular,
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  location: {
    color: Colors.whiteMuted,
    fontSize: 13,
    letterSpacing: 0.1,
  },
});
