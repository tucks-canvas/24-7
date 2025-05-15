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
        image: icons.selling,
    },
];

const services = [
    {
        id: 0,
        title: 'Repair Service',
        type: 'Repair',
        frequency: '24/7',
        image: images.image1,
        icon: icons.repair,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
    {
        id: 1,
        title: 'Flat Tyre Service',
        type: 'Flat Tyre',
        frequency: '24/7',
        image: images.image2,
        icon: icons.wheel,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
    {
        id: 2,
        title: 'Flat Battery Service',
        type: 'Flat Battery',
        frequency: '24/7',
        image: images.image3,
        icon: icons.battery,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
    {
        id: 3,
        title: 'Wash Service',
        type: 'Wash',
        frequency: '24/7',
        image: images.image4,
        icon: icons.wash,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
    {
        id: 4,
        title: 'Recovery Service',
        type: 'Recovery',
        frequency: '24/7',
        image: images.image5,
        icon: icons.crane,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
    {
        id: 5,
        title: 'Oil Change Service',
        type: 'Oil Change',
        frequency: '24/7',
        image: images.image6,
        icon: icons.oil,
        stars: '4.9',
        description: 'The Model B was a Ford automobile with production starting in model year 1932',
        users: '1605K',
        per: 'hour',
        price: '100',
    },
];

const rentings = [
  {
    id: 0,
    title: 'Car Rent Service',
    image: images.car,
    available: 'Available',
  },
  {
    id: 1,
    title: 'Motorcycle Service',
    image: images.motorcycle,
    available: 'Available',
  },
  {
    id: 2,
    title: 'Bicycle Rent Service',
    image: images.bicycle,
    available: 'Available',
  },
  {
    id: 3,
    title: 'Truck Rent Service',
    image: images.truck,
    available: 'Unavailable',
  },
];

const Home = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('Services');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRentings = rentings.filter(renting => 
    renting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />  
      
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.head}>
            <View style={styles.header}>
                <View style={styles.headercontent}>
                    <TouchableOpacity style={styles.headerimage}>
                        <Image
                            source={images.profile1}
                            style={styles.lrgimage}
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
              <View style={styles.searcheader}>
                <Image
                  source={icons.search}
                  style={styles.smlicon}
                  tintColor={colors.grey}
                />
                <TextInput
                  placeholder="Find your need service..."
                  placeholderTextColor={colors.grey}
                  style={styles.input}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Image
                    source={icons.close}
                    style={styles.smlicon}
                    tintColor={colors.grey}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.searchimg}>
                  <Image
                    source={icons.scan}
                    style={styles.icon}
                    tintColor={colors.white}
                  />
                </View>
              )}
            </View>

            <View style={styles.poster}>
              <Image
                source={images.poster1}
                style={styles.image}
                resizeMode='contain'
              />
            </View>

            <View style={styles.categories}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.category,
                    selectedCategory === category.title && styles.selectedcategory
                  ]}
                  onPress={() => setSelectedCategory(category.title)}
                >
                  <View style={styles.categoryimage}>
                    <Image
                      source={category.image}
                      style={styles.lrgimage}
                      tintColor={selectedCategory === category.title ? colors.white : colors.grey}
                      resizeMode='contain'
                    />
                  </View>

                  <Text style={[
                    styles.categorytext,
                    selectedCategory === category.title && styles.selectedtext
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.foot}>
            <View style={styles.footer}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollview}
              >
                {selectedCategory === 'Services' && (                 
                  <View>
                    <Text style={styles.footertext}>Vehicle Services</Text>

                    <View style={styles.services}>
                        {filteredServices.map((service) => (
                          <TouchableOpacity
                            key={service.id}
                            style={styles.service}
                            onPress={() => router.push({
                              pathname: '/service',
                              params: { service: JSON.stringify(service) }
                            })}
                          >              
                            <View style={styles.serviceimage}>
                              <Image
                                source={service.image}
                                style={styles.lrgimage}
                                resizeMode='contain'
                              />
                            </View>
                              
                            <View style={styles.types}>
                              <View style={styles.typeimage}>
                                <Image
                                  source={service.icon}
                                  style={styles.smlicon}
                                />
                              </View>

                              <View style={styles.typebody}>
                                <Text style={styles.typetext}>{service.type}</Text>
                              </View>
                            </View>

                            <View style={styles.servicefooter}>
                              <Text style={styles.servicetext}>{service.title}</Text>

                              <View style={styles.servicebody}>
                                <Image
                                  source={icons.headphones}
                                  style={styles.smlicon}
                                  tintColor={colors.grey}
                                />

                                <Text style={styles.servicesubtext}>{service.frequency}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )}   

                {selectedCategory === 'Rent' && (                 
                  <View>
                    <Text style={styles.footertext}>Renting Services</Text>

                    <View style={styles.rentings}>
                    </View>
                  </View>
                )} 

                {selectedCategory === 'Selling' && (                 
                  <View>
                    <Text style={styles.footertext}>Selling Services</Text>

                    <View style={styles.sellings}>
                    </View>
                  </View>
                )} 

              </ScrollView>
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

  head: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
    height: '15%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: colors.white,
    marginBottom: 20,
  },

  foot: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },

  scrollview: {
    paddingTop: 10,
    paddingBottom: 100,
  },

  /* Header */

  header: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },

  headerimage: {
    width: 30,
    height: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },

  headercontent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: 15,
  },

  headertext: {
    fontSize: 25,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
  },

  /* Footer */

  footer: {
    width: '80%',
  },

  footertext: {
    fontFamily: 'SF-Pro-Display-Bold',
    fontSize: 25,
    color: colors.black,
  },

  /* Search */

  search: {
    width: '80%',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.grey,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },

  searcheader: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  input: {
    fontSize: 17,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  searchimg: {
    borderRadius: 25,
    backgroundColor: colors.lightgrey,
    padding: 10,
  },

  /* Poster */

  poster: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    left: 10,
  },

  /* Categories */

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  category: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    gap: 10,
  },

  categoryimage: {
    width: 25,
    height: 25,
  },

  categorytext: {
    fontSize: 15,
    color: colors.black,
    fontFamily: 'SF-Pro-Display-Medium',
  },

  /* Types */

  types: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 10,
    top: 70,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  typeimage: {
    backgroundColor: colors.white,
    padding: 10,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 25,
  },

  typebody: {
    backgroundColor: colors.white,
    padding: 7,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    right: 19,
  },

  typetext: {
    fontSize: 10,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  /* Service */

  services: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },

  serviceimage: {
    width: 150,
    height: 150,
  },

  servicetext: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Display-Bold',
    color: colors.black,
  },

  servicebody: {
    flexDirection: 'row',
    gap: 5,
  },

  servicefooter: {
    flexDirection: 'column',
    gap: 5,
  },

  servicesubtext: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.black,
  },

  /* Selected */

  selectedcategory: {
    padding: 12,
    backgroundColor: colors.blue,
    borderRadius: 12,
  },

  selectedtext: {
    fontSize: 15,
    fontFamily: 'SF-Pro-Display-Medium',
    color: colors.white,
  },

  /* Icons and Images */

  image: {
    width: '110%',
    height: 210,
  },

  smlimage: {
    width: 50,
    height: 50,
  },

  lrgimage: {
    width: '100%',
    height: '100%',
  },

  smlicon: {
    width: 20,
    height: 20,
  },

  icon: {
    width: 15,
    height: 15,
    padding: 10,
  },
});

export default Home;