import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites';

export const saveFavorites = async favorites => {
  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify(favorites),
    );
  } catch (error) {
    console.log(error);
  }
};

export const loadFavorites = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);

    return value
      ? JSON.parse(value)
      : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};