import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import Supported Contents
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert, ActivityIndicator } from 'react-native';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';
import { updatePassword } from '../../../src/services/api';

const New = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
 
  const [newPasswordData, setNewPasswordData] = useState({
    password: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    password: '',
  });

  const handleSubmit = async () => {
    if (passwordData.password !== newPasswordData.password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPasswordData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const result = await updatePassword(token as string, newPasswordData.password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Password updated successfully!');
      router.replace('/sign');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleNewPasswordChange = (name, value) => {
    setNewPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (name, value) => {
    setPasswordData(prev => ({ ...prev, [name]: value }));
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
                    style={styles.icon}
                    tintColor={colors.black}                
                />
            </TouchableOpacity> 

            <View style={styles.body}>
                <Text style={styles.bodytext}>New Password</Text>
                <Text style={styles.bodysubtext}>Please enter your email. We will send a code to your mail to reset your password</Text>
            </View>           

            <View style={styles.textfields}>
                  <View style={styles.textfield}> 
                    <Text style={styles.text}>New Password</Text>

                    <View style={styles.textbody}>
                      <TextInput
                        style={styles.input}
                        placeholder="•••••••••"
                        placeholderTextColor={colors.grey}  
                        autoCapitalize="none"
                        secureTextEntry={!showNewPassword}
                        value={newPasswordData.password}
                        onChangeText={(text) => handleNewPasswordChange('password', text)}
                      />

                      <TouchableOpacity 
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.textimage}
                      >
                        <Image
                          source={showNewPassword ? icons.show : icons.hide}
                          style={styles.smlicon}                      
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.textfield}> 
                    <Text style={styles.text}>Password</Text>

                    <View style={styles.textbody}>
                      <TextInput
                        style={styles.input}
                        placeholder="•••••••••"
                        placeholderTextColor={colors.grey}  
                        autoCapitalize="none"
                        secureTextEntry={!showPassword}
                        value={passwordData.password}
                        onChangeText={(text) => handlePasswordChange('password', text)}
                      />

                      <TouchableOpacity 
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.textimage}
                      >
                        <Image
                          source={showPassword ? icons.show : icons.hide}
                          style={styles.smlicon}                      
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
            </View>

            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.button, loading && styles.disabledbutton]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttontext}>Done</Text>
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
    top: 250,
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
    width: 20,
    height: 20,
  },

  icon: {
    width: 30,
    height: 30,
  },

});

export default New;