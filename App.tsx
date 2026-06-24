import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';


const Stack = createNativeStackNavigator();
import AppNavigator from './src/navigation/AppNavigator';
import AppInitializer from './src/AppInitializer';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppInitializer>
        <AppNavigator />
        <Toast />
      </AppInitializer>
    </Provider>
  );
}

export default App;
