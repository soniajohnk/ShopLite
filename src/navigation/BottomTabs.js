import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const cartCount = useSelector(state =>
    state.cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  );

  return (
    <Tab.Navigator>
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