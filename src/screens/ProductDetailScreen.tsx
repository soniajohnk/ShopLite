import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { getProductById } from '../services/productService';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { toggleFavorite } from '../store/favoritesSlice';
import { addToCart } from '../store/cartSlice';
import Ionicons from '@react-native-vector-icons/ionicons';
import commonStyles from '../styles/commonStyles';

const ProductDetailScreen = ({ route }) => {
  const [product, setProduct] = useState(null);
  const { productId, id } = route.params ?? {};
  const resolvedProductId = Number(productId ?? id);

  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!resolvedProductId) {
        return;
      }

      try {
        const data = await getProductById(resolvedProductId);
        if (isMounted) {
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [resolvedProductId]);

  if (!resolvedProductId) {
    return <Text>Invalid product link.</Text>;
  }

  if (!product) {
    return <Text>Loading...</Text>;
  }

  const isFavorite = favorites.some(item => item.id === product.id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.deatilsBlock}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text>Category: {product.category}</Text>
          <Text>Rating: ⭐ {product.rating}</Text>
          <Text>Stock: {product.stock}</Text>
        </View>
        <View style={styles.favouriteBlock}>
          <TouchableOpacity
            onPress={() => dispatch(toggleFavorite(product))}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color="red"
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={commonStyles.addButton}
        onPress={() => {
          dispatch(addToCart(product))
          Toast.show({
            type: 'success',
            text1: 'Added to Cart',
            text2: `${product.name} added successfully`,
            position: 'bottom',
          });
        }
        }
      >
        <Text style={commonStyles.addButtonText}> Add to Cart</Text>
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
  deatilsBlock: {
    flex: 1,
  },
  favouriteBlock: {
    padding: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
});