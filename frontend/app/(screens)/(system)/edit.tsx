import React, { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';

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
  const [profileImage, setProfileImage] = useState<{uri: string} | null>(null);
  
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    username: '',
    location: '',
    profile_photo: null
  });

  const handleImagePick = async () => {
    try {
      setImageLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const uploadResult = await uploadProfilePhoto(result.assets[0].uri);
        
        if (uploadResult.success) {
          const newPhotoUrl = {
            uri: `${apiURL}/api/v1/photos/${uploadResult.data.filename}?ts=${Date.now()}`
          };
          
          setUser(prev => ({
            ...prev,
            profile_photo: newPhotoUrl
          }));

          const userJson = await AsyncStorage.getItem('user');

          if (userJson) {
            const userData = JSON.parse(userJson);
            userData.profile_photo = uploadResult.data.filename;
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          }

          Alert.alert('Success', 'Profile photo updated!');
        } else {
          Alert.alert('Error', uploadResult.error || 'Failed to upload photo');
        }
      }
    } 
    catch (error) 
    {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    } 
    finally 
    {
      setImageLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!userId) throw new Error('User ID not available');
      
      const result = await updateUserProfile(userId, {
        firstname: user.firstname,
        lastname: user.lastname,
        location: user.location
      });
      
      if (result.success) {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const updatedUser = {
            ...JSON.parse(userJson),
            firstname: user.firstname,
            lastname: user.lastname,
            location: user.location,
            profile_photo: user.profile_photo?.uri 
              ? user.profile_photo.uri.split('/').pop()?.split('?')[0]
              : null
          };
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const userJson = await AsyncStorage.getItem('user');
          if (!userJson) throw new Error('No user data found');
          
          const storedUser = JSON.parse(userJson);
          if (!storedUser?.id) throw new Error('User ID not found');

          setUserId(storedUser.id);
          
          const userData = await getUserProfile(storedUser.id);
          
          console.log('User data from API:', {
            ...userData,
            profile_photo: userData.profile_photo 
              ? `${apiURL}/api/v1/photos/${userData.profile_photo}` 
              : null
          });

          const photoUrl = userData.profile_photo 
            ? { uri: `${apiURL}/api/v1/photos/${userData.profile_photo}?ts=${Date.now()}` }
            : null;

          setUser(prev => ({
            ...prev,
            ...userData,
            profile_photo: photoUrl
          }));

          setProfileImage(photoUrl ? { uri: photoUrl.uri } : null);

        } catch (error) {
          console.error('Edit load error:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, [])
  );

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
              <TouchableOpacity 
                onPress={handleImagePick} 
                disabled={imageLoading}
              >
                <View style={styles.bodyimage}>
                  <Image 
                    source={user.profile_photo ? { uri: user.profile_photo.uri } : images.profile}
                    style={styles.lrgimage}
                    onError={(e) => {
                      console.log("Image load failed - Details:", {
                        attemptedURI: user.profile_photo?.uri,
                        error: e.nativeEvent.error
                      });
                      setUser(prev => ({...prev, profile_photo: null}));
                    }}
                    onLoad={() => console.log("Image loaded successfully!")}
                    resizeMode="cover"
                  />

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
                  value={user.firstname}
                  onChangeText={(text) => setUser({...user, firstname: text})}
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
                  value={user.lastname}
                  onChangeText={(text) => setUser({...user, lastname: text})}
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
                  value={user.username}
                  onChangeText={(text) => setUser({...user, username: text})}
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
                  value={user.location}
                  onChangeText={(text) => setUser({...user, location: text})}
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