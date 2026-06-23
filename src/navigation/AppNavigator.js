import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductListScreen from '../screens/ProductListScreen';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    'myshoplite://',
    'shoplite://',
    'shoplite://app',
  ],
  config: {
    screens: {
      Main: {
        screens: {
          Products: 'products',
          Cart: 'cart',
          Favorites: 'favorites',
        },
      },

      ProductDetail: {
        path: 'product/:productId',
        parse: {
          productId: Number,
        },
      },
    },
  },
};

export default function AppNavigator() {

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      console.log('Initial URL:', url);
    });

    const subscription = Linking.addEventListener(
      'url',
      ({ url }) => {
        console.log('Received URL:', url);
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      onStateChange={state => {
        console.log(
          'Navigation State:',
          JSON.stringify(state, null, 2),
        );
      }}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
