import '../global.css';

import { Nunito_900Black, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    Nunito_900Black,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    TitanOne_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <>
      <StatusBar backgroundColor="#f8eee2" barStyle="dark-content" translucent={true} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
