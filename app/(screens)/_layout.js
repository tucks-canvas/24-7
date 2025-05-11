import { Stack } from 'expo-router';

export default function ScreenViews() {

    return (
        <Stack>
            <Stack.Screen name="forgot" options={{headerShown: false}} />
            <Stack.Screen name="sign" options={{headerShown: false}} />
        </Stack>      
    );

};