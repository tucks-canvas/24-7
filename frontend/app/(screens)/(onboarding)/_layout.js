import { Stack } from 'expo-router';

export default function LoadingViews() {

    return (
        <Stack>
            <Stack.Screen name="loading" options={{headerShown: false}} /> 
            <Stack.Screen name="onboarding" options={{headerShown: false}} />           
        </Stack>      
    );

};