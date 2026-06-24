import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store';


const Stack = createNativeStackNavigator();
import AppNavigator from './src/navigation/AppNavigator';
import AppInitializer from './src/AppInitializer';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <AppInitializer>
        <AppNavigator />
      </AppInitializer>
    </Provider>
  );
}

export default App;
