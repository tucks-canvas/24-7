import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "SF-Pro-Display-Black": require("../assets/fonts/SF-Pro-Display-Black.ttf"),
        "SF-Pro-Display-Bold": require("../assets/fonts/SF-Pro-Display-Bold.ttf"),
        "SF-Pro-Display-Light": require("../assets/fonts/SF-Pro-Display-Light.ttf"),
        "SF-Pro-Display-Medium": require("../assets/fonts/SF-Pro-Display-Medium.ttf"),
        "SF-Pro-Display-Regular": require("../assets/fonts/SF-Pro-Display-Regular.ttf"),
        "SF-Pro-Display-Semibold": require("../assets/fonts/SF-Pro-Display-Semibold.ttf"),
        "SF-Pro-Display-Thin": require("../assets/fonts/SF-Pro-Display-Thin.ttf"),
        "SF-Pro-Display-Ultralight": require("../assets/fonts/SF-Pro-Display-Ultralight.ttf"),
        "SF-Pro-Display-BlackItalic": require("../assets/fonts/SF-Pro-Display-BlackItalic.ttf"),
        "SF-Pro-Display-HeavyItalic": require("../assets/fonts/SF-Pro-Display-HeavyItalic.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (loaded) SplashScreen.hideAsync();
    }, [loaded, error]);

    if (!loaded && !error) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(screens)" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    );
}