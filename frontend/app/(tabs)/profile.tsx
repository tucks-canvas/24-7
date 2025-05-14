import React, { useState, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';

// Import React-Native Content 
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Icons and Images 
import { icons, images } from '../../constants';
import colors from '../../constants/colors';
import { getUserProfile, logoutUser } from '../../src/services/api';

const Profile = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState({
    username: 'Loading...',
    firstname: '',
    lastname: '',
    location: '',
    profile_photo: images.profile
  });

  useFocusEffect(
    React.useCallback(() => {
      const loadProfile = async () => {
        setLoading(true);
        try {
          // First get the stored user data
          const userJson = await AsyncStorage.getItem('user');
          if (!userJson) {
            throw new Error('No user data found');
          }
          
          const storedUser = JSON.parse(userJson);
          if (!storedUser?.id) {
            throw new Error('User ID not found in stored data');
          }
          
          setUserId(storedUser.id);
          
          // Then fetch the profile
          const profile = await getUserProfile(storedUser.id);
          
          setUser({
            username: profile.username || storedUser.username || 'Anonymous',
            firstname: profile.firstname || storedUser.firstname || '',
            lastname: profile.lastname || storedUser.lastname || '',
            location: profile.location || storedUser.location || 'No location set',
            profile_photo: profile.profile_photo 
              ? { uri: `${apiURL}/photos/${profile.profile_photo}` } 
              : images.profile
          });
          
        } catch (error) {
          console.error('Profile load error:', error);
          Alert.alert('Error', error.message || 'Failed to load profile');
        } finally {
          setLoading(false);
        }
      };

      loadProfile();
    }, []) // Empty dependency array means this runs only on focus
  );

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      await AsyncStorage.clear(); 
      router.replace('/sign');
    } 
    catch (error) 
    {
      Alert.alert('Logout Error', error.message || 'Failed to logout');
    } 
    finally 
    {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    router.push('/edit');
  };

  const menu = [
    {
      id: 0,
      title: 'History',
      image: icons.shield,
      link: '/history',
    },
    {
      id: 1,
      title: 'Notification',
      image: icons.brightness,
      hasToggle: true,
    },
    {
      id: 2,
      title: 'Settings',
      image: icons.alert,
      link: '/settings',
    },
    {
      id: 3,
      title: 'Support',
      image: icons.lock,
      link: '/support',
    },
    {
      id: 4,
      title: 'Logout',
      image: icons.logout,
      action: handleLogout,
    },
  ];

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
                <Text style={styles.headertext}>Profile</Text>
                <Text style={styles.headersubtext}></Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.body}>
            <View style={styles.bodycontent}>
              <View style={styles.bodyimage}>
                <Image source={images.profile} style={styles.lrgimage} resizeMode="cover" />
              </View>

              <TouchableOpacity 
                style={styles.edit}
                onPress={handleEdit}
              >
                <Image source={icons.edit} style={styles.smlicon} tintColor={colors.lightblue} />
                <Text style={styles.editext}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textcontent}>
            <Text style={styles.text}>{user.username}</Text>
            <Text style={styles.subtext}>{user.location}</Text>
          </View>

          <View style={styles.menu}>
            {menu.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                onPress={item.action || (() => item.link && router.push(item.link))}
              >
                <View style={styles.itemcontents}>
                  <View style={styles.itemcontent}>
                    <View style={styles.itemimage}>
                      <Image source={item.image} style={styles.smlicon} tintColor={colors.black} />
                    </View>
                    <Text style={styles.itemtext}>{item.title}</Text>
                  </View>

                  {item.hasToggle && (
                    <TouchableOpacity 
                      onPress={() => setNotificationEnabled(!notificationEnabled)}
                    >
                      <Image
                        source={notificationEnabled ? icons.on : icons.off}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.line}></View>
              </TouchableOpacity>
            ))}
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
    marginBottom: 20,
  },

  bodycontent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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

  textcontent: {
    bottom: 40,
    width: '80%',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 15,
  },

  text: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    color: colors.black,
  },

  subtext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 17,
    color: colors.black,
    lineHeight: 35,
  },

  /* Menu */

  menu: {
    bottom: 40,
    width: '80%',
    gap: 20,
    marginTop: 10,
  },

  /* Item */

  item: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },

  itemcontents: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemcontent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 10,
  },

  itemtext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 15,
    color: colors.black,
  },

  itemimage: {
    backgroundColor: colors.lightestgrey,
    width: 25,
    height: 25,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  /* Edit */

  edit: {
    padding: 10,
    width: 70,
    height: 40,
    flexDirection: 'row',
    backgroundColor: colors.lightestgrey,
    borderColor: colors.lightblue,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: 'space-between',    
  },

  editext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 13,
    color: colors.lightblue,
  },

  /* Add-On */

  line: {
    width: '100%',
    backgroundColor: colors.lightestgrey,
    height: 1,
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

export default Profile;