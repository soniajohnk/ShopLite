import cartReducer, {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../../src/store/cartSlice';

describe('Cart Store - cartSlice', () => {
  // ============ Test Data ============
  const mockProducts = {
    phone: {
      id: '1',
      name: 'iPhone 15',
      price: 999,
      imageUrl: 'https://example.com/iphone.jpg',
      category: 'Electronics',
    },
    laptop: {
      id: '2',
      name: 'MacBook Pro',
      price: 1999,
      imageUrl: 'https://example.com/macbook.jpg',
      category: 'Electronics',
    },
    tablet: {
      id: '3',
      name: 'iPad Air',
      price: 599,
      imageUrl: 'https://example.com/ipad.jpg',
      category: 'Electronics',
    },
  };

  const initialState = { items: [] };

  // ============ Helper Functions ============
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // ============ Initial State Tests ============
  describe('Initial State', () => {
    it('should return the initial state', () => {
      const state = cartReducer(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual(initialState);
    });

    it('should have an empty items array initially', () => {
      const state = cartReducer(undefined, { type: 'UNKNOWN' });
      expect(state.items).toEqual([]);
      expect(state.items.length).toBe(0);
    });
  });

  // ============ Add to Cart Tests ============
  describe('addToCart Action', () => {
    it('should add a new product to the cart', () => {
      const state = cartReducer(initialState, addToCart(mockProducts.phone));

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({
        ...mockProducts.phone,
        quantity: 1,
      });
    });

    it('should add multiple different products to the cart', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      expect(state.items).toHaveLength(3);
      expect(state.items[0].name).toBe('iPhone 15');
      expect(state.items[1].name).toBe('MacBook Pro');
      expect(state.items[2].name).toBe('iPad Air');
    });

    it('should increment quantity when adding an existing product', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.phone));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should increment quantity multiple times for same product', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.phone));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(4);
    });

    it('should preserve other items when adding duplicate', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.phone));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].quantity).toBe(2);
      expect(state.items[1].quantity).toBe(1);
    });

    it('should add product with correct price', () => {
      const state = cartReducer(initialState, addToCart(mockProducts.laptop));

      expect(state.items[0].price).toBe(1999);
    });

    it('should handle products with decimal prices', () => {
      const productWithDecimalPrice = { ...mockProducts.phone, price: 49.99 };
      const state = cartReducer(initialState, addToCart(productWithDecimalPrice));

      expect(state.items[0].price).toBe(49.99);
    });

    it('should not modify the original product object', () => {
      const originalProduct = { ...mockProducts.phone };
      cartReducer(initialState, addToCart(mockProducts.phone));

      expect(mockProducts.phone).toEqual(originalProduct);
    });
  });

  // ============ Increase Quantity Tests ============
  describe('increaseQuantity Action', () => {
    it('should increase quantity of an existing item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      expect(state.items[0].quantity).toBe(2);
    });

    it('should increase quantity multiple times', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      expect(state.items[0].quantity).toBe(4);
    });

    it('should not affect other items in cart', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      expect(state.items[0].quantity).toBe(2);
      expect(state.items[1].quantity).toBe(1);
    });

    it('should do nothing when item does not exist', () => {
      const state = cartReducer(initialState, increaseQuantity('non-existent-id'));

      expect(state.items).toHaveLength(0);
    });

    it('should handle large quantity increases', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      for (let i = 0; i < 99; i++) {
        state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      }

      expect(state.items[0].quantity).toBe(100);
    });
  });

  // ============ Decrease Quantity Tests ============
  describe('decreaseQuantity Action', () => {
    it('should decrease quantity of an item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));

      expect(state.items[0].quantity).toBe(1);
    });

    it('should remove item when quantity reaches 0', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));

      expect(state.items).toHaveLength(0);
    });

    it('should decrease quantity multiple times', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      for (let i = 0; i < 5; i++) {
        state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      }
      // Now quantity is 6

      for (let i = 0; i < 4; i++) {
        state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));
      }
      // Now quantity should be 2

      expect(state.items[0].quantity).toBe(2);
    });

    it('should not affect other items when decreasing one', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.laptop.id));

      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));

      expect(state.items[0].quantity).toBe(1);
      expect(state.items[1].quantity).toBe(2);
    });

    it('should do nothing when item does not exist', () => {
      const state = cartReducer(initialState, decreaseQuantity('non-existent-id'));

      expect(state.items).toHaveLength(0);
    });

    it('should completely remove item from cart when quantity is 1', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));

      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('2');
    });
  });

  // ============ Remove from Cart Tests ============
  describe('removeFromCart Action', () => {
    it('should remove an item from the cart', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      state = cartReducer(state, removeFromCart(mockProducts.phone.id));

      expect(state.items).toHaveLength(0);
    });

    it('should remove specific item from multiple items', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      state = cartReducer(state, removeFromCart(mockProducts.laptop.id));

      expect(state.items).toHaveLength(2);
      expect(state.items[0].id).toBe('1');
      expect(state.items[1].id).toBe('3');
    });

    it('should remove item regardless of quantity', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      for (let i = 0; i < 5; i++) {
        state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      }
      // Quantity is now 6

      state = cartReducer(state, removeFromCart(mockProducts.phone.id));

      expect(state.items).toHaveLength(0);
    });

    it('should do nothing when removing non-existent item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      state = cartReducer(state, removeFromCart('non-existent-id'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('1');
    });

    it('should preserve order of remaining items', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      state = cartReducer(state, removeFromCart(mockProducts.phone.id));

      expect(state.items[0].id).toBe('2');
      expect(state.items[1].id).toBe('3');
    });
  });

  // ============ Total Calculations Tests ============
  describe('Total Price Calculation', () => {
    it('should calculate correct total for single item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      const total = calculateTotalPrice(state.items);

      expect(total).toBe(999);
    });

    it('should calculate correct total for single item with quantity > 1', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      const total = calculateTotalPrice(state.items);

      expect(total).toBe(2997); // 999 * 3
    });

    it('should calculate correct total for multiple items', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      const total = calculateTotalPrice(state.items);

      expect(total).toBe(3597); // 999 + 1999 + 599
    });

    it('should calculate correct total with multiple quantities', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id)); // qty: 2
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, increaseQuantity(mockProducts.laptop.id));
      state = cartReducer(state, increaseQuantity(mockProducts.laptop.id)); // qty: 3

      const total = calculateTotalPrice(state.items);

      expect(total).toBe(7995); // (999 * 2) + (1999 * 3)
    });

    it('should recalculate total after quantity increase', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      let total = calculateTotalPrice(state.items);
      expect(total).toBe(999);

      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      total = calculateTotalPrice(state.items);
      expect(total).toBe(1998);
    });

    it('should recalculate total after quantity decrease', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      // qty: 3, total: 2997

      let total = calculateTotalPrice(state.items);
      expect(total).toBe(2997);

      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));
      total = calculateTotalPrice(state.items);
      expect(total).toBe(1998);
    });

    it('should recalculate total after removing item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));

      let total = calculateTotalPrice(state.items);
      expect(total).toBe(2998); // 999 + 1999

      state = cartReducer(state, removeFromCart(mockProducts.laptop.id));
      total = calculateTotalPrice(state.items);
      expect(total).toBe(999);
    });

    it('should handle decimal prices correctly', () => {
      const productWithDecimalPrice = {
        ...mockProducts.phone,
        price: 19.99,
      };

      let state = initialState;
      state = cartReducer(state, addToCart(productWithDecimalPrice));
      state = cartReducer(state, increaseQuantity(productWithDecimalPrice.id));

      const total = calculateTotalPrice(state.items);

      expect(total).toBeCloseTo(39.98, 2);
    });
  });

  // ============ Total Quantity Calculation Tests ============
  describe('Total Quantity Calculation', () => {
    it('should calculate correct total quantity for single item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      const totalQty = calculateTotalQuantity(state.items);

      expect(totalQty).toBe(1);
    });

    it('should calculate correct total quantity with multiple of same item', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      const totalQty = calculateTotalQuantity(state.items);

      expect(totalQty).toBe(3);
    });

    it('should calculate correct total quantity for multiple items', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      const totalQty = calculateTotalQuantity(state.items);

      expect(totalQty).toBe(3);
    });

    it('should calculate correct total quantity with varied quantities', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, increaseQuantity(mockProducts.laptop.id));
      state = cartReducer(state, increaseQuantity(mockProducts.laptop.id));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      const totalQty = calculateTotalQuantity(state.items);

      expect(totalQty).toBe(6); // 2 + 3 + 1
    });

    it('should recalculate total quantity after increase', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));

      let totalQty = calculateTotalQuantity(state.items);
      expect(totalQty).toBe(1);

      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      totalQty = calculateTotalQuantity(state.items);
      expect(totalQty).toBe(2);
    });

    it('should recalculate total quantity after decrease', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      let totalQty = calculateTotalQuantity(state.items);
      expect(totalQty).toBe(3);

      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));
      totalQty = calculateTotalQuantity(state.items);
      expect(totalQty).toBe(2);
    });
  });

  // ============ Edge Cases and Complex Scenarios ============
  describe('Edge Cases and Complex Scenarios', () => {
    it('should handle empty cart after removing all items', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, removeFromCart(mockProducts.phone.id));

      expect(state.items).toHaveLength(0);
      expect(calculateTotalPrice(state.items)).toBe(0);
      expect(calculateTotalQuantity(state.items)).toBe(0);
    });

    it('should handle adding item after clearing cart', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, removeFromCart(mockProducts.phone.id));
      state = cartReducer(state, addToCart(mockProducts.laptop));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('2');
      expect(state.items[0].quantity).toBe(1);
    });

    it('should handle duplicate product IDs correctly', () => {
      const duplicateProduct = { ...mockProducts.phone };
      let state = initialState;
      state = cartReducer(state, addToCart(duplicateProduct));
      state = cartReducer(state, addToCart(duplicateProduct));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should maintain product properties after cart operations', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));

      const item = state.items[0];
      expect(item.name).toBe('iPhone 15');
      expect(item.price).toBe(999);
      expect(item.imageUrl).toBe('https://example.com/iphone.jpg');
      expect(item.category).toBe('Electronics');
    });

    it('should handle complex workflow: add, increase, add, decrease, remove', () => {
      let state = initialState;

      // Add phone
      state = cartReducer(state, addToCart(mockProducts.phone));
      expect(state.items).toHaveLength(1);

      // Increase phone quantity
      state = cartReducer(state, increaseQuantity(mockProducts.phone.id));
      expect(state.items[0].quantity).toBe(2);

      // Add laptop
      state = cartReducer(state, addToCart(mockProducts.laptop));
      expect(state.items).toHaveLength(2);

      // Decrease phone quantity
      state = cartReducer(state, decreaseQuantity(mockProducts.phone.id));
      expect(state.items[0].quantity).toBe(1);

      // Remove laptop
      state = cartReducer(state, removeFromCart(mockProducts.laptop.id));
      expect(state.items).toHaveLength(1);

      // Verify final state
      const total = calculateTotalPrice(state.items);
      const totalQty = calculateTotalQuantity(state.items);
      expect(total).toBe(999);
      expect(totalQty).toBe(1);
    });

    it('should maintain item order in cart', () => {
      let state = initialState;
      state = cartReducer(state, addToCart(mockProducts.phone));
      state = cartReducer(state, addToCart(mockProducts.laptop));
      state = cartReducer(state, addToCart(mockProducts.tablet));

      expect(state.items[0].id).toBe('1');
      expect(state.items[1].id).toBe('2');
      expect(state.items[2].id).toBe('3');
    });

    it('should handle large cart with many items', () => {
      let state = initialState;
      const products = [mockProducts.phone, mockProducts.laptop, mockProducts.tablet];

      // Add each product 10 times
      for (let i = 0; i < 10; i++) {
        for (const product of products) {
          state = cartReducer(state, addToCart(product));
        }
      }

      expect(state.items).toHaveLength(3);
      expect(state.items[0].quantity).toBe(10);
      expect(state.items[1].quantity).toBe(10);
      expect(state.items[2].quantity).toBe(10);

      const totalQty = calculateTotalQuantity(state.items);
      expect(totalQty).toBe(30);
    });
  });

  // ============ Action Creator Tests ============
  describe('Action Creators', () => {
    it('should create addToCart action with product payload', () => {
      const action = addToCart(mockProducts.phone);

      expect(action.type).toBe('cart/addToCart');
      expect(action.payload).toEqual(mockProducts.phone);
    });

    it('should create increaseQuantity action with product ID', () => {
      const action = increaseQuantity('1');

      expect(action.type).toBe('cart/increaseQuantity');
      expect(action.payload).toBe('1');
    });

    it('should create decreaseQuantity action with product ID', () => {
      const action = decreaseQuantity('1');

      expect(action.type).toBe('cart/decreaseQuantity');
      expect(action.payload).toBe('1');
    });

    it('should create removeFromCart action with product ID', () => {
      const action = removeFromCart('1');

      expect(action.type).toBe('cart/removeFromCart');
      expect(action.payload).toBe('1');
    });
  });
});
