import React, { useState } from 'react';
import { useRouter } from 'expo-router';

// Import Supported Contents
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../constants';
import colors from '../../constants/colors';

const Sign = () => {
  const router = useRouter();
  
  const [activeView, setActiveView] = useState('signup');

  const toggleView = (view) => {
    setActiveView(view);
  };

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleSignupInputChange = (name, value) => {
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginInputChange = (name, value) => {
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.choice}>
                <TouchableOpacity 
                  style={activeView === 'login' ? styles.selectedbutton : styles.choicebutton}
                  onPress={() => toggleView('login')}
                >
                  <Text style={activeView === 'login' ? styles.selectedtext : styles.choicetext}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={activeView === 'signup' ? styles.selectedbutton : styles.choicebutton}
                  onPress={() => toggleView('signup')}
                >
                  <Text style={activeView === 'signup' ? styles.selectedtext : styles.choicetext}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.default}>
              <View style={[styles.signup, { display: activeView === 'signup' ? 'flex' : 'none' }]}>
                <View style={styles.content}>
                  <Text style={styles.contentext}>Create an account</Text>
                  <Text style={styles.contentsub}>create your new account and find more service</Text>
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

                  <View style={styles.textfield}> 
                    <Text style={styles.text}>Email</Text>

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

                  <View style={styles.textfield}> 
                    <Text style={styles.text}>Password</Text>

                    <View style={styles.textbody}>
                      <TextInput
                        style={styles.input}
                        placeholder="•••••••••"
                        placeholderTextColor={colors.grey}  
                        autoCapitalize="none"
                        secureTextEntry={!showSignupPassword}
                        value={signupData.password}
                        onChangeText={(text) => handleSignupInputChange('password', text)}
                      />

                      <TouchableOpacity 
                        onPress={() => setShowSignupPassword(!showSignupPassword)}
                        style={styles.fieldimage}
                      >
                        <Image
                          source={showSignupPassword ? icons.show : icons.hide}
                          style={styles.smlicon}                      
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.signbox}>
                  <TouchableOpacity 
                    style={styles.signbutton}
                    onPress={() => router.push('./(tabs)/home')}
                  >
                    <Text style={styles.signtext}>Sign up</Text>
                  </TouchableOpacity>

                  <Text style={styles.signsub}>Or</Text>

                  <View style={styles.buttons}>
                    <TouchableOpacity 
                      style={styles.button}
                    >
                      <Image
                        source={icons.facebook}
                        style={styles.smlicon}  
                      />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.button}
                    >
                      <Image
                        source={icons.google}
                        resizeMode="contain"
                        style={styles.smlicon}  
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.signalt}>
                    Already Have an Account? 
                    <Text style={styles.highlight} onPress={() => toggleView('login')}> Sign In</Text>
                  </Text>
                </View>
              </View>

              <View style={[styles.signin, { display: activeView === 'login' ? 'flex' : 'none' }]}>
                <View style={styles.content}>
                  <Text style={styles.contentext}>Let's log you in</Text>
                  <Text style={styles.contentsub}>Welcome back You've been missed</Text>
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
                      />

                      <TouchableOpacity>
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
                        secureTextEntry={!showLoginPassword}
                        value={loginData.password}
                        onChangeText={(text) => handleLoginInputChange('password', text)}
                      />

                      <TouchableOpacity 
                        onPress={() => setShowLoginPassword(!showLoginPassword)}
                        style={styles.fieldimage}
                      >
                        <Image
                          source={showLoginPassword ? icons.show : icons.hide}
                          style={styles.smlicon}                      
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push('/forgot')}
                  >
                    <Text style={styles.forgot}>Forgot password?</Text>                  
                  </TouchableOpacity>
                </View>

                <View style={styles.logbox}>
                  <TouchableOpacity 
                    style={styles.signbutton}
                    onPress={() => router.push('./(tabs)/home')}
                  >
                    <Text style={styles.signtext}>Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.logsub}>Or</Text>

                  <Text style={styles.signalt}>
                    Don't Have an Account? 
                    <Text style={styles.highlight} onPress={() => toggleView('signup')}> Sign Up</Text>
                  </Text>
                </View>
              </View>
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: '90%',
    height: 55,
    padding: 5,
    borderRadius: 16,
    margin: 20,
  },

  /* Choice */

  choice: {
    flexDirection: 'row',
    paddingHorizontal: 2, 
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
  },

  choicebutton: {
    paddingVertical: 10,
    paddingHorizontal: 55,
    borderRadius: 16,
  },

  choicetext: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  /* Default */ 

  default: {
    backgroundColor: colors.white,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  /* Sign */

  signup: {
    width: '80%',
    marginTop: 20,
    display: 'none',
  },

  signin: {
    width: '80%',
    marginTop: 20,
  },

  /* Content */

  content: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  contentext: {
    fontSize: 25,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
    marginVertical: 20,
  },

  contentsub: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 25,
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

  signtext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.white,
  },

  signsub: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },

  signalt: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.grey,
    textAlign: 'center',
    marginVertical: 20,
  },

  signbox: {
    marginTop: 20,
  },

  signbutton: {
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

  /* Log  */

  logbox: {
    marginTop: 160,
  },

  logsub: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
  },

  /* Button */

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  button: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 65,
    borderRadius: 12,
    elevation: 20,
  },

  /* Add-Ons */

  forgot: {
    color: colors.red,
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
  },

  highlight: {
    color: colors.red,
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
  },

  /* Selected */

  selectedbutton: {
    backgroundColor: colors.red,
    paddingVertical: 10,
    paddingHorizontal: 55,
    borderRadius: 16,
  },

  selectedtext: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: 'white',
  },

  /* Images and Icons */

  smlicon: {
    width: 20,
    height: 20,
  },

});

export default Sign;