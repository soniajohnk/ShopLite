import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import {
    useDispatch,
    useSelector,
} from 'react-redux';

import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
} from '../store/cartSlice';

const CartScreen = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    state => state.cart.items,
  );

  const grandTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

  const renderItem = ({ item }) => {
    const subtotal =
      item.price * item.quantity;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.name}>
            {item.name}
          </Text>

          <Text style={styles.price}>
            ${item.price}
          </Text>

          <Text style={styles.subtotal}>
            Subtotal: ${subtotal.toFixed(2)}
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() =>
                dispatch(
                  decreaseQuantity(item.id),
                )
              }
            >
              <Text style={styles.qtyText}>
                -
              </Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() =>
                dispatch(
                  increaseQuantity(item.id),
                )
              }
            >
              <Text style={styles.qtyText}>
                +
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              dispatch(removeFromCart(item.id))
            }
          >
            <Text style={styles.remove}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Your cart is empty
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      />

      <View style={styles.summary}>
        <Text style={styles.totalLabel}>
          Grand Total
        </Text>

        <Text style={styles.totalAmount}>
          ${grandTotal.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    card: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 12,
        borderRadius: 10,
        elevation: 2,
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },

    content: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    price: {
        fontSize: 16,
        color: 'green',
        marginTop: 4,
    },

    subtotal: {
        marginTop: 6,
        fontWeight: '600',
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },

    qtyButton: {
        width: 32,
        height: 32,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },

    qtyText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },

    quantity: {
        marginHorizontal: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },

    remove: {
        color: 'red',
        marginTop: 12,
    },

    summary: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: '#FFF',
        padding: 20,

        borderTopWidth: 1,
        borderColor: '#EEE',
    },

    totalLabel: {
        fontSize: 16,
        color: '#666',
    },

    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 18,
        color: '#666',
    },
});

export default CartScreen;