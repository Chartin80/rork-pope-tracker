import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';
import { NEWS_HEADLINES } from '@/mocks/events';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GoldTicker() {
  const translateX = useSharedValue(0);

  const tickerText = NEWS_HEADLINES.join('  •  ');
  const textWidth = tickerText.length * 7;

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-textWidth, {
        duration: textWidth * 50,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [textWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tickerWrap, animatedStyle]}>
        <Text style={styles.tickerText}>
          {tickerText}  •  {tickerText}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.midnightDeep,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.15)',
    paddingVertical: 10,
    overflow: 'hidden',
  },
  tickerWrap: {
    flexDirection: 'row',
  },
  tickerText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
