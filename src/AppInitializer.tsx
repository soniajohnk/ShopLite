import React from 'react';

import useLoadFavorites from './hooks/useLoadFavorites';
import usePersistFavorites from './hooks/usePersistFavorites';

const AppInitializer = ({ children }) => {
  useLoadFavorites();
  usePersistFavorites();

  return children;
};

export default AppInitializer;