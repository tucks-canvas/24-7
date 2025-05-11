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

const categories = [
    {
        id: 0,
        title: 'Services',
        image: icons.service,
    },
    {
        id: 1,
        title: 'Rent',
        image: icons.car,
    },
    {
        id: 2,
        title: 'Selling',
        image: icons.wrench,
    },
];

const services = [
    {
        id: 0,
        title: 'Repair Service',
        type: 'Repair',
        frequency: '24/7',
        image: icons.gear,
    },
    {
        id: 1,
        title: 'Flat Tyre Service',
        type: 'Flat Tyre',
        frequency: '24/7',
        image: icons.wheel,
    },
    {
        id: 2,
        title: 'Flat Battery Service',
        type: 'Flat Battery',
        frequency: '24/7',
        image: icons.fast,
    },
    {
        id: 3,
        title: 'Wash Service',
        type: 'Wash',
        frequency: '24/7',
        image: icons.wash,
    },
    {
        id: 4,
        title: 'Recovery Service',
        type: 'Recovery',
        frequency: '24/7',
        image: icons.crane,
    },
    {
        id: 5,
        title: 'Oil Change Service',
        type: 'Oil Change',
        frequency: '24/7',
        image: icons.oil,
    },

];

const Home = () => {
  const router = useRouter();

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headercontent}>
                    <TouchableOpacity style={styles.headerimage}>
                        <Image
                            source={images.placeholder}
                            style={styles.smlimage}
                        />
                    </TouchableOpacity>

                    <Text style={styles.headertext}>Welcome</Text>
                </View>
                
                <Image
                    source={icons.alert}
                    style={styles.smlicon}
                    tintColor={colors.red}
                />
            </View>

            <View style={styles.search}>
                <Image
                    source={icons.search}
                    style={styles.smlicon}
                />

                <TextInput
                    placeholder="Search"
                    placeholderTextColor={colors.grey}
                    style={styles.input}
                />

                <View style={styles.scan}>
                    <Image
                        source={icons.scan}
                        style={styles.smlicon}
                        tintColor={colors.white}
                    />
                </View>
            </View>

            <View style={styles.poster}></View>

            <View style={styles.categories}>
                {categories.map((category) => (
                    <View
                        key={category.id}
                        style={styles.category}
                    >
                        <Image
                            source={category.image}
                            style={styles.smlicon}
                            tintColor={colors.white}                        
                        />

                        <Text style={styles.catext}>{category.title}</Text>
                    </View>
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
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  /* Header */

  header: {
    width: '80%',
  },

  headerimage: {
    borderRadius: 15,
    overflow: 'hidden',
  },

  headercontent: {
    gap: 10,
  },

  headertext: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  /* Search */

  search: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.grey,
  },

  input: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  scan: {
    borderRadius: 20,
    backgroundColor: colors.grey,
    padding: 5,
  },

  /* Icons and Images */

  smlimage: {
    width: 50,
    height: 50,
  },

  smlicon: {
    width: 20,
    height: 20,
  },

});

export default Home;