import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Colors from '@/constants/colors';

interface CustomMapMarkerProps {
  isCurrent?: boolean;
  color?: string;
}

export default function CustomMapMarker({ isCurrent = false, color }: CustomMapMarkerProps) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  const markerColor = isCurrent ? Colors.gold : (color || Colors.crimson);

  useEffect(() => {
    if (isCurrent) {
      const scaleAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, { toValue: 1.8, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ])
      );
      const opacityAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ])
      );
      scaleAnim.start();
      opacityAnim.start();
      return () => { scaleAnim.stop(); opacityAnim.stop(); };
    }
  }, [isCurrent, pulseScale, pulseOpacity]);

  return (
    <View style={styles.container}>
      {isCurrent && (
        <Animated.View style={[styles.pulse, { backgroundColor: markerColor, transform: [{ scale: pulseScale }], opacity: pulseOpacity }]} />
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
