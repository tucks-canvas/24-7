import { Stack } from 'expo-router';

export default function ServiceViews() {

    return (
        <Stack>
            <Stack.Screen name="service" options={{headerShown: false}} />        
            <Stack.Screen name="book" options={{headerShown: false}} />    
        </Stack>      
    );

};