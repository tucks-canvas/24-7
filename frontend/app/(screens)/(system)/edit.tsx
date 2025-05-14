import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content 
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons and Images 
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';
import { updateUserProfile } from '../../../src/services/api';

const Edit = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ImageBackground
              source={images.background}
              style={styles.background}
              resizeMode="cover"
            >
              <View style={styles.overlay} />
              
              <View style={styles.headercontent}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.headerbutton}
                >
                  <Image source={icons.back} style={styles.lrgicon} tintColor={colors.white} />
                </TouchableOpacity>
              
                <Text style={styles.headertext}>Edit Profile</Text>
              
                <Text style={styles.headersubtext}></Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.body}>
              <View style={styles.bodyimage}>
                <Image source={images.profile} style={styles.lrgimage} resizeMode="cover" />
              </View>
          </View>

          <TouchableOpacity style={styles.photo}>
            <Image
              source={icons.canvas}
              style={styles.smlicon}
              tintColor={colors.blue}
            />
          </TouchableOpacity>
    
            <View style={styles.textfields}>
                <View style={styles.textfield}> 
                    <Text style={styles.text}>First name</Text>

                    <View style={styles.textbody}>
                        <TextInput
                            style={styles.input}
                            placeholder="Placeholder text"
                            placeholderTextColor={colors.grey}  
                            autoCapitalize="none"
                        />

                        <TouchableOpacity></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.textfield}> 
                    <Text style={styles.text}>Last name</Text>

                    <View style={styles.textbody}>
                        <TextInput
                            style={styles.input}
                            placeholder="Placeholder text"
                            placeholderTextColor={colors.grey}  
                            autoCapitalize="none"
                        />

                        <TouchableOpacity></TouchableOpacity>
                    </View>
                </View>

                <View style={styles.textfield}> 
                    <Text style={styles.text}>User name</Text>

                    <View style={styles.textbody}>
                        <TextInput
                            style={styles.input}
                            placeholder="Placeholder text"
                            placeholderTextColor={colors.grey}  
                            autoCapitalize="none"
                        />

                        <TouchableOpacity></TouchableOpacity>
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

                        <TouchableOpacity></TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledbutton]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttontext}>Save</Text>
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
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  background: {
    backgroundColor: colors.blue,
    height: 210,
    width: '100%',
    bottom: 30,
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: 210, 
    bottom: 30,
  },

  /* Header */

  header: {
    height: 180,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headercontent: {
    width: '80%',
    flexDirection: 'row',
    marginTop: 80,
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headertext: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    color: colors.white,
  },

  /* Body */

  body: {
    bottom: 40,
    width: '80%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyimage: {
    borderRadius: 50,
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderColor: colors.white,
    borderWidth: 5,
  },

  /* Text */

  textfields: {
    gap: 25,
    width: '80%',
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

  /* Button */

    button: {
        width: '80%',
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

  /* Photo */

  photo: {
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 10,
    position: 'absolute',
    top: 205,
    right: 148,
  },


  /* Images and Icons */

  lrgimage: {
    width: '100%',
    height: '100%',
  },

  icon: {
    width: 35,
    height: 35,
  },

  smlicon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  midicon: {
    width: 25,
    height: 25,
  },

  lrgicon: {
    width: 30,
    height: 30,
  },

});

export default Edit;