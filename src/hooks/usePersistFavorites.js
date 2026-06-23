import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { saveFavorites } from '../services/favoritesStorage';

export default function usePersistFavorites() {
  const favorites = useSelector(
    state => state.favorites.items,
  );

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);
}