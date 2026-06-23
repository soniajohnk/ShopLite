import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';

import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import ProductSkeleton from '../components/ProductSkeleton';

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTabletOrWeb = width >= 768;
  const numColumns = isTabletOrWeb ? 2 : 1;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchProducts1();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchProducts1();
    } finally {
      setRefreshing(false);
    }
  };

  const fetchProducts1 = async () => {
    try {
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      setError('Failed to load products');
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        isTabletOrWeb && styles.itemContainerTablet,
      ]}
    >
      <ProductCard
        product={item}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            product: item,
            productId: item.id,
          })
        }
      />
    </View>
  );

  // Loading State
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Product Catalog</Text>

        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </View>
    );
  }

  // Error State
  if (error && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            loadProducts();
          }}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Catalog</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredProducts}
        key={numColumns} // Forces re-render when column count changes
        numColumns={numColumns}
        columnWrapperStyle={
          numColumns > 1
            ? styles.row
            : undefined
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              No products found
            </Text>
          </View>
        }
        contentContainerStyle={
          filteredProducts.length === 0
            ? { flexGrow: 1 }
            : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  row: {
    justifyContent: 'space-between',
  },

  itemContainer: {
    width: '100%',
  },

  itemContainerTablet: {
    width: '48%',
  },
});

export default HomeScreen;