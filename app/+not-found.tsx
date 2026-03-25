import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/typography';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.cross}>✝</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>This path does not exist</Text>
      <Pressable onPress={() => router.replace('/')} style={styles.buttonWrap}>
        <LinearGradient
          colors={['#D4AF37', '#B8942E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Home size={18} color={Colors.midnight} />
          <Text style={styles.buttonText}>Return Home</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  cross: {
    fontSize: 40,
    color: Colors.goldWarm,
    opacity: 0.4,
    marginBottom: 8,
  },
  title: {
    fontFamily: Fonts.heading.bold,
    fontSize: 28,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.whiteMuted,
    marginBottom: 20,
  },
  buttonWrap: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    gap: 10,
  },
  buttonText: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.midnight,
    letterSpacing: 0.3,
  },
});
