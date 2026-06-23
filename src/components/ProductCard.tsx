import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import commonStyles from '../styles/commonStyles';

const ProductCard = ({ product, onPress }) => {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      testID="product-card"
      style={commonStyles.card}
      onPress={onPress}
    >
      <Image
        testID="product-image"
        source={{ uri: product.imageUrl }}
        style={commonStyles.image}
      />

      <Text style={commonStyles.name}>
        {product.name}
      </Text>

      <Text style={commonStyles.price}>
        ${product.price}
      </Text>

      <Text style={commonStyles.details}>
        Category: {product.category}
      </Text>
      <TouchableOpacity
        testID="add-to-cart-button"
        style={commonStyles.addButton}
        onPress={() => dispatch(addToCart(product))}
      >
        <Text style={commonStyles.addButtonText}>
          Add To Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductCard;