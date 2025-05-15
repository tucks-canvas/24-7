import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Import View and Storage
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images, and Colors
import { images, icons } from '../../../constants';
import colors from '../../../constants/colors';

const onboardingSlides = [
  {
    id: 1,
    image: images.onboarding1,
    title: 'Find Services Easily',
    subtitle: 'Discover a wide range of vehicle services at your fingertips',
  },
  {
    id: 2,
    image: images.onboarding2,
    title: 'Quick Assistance',
    subtitle: 'Get help whenever you need it, 24/7 service availability',
  },
  {
    id: 3,
    image: images.onboarding3,
    title: 'Ready to Start?',
    subtitle: 'Join thousands of satisfied customers today',
  },
];

const Onboarding = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace('/sign');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={onboardingSlides[currentSlide].image}
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{onboardingSlides[currentSlide].title}</Text>
          <Text style={styles.subtitle}>{onboardingSlides[currentSlide].subtitle}</Text>
        </View>

        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => (
            <Image
              key={index}
              source={currentSlide === index ? icons.active : icons.inactive}
              style={styles.paginationIcon}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {currentSlide < onboardingSlides.length - 1 && (
            <Image
              source={icons.arrowRight}
              style={styles.arrowIcon}
              tintColor={colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
  },
  paginationIcon: {
    width: 10,  // Adjust size as needed
    height: 10, // Adjust size as needed
    marginHorizontal: 4,
    resizeMode: 'contain',
  },
  nextButton: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Medium',
    marginRight: 8,
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
});

export default Onboarding;