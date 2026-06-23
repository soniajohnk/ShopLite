import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';

import { useSelector } from 'react-redux';

import ProductCard from '../components/ProductCard';

const FavoritesScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);

  const favorites = useSelector(
    state => state.favorites.items,
  );

  const onRefresh = async () => {
    setRefreshing(true);

    // Future API sync can be added here

    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const renderItem = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() =>
        navigation.navigate('ProductDetail', {
          product: item,
        })
      }
    />
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>
          ❤️
        </Text>

        <Text style={styles.emptyTitle}>
          No Favorites Yet
        </Text>

        <Text style={styles.emptySubtitle}>
          Products you mark as favorites
          will appear here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={item =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          padding: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});

export default FavoritesScreen;