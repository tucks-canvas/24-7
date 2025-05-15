import { Stack } from 'expo-router';

export default function LoadingViews() {

    return (
        <Stack>
            <Stack.Screen name="loading" options={{headerShown: false}} />        
        </Stack>      
    );

};