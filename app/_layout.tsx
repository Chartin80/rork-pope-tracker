import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PopeEventsProvider } from '@/contexts/PopeEventsContext';
import Colors from '@/constants/colors';

SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('SplashScreen.preventAutoHideAsync failed');
});

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={errorStyles.container}>
          <Text style={errorStyles.title}>Something went wrong</Text>
          <Text style={errorStyles.message}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: Colors.gold,
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  message: {
    color: Colors.whiteMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: Colors.midnight },
        headerTintColor: Colors.white,
        contentStyle: { backgroundColor: Colors.midnight },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="event/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS !== 'web') {
          const Font = await import('expo-font');
          await Font.loadAsync({
            'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
            'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
          });
        }
      } catch (error) {
        console.warn('Font loading error (non-fatal):', error);
      } finally {
        setAppReady(true);
      }
    }
    void prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      SplashScreen.hideAsync().catch(() => {
        console.log('SplashScreen.hideAsync failed');
      });
    }
  }, [appReady]);

  if (!appReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.midnight }} />
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PopeEventsProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <RootLayoutNav />
          </GestureHandlerRootView>
        </PopeEventsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
