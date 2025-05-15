import React from 'react';

// Import React-Native Content
import { View, Image, StyleSheet } from 'react-native';

// Import View and Storage
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images, and Colors
import { images } from '../../../constants';
import colors from '../../../constants/colors';

const Loading = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={images.logo} // Replace with your logo/image
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.blue, // Or your preferred color
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  image: {
    width: 200,
    height: 200,
  },
});

export default Loading;