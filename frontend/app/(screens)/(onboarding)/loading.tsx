import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Image, StyleSheet, StatusBar, Text, ActivityIndicator } from 'react-native';

// Import View and Storage
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images, and Colors
import { images } from '../../../constants';
import colors from '../../../constants/colors';

const Loading = () => {

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding'); // Using replace instead of push to prevent going back
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />    

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Image
            source={images.logo}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.text}>auto<Text style={styles.highlight}>care</Text></Text>
        
          <ActivityIndicator 
            size="large" 
            color={colors.white}
            style={styles.loader}
          />
        
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  /* Text */

  text: {
    fontSize: 40,
    color: colors.yellow,
    fontFamily: 'SF-Pro-Display-BlackItalic',
  },

  highlight: {
    fontSize: 40,
    color: colors.white,
    fontFamily: 'SF-Pro-Display-BlackItalic',
  },

  /* Icons and Images */
  
  image: {
    width: 100,
    height: 100,
  },
});

export default Loading;