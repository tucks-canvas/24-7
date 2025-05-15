import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

// Import View and Storage
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images, and Colors
import { images, icons } from '../../../constants';
import colors from '../../../constants/colors';

const onboarding = [
  {
    id: 1,
    image: images.onboarding1,
    text: 'Have any Problems with your car?',
    subtext: 'If you have any problems with your car please contact us. we provide all vehicle',
  },
  {
    id: 2,
    image: images.onboarding2,
    text: 'Rent a Vehicle Easily Only Here!',
    subtext: 'If you have any problems with your car please contact us. we provide all vehicle',
  },
  {
    id: 3,
    image: images.onboarding3,
    text: 'Order Parts for your car',
    subtext: 'If you have any problems with your car please contact us. we provide all vehicle',
  },
];

const Onboarding = () => {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide < onboarding.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } 
    else 
    {
      router.replace('/sign');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />    

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={onboarding[currentSlide].image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>        
          
          <View style={styles.body}>
            <Text style={styles.text}>{onboarding[currentSlide].text}</Text>
            <Text style={styles.subtext}>{onboarding[currentSlide].subtext}</Text>
          </View>

          <View style={styles.pagination}>
            {onboarding.map((_, index) => (
              <Image
                key={index}
                source={currentSlide === index ? icons.active : icons.inactive}
                style={styles.smlicon}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={goToNextSlide}
          >
            <Text style={styles.buttontext}>
              {currentSlide === onboarding.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Header */

  header: {
    width: 700,
    height: 550,
    marginBottom: 20,
    bottom: 70,
  },

  /* Body */

  body: {
    width: '85%',
    alignItems: 'center',
    marginBottom: 20,
    bottom: 30,
  },
  
  text: {
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },

  subtext: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  /* Pagination */

  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
    bottom: 20,
  },

  /* Button */
  
  button: {
    flexDirection: 'row',
    backgroundColor: colors.red,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttontext: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Medium',
  },
  
  /* Icons and Images */

  icon: {
    width: 16,
    height: 16,
  },

  smlicon: {
    width: 10, 
    height: 10,
    marginHorizontal: 4,
    resizeMode: 'contain',
  },

  image: {
    width: '100%',
    height: '100%',
  },


});

export default Onboarding;