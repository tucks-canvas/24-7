import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import Supported Contents
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';

const Code = () => {
  const router = useRouter();

  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.header}
            >
                <Image
                    source={icons.back}
                    style={styles.smlicon}
                    tintColor={colors.black}                
                />
            </TouchableOpacity> 

            <View style={styles.body}>
                <Text style={styles.bodytext}>Enter your 4 digit code</Text>
                <Text style={styles.bodysubtext}>Please check your email and enter your 4 digit code</Text>
            </View>           

            <View style={styles.digits}>
                {[0, 1, 2, 3].map((index) => (
                    <TextInput
                        key={index}
                        placeholderTextColor={colors.grey}
                        placeholder=''
                        style={[
                            styles.input,
                            focusedInput === index && styles.selectedinput
                        ]}
                        onFocus={() => setFocusedInput(index)}
                        onBlur={() => setFocusedInput(null)}
                        keyboardType="number-pad"
                        maxLength={1}
                    />
                ))}
            </View>

            <View style={styles.resend}>
                <Text style={styles.sendtext}>Did you get a code? <Text style={styles.sendsub}>Resend</Text></Text>
            </View>

            <TouchableOpacity 
                onPress={() => router.push('/new')}
                style={styles.button}
            >
                <Text style={styles.buttontext}>Verify</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

  safeArea: {
    height: '100%',
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    width: '80%',
    marginTop: 50,
    marginBottom: 50,
  },

  /* Body */

  body: {
    flexDirection: 'column',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: 20,
    marginBottom: 45,
  },

  bodytext: {
    fontSize: 25,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
    textAlign: 'center',
  },

  bodysubtext: {
    fontSize: 16,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    textAlign: 'center',
    lineHeight: 25,
  },

  /* Text */

  digits: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },

  input: {
    width: 60,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  selectedinput: {
    width: 60,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },

  /* Button */

  button: {
    position: 'relative',
    width: '80%',
    top: 350,
    backgroundColor: colors.red,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginTop: 40,
    marginBottom: 2,
    alignItems: 'center',
    textAlign: 'center',
  },

  buttontext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.white,
  },

  /* Resend */

  resend: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  sendtext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.black,
  },

  sendsub: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.red,
  },


  /* Images and Icons */

  smlicon: {
    width: 30,
    height: 30,
  },

});

export default Code;