import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import Supported Contents
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

// Import View and Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import Icons, Images and Colors
import { icons, images } from '../../../constants';
import colors from '../../../constants/colors';

const Service = () => {
  const router = useRouter();

  const params = useLocalSearchParams();
  const service = JSON.parse(params.service);

  const [selectedCheck, setSelectedCheck] = useState(icons.unchecked);

  const toggleCheckbox = () => {
    setSelectedCheck(!selectedCheck);
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={styles.headerbutton}
                >
                    <Image
                        source={icons.back}
                        style={styles.lrgicon}
                        tintColor={colors.black}                
                    />
                </TouchableOpacity> 

                <Text style={styles.headertext}>{service.title}</Text>

                <Text style={styles.headersub}></Text>
            </View>

            <View style={styles.image}>
                <Image
                    source={service.image}
                    style={styles.lrgimage}
                />
            </View>

            <View style={styles.price}>
                <Text style={styles.per}>Per {service.per}</Text>

                <View style={styles.vertix}></View>

                <Text style={styles.fee}>${service.price}</Text>
            </View>

            <View style={styles.body}>
                <View style={styles.service}>
                    <Text style={styles.servicetext}>Service Description</Text>
                    
                    <View style={styles.star}>
                        <Image
                            source={icons.star}
                            style={styles.smlicon}
                            tintColor={colors.gold}
                        />
                    
                        <Text style={styles.startext}>4.9</Text>
                    </View>
                </View>

                <View style={styles.user}>
                    <Image
                        source={icons.user}
                        style={styles.smlicon}
                        tintColor={colors.grey}
                    />
                
                    <Text style={styles.usertext}>{service.users} users</Text>
                </View>

                <Text style={styles.servicesubtext}>{service.description}</Text>

                <TouchableOpacity 
                    style={styles.check}
                    onPress={toggleCheckbox}
                >
                    <Image
                        source={selectedCheck ? icons.checked : icons.unchecked}
                        style={styles.midicon}                
                    />

                    <Text style={styles.checktext}>I need parts for my vehicle</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.horizon} />

            <View style={styles.footer}>
                <Text style={styles.footertext}>Emergency Vehicle Information</Text>

                <View style={styles.location}>
                    <View style={styles.locale}>
                        <Image
                            source={icons.location}
                            style={styles.midicon}
                            tintColor={colors.black}    
                        />

                        <Text style={styles.locationtext}>Vehicle Location</Text>
                    </View>

                    <Image
                        source={icons.aim}
                        style={styles.midicon}
                        tintColor={colors.grey}    
                    />
                </View>

                <View style={styles.model}>
                    <Image
                        source={icons.driving}
                        style={styles.midicon}
                        tintColor={colors.black}    
                    />

                    <Text style={styles.modeltext}>Vehicle Model</Text>
                </View>
            </View>

            <TouchableOpacity 
                onPress={() => router.push('/book')}
                style={styles.button}
            >
                <Text style={styles.buttontext}>Book Now</Text>
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
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    flexDirection: 'row',
    width: '80%',
    marginTop: 50,
    marginBottom: 20,
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },

  headerbutton: {

  },

  headertext: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    color: colors.black,
  },

  /* Image */

  image: {
    width: '80%',
    height: 200,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 30,
  },

  /* Body */

  body: {
    width: '80%',
    gap: 20,
    marginBottom: 30,
  },

  /* Service */

  service: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },

  servicetext: {
    fontFamily: 'SF-Pro-Display-Bold',
    fontSize: 25,
    color: colors.black,
  },

  servicesubtext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 17,
    color: colors.black,
    lineHeight: 20,
  },

  /* Star */

  star: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  startext: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 15,
    color: colors.black,
  },

  /* User */

  user: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  usertext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 15,
    color: colors.grey,
  },

  /* Check */

  check: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  checktext: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 15,
    color: colors.black,
  },

  /* Model */

  footer: {
    flexDirection: 'column',
    width: '80%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    gap: 30,
    marginBottom: 10,
  },

  footertext: {
    fontFamily: 'SF-Pro-Display-Semibold',
    fontSize: 20,
    color: colors.black,
  },  

  /* Location */

  location: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },

  locale: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  locationtext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 17,
    color: colors.grey,
  },

  /* Model */

  model: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  modeltext: {
    fontFamily: 'SF-Pro-Display-Regular',
    fontSize: 17,
    color: colors.grey,
  },

  /* Button */

  button: {
    position: 'relative',
    width: '80%',
    top: 10,
    backgroundColor: colors.red,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: 'center',
    textAlign: 'center',
  },

  buttontext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.white,
  },

  /* Price */

  price: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    width: 150,
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 30,
    top: 270,
  },

  fee: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.white,
  },

  per: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Regular',
    color: colors.white,
  },

  /* Add-On */

  horizon: {
    height: 1,
    width: '80%',
    backgroundColor: colors.lightgrey,
    marginVertical: 10, 
    marginBottom: 30,
  },

  vertix: {
    width: 1,
    height: '100%',
    backgroundColor: colors.white,
  },

  /* Images and Icons */

  lrgimage: {
    width: '100%',
    height: '100%',
  },

  smlicon: {
    width: 20,
    height: 20,
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

export default Service;