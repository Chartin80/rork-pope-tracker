import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategoryColor, getCategoryLabel } from '@/lib/locations';

interface CategoryBadgeProps {
  category: string;
  compact?: boolean;
}

export default function CategoryBadge({ category, compact }: CategoryBadgeProps) {
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);

  return (
    <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color + '30' }, compact && styles.badgeCompact]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }, compact && styles.labelCompact]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  labelCompact: {
    fontSize: 10,
  },
});
