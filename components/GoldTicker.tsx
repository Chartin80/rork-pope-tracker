import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/colors';
import { NEWS_HEADLINES } from '@/mocks/events';


export default function GoldTicker() {
  const translateX = useRef(new Animated.Value(0)).current;

  const tickerText = NEWS_HEADLINES.join('  •  ');
  const textWidth = tickerText.length * 7;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -textWidth,
        duration: textWidth * 50,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [textWidth, translateX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.tickerWrap, { transform: [{ translateX }] }]}>
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
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
});
