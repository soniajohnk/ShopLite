import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const ProductCard = ({ product, onPress }) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      testID="product-card"
      style={styles.card}
      onPress={onPress}
    >
      <Image
        testID="product-image"
        source={{ uri: product.imageUrl }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {product.name}
      </Text>

      <Text style={styles.price}>
        ${product.price}
      </Text>

      <Text style={styles.details}>
        Category: {product.category}
      </Text>
      <TouchableOpacity
        testID="add-to-cart-button"
        style={styles.addButton}
        onPress={() => dispatch(addToCart(product))}
      >
        <Text style={styles.addButtonText}>
          Add To Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  details: {
    marginTop: 4,
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },

  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default ProductCard;