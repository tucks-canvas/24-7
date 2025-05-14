import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

// Import React-Native Content 
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import System and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

// Import Image Content
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

// Import Icons and Images 
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';
import { getUserProfile, updateUserProfile, uploadProfilePhoto, apiURL } from '../../../src/services/api';

const Edit = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    location: '',
    profile_photo: images.profile
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const userJson = await AsyncStorage.getItem('user');

        if (!userJson) {
          throw new Error('No user data found');
        }
        
        const storedUser = JSON.parse(userJson);

        if (!storedUser?.id) {
          throw new Error('User ID not found in stored data');
        }
        
        setUserId(storedUser.id);
        
        const userData = await getUserProfile(storedUser.id);
        
        setFormData({
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          username: userData.username || '',
          location: userData.location || '',
          profile_photo: userData.profile_photo || images.profile
        });
        
        if (userData.profile_photo) {
          setProfileImage({ uri: `${apiURL}/photos/${userData.profile_photo}` });
        }
      } 
      catch (error) 
      {
        Alert.alert('Error', 'Failed to load profile data');
      } 
      finally 
      {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    try {
      // 1. Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      // 2. Create a permanent copy of the file
      const permanentPath = `${FileSystem.cacheDirectory}${result.assets[0].uri.split('/').pop()}`;
      
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: permanentPath,
      });

      // 3. Now upload from the permanent location
      const uploadResult = await uploadProfilePhoto(permanentPath);
      
      if (uploadResult.success) {
        // Update UI and local storage
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!userId) throw new Error('User ID not available');
      
      const result = await updateUserProfile(userId, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        location: formData.location
      });
      
      if (result.success) {
        const userJson = await AsyncStorage.getItem('user');
        
        if (userJson) {
          const updatedUser = {
            ...JSON.parse(userJson),
            firstname: formData.firstname,
            lastname: formData.lastname,
            location: formData.location
          };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } 
      else 
      {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } 
    catch (error) 
    {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } 
    finally 
    {
      setLoading(false);
    }
  };

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
            <View style={styles.bodycontent}>
              <TouchableOpacity onPress={handleImagePick} disabled={imageLoading}>
                <View style={styles.bodyimage}>
                  {profileImage ? (
                    <Image 
                      source={profileImage} 
                      style={styles.lrgimage} 
                      resizeMode="cover" 
                    />
                  ) : (
                    <Image 
                      source={images.profile} 
                      style={styles.lrgimage} 
                      resizeMode="cover" 
                    />
                  )}

                  {imageLoading && (
                    <View style={styles.imageoverlay}>
                      <ActivityIndicator color="#fff" size="large" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.photo}
            onPress={handleImagePick}
            disabled={imageLoading}
          >
            <Image
              source={icons.canvas}
              style={styles.smlicon}
              tintColor={colors.blue}
            />
          </TouchableOpacity>

          <View style={styles.textfields}>
            <View style={styles.textfield}>
              <Text style={styles.text}>First Name</Text>

              <View style={styles.textbody}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.grey}
                  value={formData.firstname}
                  onChangeText={(text) => setFormData({...formData, firstname: text})}
                />
              </View>
            </View>

            <View style={styles.textfield}>
              <Text style={styles.text}>Last Name</Text>
              
              <View style={styles.textbody}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.grey}
                  value={formData.lastname}
                  onChangeText={(text) => setFormData({...formData, lastname: text})}
                />
              </View>
            </View>

            <View style={styles.textfield}>
              <Text style={styles.text}>Username</Text>
              
              <View style={styles.textbody}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  placeholderTextColor={colors.grey}
                  value={formData.username}
                  onChangeText={(text) => setFormData({...formData, username: text})}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.textfield}>
              <Text style={styles.text}>Location</Text>
              
              <View style={styles.textbody}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter location"
                  placeholderTextColor={colors.grey}
                  value={formData.location}
                  onChangeText={(text) => setFormData({...formData, location: text})}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, (loading || imageLoading) && styles.buttondisabled]}
            onPress={handleSave}
            disabled={loading || imageLoading}
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