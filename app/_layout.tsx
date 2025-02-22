import '../global.css';
import { Nunito_900Black, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Slot } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SessionProvider, useSession } from '~/lib/ctx';

SplashScreen.preventAutoHideAsync();

function AuthenticatedLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return null;
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}

export default function RootLayout() {
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
    <SessionProvider>
      <StatusBar backgroundColor="#f8eee2" barStyle="dark-content" translucent={true} />
      <AuthenticatedLayout />
      <Slot />
    </SessionProvider>
  );
}
