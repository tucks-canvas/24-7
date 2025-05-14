import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import Supported Contents
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';
import { requestResetCode } from '../../../src/services/api';

const Forgot = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    const result = await requestResetCode(email);
    setLoading(false);

    if (result.success) {
      router.push({ 
        pathname: '/code',
        params: { email }
      });
    } else {
      Alert.alert('Error', result.error);
    }
  };

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
                <Text style={styles.bodytext}>Forgot Password</Text>
                <Text style={styles.bodysubtext}>Please enter your email. We will send a code to your mail to reset your password</Text>
            </View>           

            <View style={styles.textfields}>
                <View style={styles.textfield}> 
                  <Text style={styles.text}>Email</Text>

                  <View style={styles.textbody}>
                      <TextInput
                        style={styles.input}
                        placeholder="Placeholder text"
                        placeholderTextColor={colors.grey}  
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                      />

                      <TouchableOpacity>
                      </TouchableOpacity>
                  </View>
                </View>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttontext}>Continue</Text>
              )}
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

  textfields: {
    width: '80%',
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
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
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

  /* Images and Icons */

  smlicon: {
    width: 30,
    height: 30,
  },

});

export default Forgot;