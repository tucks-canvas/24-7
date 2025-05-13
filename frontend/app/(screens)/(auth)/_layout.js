import { Stack } from 'expo-router';

export default function AuthViews() {

    return (
        <Stack>
            <Stack.Screen name="forgot" options={{headerShown: false}} />
            <Stack.Screen name="sign" options={{headerShown: false}} />
            <Stack.Screen name="code" options={{headerShown: false}} />
            <Stack.Screen name="new" options={{headerShown: false}} />
        </Stack>      
    );

};