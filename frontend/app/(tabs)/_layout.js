import React, {useRef, useEffect} from 'react';

/* Import React-Native Content */
import { Tabs } from 'expo-router';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

/* Import Icons and Images */
import { icons } from '../../constants';
import colors from '../../constants/colors';

const TabIcon = ({ source, tintColor, focused, label }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(scaleAnim, {
            toValue: focused ? 1.2 : 1.5,
            duration: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(opacityAnim, {
            toValue: focused ? 1 : 0,
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
                        tintColor: focused ? colors.white : tintColor, 
                        transform: [{ scale: scaleAnim }],
                        marginRight: focused ? 8 : 0 
                    },
                ]}
            />

            <Animated.Text 
                style={[
                    styles.text, 
                    { opacity: opacityAnim, color: colors.white }
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
                tabBarActiveTintColor: colors.white,
                tabBarInactiveTintColor: colors.grey,
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
        justifyContent: 'space-between',
        textAlign: 'center',
        alignContent: 'center',
        paddingHorizontal: 30,  
        width: 80,
        height: 50,
        borderRadius: 10,
        backgroundColor: 'transparent',
        marginLeft: 10,
    },

    tabIconContainerFocused: {
        backgroundColor: colors.red,
        width: 100,
        height: 40,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        paddingHorizontal: 5, 
    },

    tabBarStyle: {
        position: 'absolute',
        backgroundColor: colors.white,
        height: '13%',
        width: '100%',
        bottom: 0,
        paddingTop: 20,
        paddingHorizontal: 20,
        borderRadius: 18, 
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
    },

    icon: {
        width: 12,
        height: 12,
    },

    text: {
        fontSize: 12,
        fontFamily: 'SF-Pro-Display-Bold',
        colors: colors.white,
    }
});

export default TabsLayout;