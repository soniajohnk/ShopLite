import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getProductById } from '../services/productService';
import { useDispatch, useSelector } from 'react-redux';


import {
  toggleFavorite,
} from '../store/favoritesSlice';

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState(null);
  const { productId } = route.params;

useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  if (!product) {
    return <Text>Loading...</Text>;
  }

  //const { product } = route.params;
  const dispatch = useDispatch();

  const favorites = useSelector(
    state => state.favorites.items,
  );

  const isFavorite = favorites.some(
    item => item.id === product.id,
  );

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.desc}>{product.description}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text>Category: {product.category}</Text>
      <Text>Rating: ⭐ {product.rating}</Text>
      <Text>Stock: {product.stock}</Text>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() =>
          dispatch(toggleFavorite(product))
        }
      >
        <Text style={styles.favoriteText}>
          {isFavorite
            ? '❤️ Remove from Favorites'
            : '🤍 Add to Favorites'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 250, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  desc: { marginTop: 8, color: '#555' },
  price: { fontSize: 18, color: 'green', marginTop: 10 },
  favoriteButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },

  favoriteText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});