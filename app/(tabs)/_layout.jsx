import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0F172A', // Dark slate background
        },
        headerTintColor: '#FFFFFF', // White text
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          letterSpacing: 0.5,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Banking Hub',
          headerStyle: {
            backgroundColor: '#0F172A',
            height: Platform.OS === 'ios' ? 60 : 56,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
            letterSpacing: 0.8,
          },
          headerTitleAlign: 'center',
          headerTintColor: '#FFFFFF',
          headerShadowVisible: false,
          
        }}
      />
      {/* <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="money" options={{ title: 'Money' }} /> */}
    </Stack>
  );
}
