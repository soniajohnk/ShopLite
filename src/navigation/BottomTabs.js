import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Ionicons from '@react-native-vector-icons/ionicons';

import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const cartCount = useSelector(state =>
    state.cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  );

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Products') {
            iconName = focused ? 'bag' : 'bag-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
        },
      })}
      >
      <Tab.Screen
        name="Products"
        component={ProductListScreen}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge:
            cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
      />
    </Tab.Navigator>
  );
}