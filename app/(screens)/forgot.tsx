import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import Supported Contents
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../constants';
import colors from '../../constants/colors';

const Forgot = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={icons.back}
                    style={styles.smlicon}
                    tintColor={colors.black}                
                />
            </View> 

            <View style={styles.body}>
                <Text style={styles.bodytext}>Forgot Password</Text>
                <Text style={styles.bodysubtext}>Please enter your email. We will send a code to your mail to reset your password</Text>
            </View>           

            <View style={styles.textfields}>
                <View style={styles.textfield}> 
                <Text style={styles.text}>User name</Text>

                <View style={styles.textbody}>
                    <TextInput
                    style={styles.input}
                    placeholder="Placeholder text"
                    placeholderTextColor={colors.grey}  
                    autoCapitalize="none"
                    />

                    <TouchableOpacity>
                    </TouchableOpacity>
                </View>
                </View>
            </View>

            <View style={styles.button}>
                <Text style={styles.buttontext}>Continue</Text>
            </View>
          </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

  safeArea: {
    height: '100%',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    width: '90%',
  },

  /* Body */

  body: {
    width: '90%',
  },

  bodytext: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  bodysubtext: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  /* Text */

  textfields: {
    gap: 25,
  },

  textfield: {
    gap: 10,
  },

  textbody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.grey,
    alignItems: 'center',
  },

  input: {

  },

  text: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },
  
  /* Signin */

  /* Button */

  button: {
    backgroundColor: colors.red,
    paddingVertical: 15,
    paddingHorizontal: 55,
    borderRadius: 12,
    marginTop: 40,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  buttontext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.white,
  },

  /* Images and Icons */

  smlicon: {
    width: 20,
    height: 20,
  },

});

export default Forgot;