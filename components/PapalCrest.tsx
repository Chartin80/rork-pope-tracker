import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface PapalCrestProps {
  size?: number;
}

export default function PapalCrest({ size = 48 }: PapalCrestProps) {
  const scale = size / 48;
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.innerRing, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}>
        <Text style={[styles.cross, { fontSize: 24 * scale }]}>&#x2629;</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.goldMuted,
    borderWidth: 1.5,
    borderColor: Colors.goldBorder,
  },
  innerRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    color: Colors.gold,
    fontWeight: '300' as const,
  },
});
