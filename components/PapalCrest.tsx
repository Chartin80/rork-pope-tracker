import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function PapalCrest({ size = 48 }: { size?: number }) {
  const scale = size / 48;
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.cross, { fontSize: 28 * scale }]}>&#x2629;</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    color: Colors.gold,
    fontWeight: '300' as const,
  },
});
