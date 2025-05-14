import { Stack } from 'expo-router';

export default function SystemViews() {

    return (
        <Stack>
            <Stack.Screen name="edit" options={{headerShown: false}} />        
        </Stack>      
    );

};