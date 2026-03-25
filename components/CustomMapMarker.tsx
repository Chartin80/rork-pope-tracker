import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '@/constants/colors';

interface CustomMapMarkerProps {
  isCurrent?: boolean;
  color?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function CustomMapMarker({ isCurrent = false, color }: CustomMapMarkerProps) {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  const markerColor = isCurrent ? Colors.gold : (color || Colors.crimson);

  useEffect(() => {
    if (isCurrent) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(0.6, { duration: 0 })
        ),
        -1,
        false
      );
    }
  }, [isCurrent]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {isCurrent && (
        <AnimatedView style={[styles.pulse, { backgroundColor: markerColor }, pulseAnimatedStyle]} />
      )}
      <View style={styles.markerWrap}>
        <Svg width={32} height={40} viewBox="0 0 32 40">
          <Path
            d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 24 16 24s16-15.163 16-24C32 7.163 24.837 0 16 0z"
            fill={markerColor}
          />
          <Path
            d="M16 8v12M12 14h8"
            stroke={isCurrent ? Colors.midnight : Colors.white}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <Circle
            cx="16"
            cy="14"
            r="7"
            fill="none"
            stroke={isCurrent ? Colors.midnight : Colors.white}
            strokeWidth={1.5}
            opacity={0.3}
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pulse: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  markerWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});
