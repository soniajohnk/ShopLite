import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setFavorites } from '../store/favoritesSlice';
import { loadFavorites } from '../services/favoritesStorage';

export default function useLoadFavorites() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites =
        await loadFavorites();

      dispatch(
        setFavorites(favorites),
      );
    };

    fetchFavorites();
  }, []);
}