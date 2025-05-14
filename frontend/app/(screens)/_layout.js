import { Stack } from 'expo-router';

export default function ScreenViews() {

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
            <Stack.Screen name="(services)" options={{headerShown: false}} /> 
            <Stack.Screen name="(onboarding)" options={{headerShown: false}} />     
            <Stack.Screen name="(system)" options={{headerShown: false}} />             
        </Stack>      
    );

};