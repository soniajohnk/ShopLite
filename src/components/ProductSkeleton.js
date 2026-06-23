import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProductSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.title} />
      <View style={styles.price} />
      <View style={styles.category} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
  },

  image: {
    height: 180,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },

  title: {
    height: 20,
    marginTop: 10,
    width: '70%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },

  price: {
    height: 18,
    marginTop: 10,
    width: '30%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },

  category: {
    height: 16,
    marginTop: 10,
    width: '50%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
});

export default ProductSkeleton;