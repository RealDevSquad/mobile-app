import FontAwesome from '@expo/vector-icons/FontAwesome5';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
    const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        //   fontWeight: 'bold',
          color:"black"
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      <Stack.Screen name="details"       options={{
          title: "Details",
          headerLeft: () => (
            <FontAwesome
              name="arrow-left"
              size={25}
              color="black"
              onPress={() => router.back()}
              style={{marginRight:10}}
            />
          ),
        }}
      />
    </Stack>
  );
}