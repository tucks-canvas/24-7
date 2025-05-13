import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Sign from './(screens)/(auth)/sign';

const Stack = createStackNavigator();

const Index = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Sign" component={Sign} />
    </Stack.Navigator>
  );
};

export default Index;
