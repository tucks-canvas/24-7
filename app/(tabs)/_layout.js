import React, {useRef, useEffect} from 'react';
import { Tabs } from 'expo-router';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

import { icons } from '../../constants';
import colors from '../../constants/colors';

const TabIcon = ({ source, tintColor, focused, label }) => {
    // Animated values for opacity and scale
    const scaleAnim = useRef(new Animated.Value(1)).current; // Icon scale
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current; // Text opacity

    // Trigger animations when focus state changes
    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: focused ? 1.2 : 1.2, // Scale the icon when focused
            duration: 200,
            useNativeDriver: true, // Use native driver for better performance
        }).start();

        Animated.timing(opacityAnim, {
            toValue: focused ? 1 : 0, // Fade in text when focused
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <View style={[styles.tabIconContainer, focused && styles.tabIconContainerFocused]}>
            <Animated.Image 
                source={source}
                resizeMode="contain"
                style={[
                    styles.icon, 
                    { 
                        tintColor: focused ? 'white' : tintColor, 
                        transform: [{ scale: scaleAnim }],
                        marginRight: focused ? 8 : 0 // Apply marginRight only when focused
                    },
                ]}
            />

            <Animated.Text 
                style={[
                    styles.text, 
                    { opacity: opacityAnim, color: 'white' }  // Animate the opacity of text
                ]}
            >
                {label}
            </Animated.Text>
        </View>
    );
}

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: colors.blue,
                tabBarStyle: styles.tabBarStyle,
            }}
        >
            <Tabs.Screen 
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            source={icons.home}
                            tintColor={color}
                            focused={focused}
                            label="Home"
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="workshop"
                options={{
                    title: 'Workshop',
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            source={icons.location}
                            tintColor={color}
                            focused={focused}
                            label="Workshop"
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="history"
                options={{
                    title: 'History',
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            source={icons.question}
                            tintColor={color}
                            focused={focused}
                            label="History"
                        />
                    )
                }}
            />

            <Tabs.Screen 
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon
                            source={icons.user}
                            tintColor={color}
                            focused={focused}
                            label="Profile"
                        />
                    )
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,  
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'transparent',
        marginLeft: 10,
    },

    tabIconContainerFocused: {
        backgroundColor: colors.yellow,
        width: 80,
        height: 40,
        margin: 20,
        paddingHorizontal: 5, 
        shadowOpacity: 0.1,
        shadowRadius: 3.84, 
        shadowColor: '#000', 
        shadowOffset: { 
            width: 0, 
            height: 2,
        },
        elevation: 5,    
    },

    tabBarStyle: {
        position: 'absolute',
        backgroundColor: colors.white,
        height: '8%',
        left: '5%',
        right: '5%',
        width: 370,
        bottom: 25,
        paddingLeft: 25,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 18, 
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        elevation: 10,
    },

    icon: {
        width: 16,
        height: 16,
    },

    text: {
        fontSize: 12,
        fontFamily: 'Montserrat-Bold',
    }
});

export default TabsLayout;