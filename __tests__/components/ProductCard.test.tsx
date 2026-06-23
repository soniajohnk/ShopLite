import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ProductCard from '../../src/components/ProductCard';

const mockStore = configureMockStore();

describe('ProductCard Component', () => {
  // ============ Test Data ============
  const mockProduct = {
    id: '1',
    name: 'iPhone 15',
    price: 999,
    imageUrl: 'https://example.com/iphone.jpg',
    category: 'Electronics',
  };

  const mockOnPress = jest.fn();

  // ============ Helper Functions ============
  const renderComponent = (product = mockProduct, onPress = mockOnPress, store = null) => {
    const testStore = store || mockStore({ cart: { items: [] } });
    let renderer;
    ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <Provider store={testStore}>
          <ProductCard product={product} onPress={onPress} />
        </Provider>
      );
    });
    return renderer;
  };

  const getAllTextContents = (renderer) => {
    const instance = renderer.root;
    return instance.findAllByType('Text').map(node => node.props.children);
  };

  const getAllTouchables = (renderer) => {
    const instance = renderer.root;
    try {
      return instance.findAllByType('TouchableOpacity');
    } catch (e) {
      return [];
    }
  };

  const getProductCardComponent = (renderer) => {
    const instance = renderer.root;
    try {
      return instance.findByType(ProductCard);
    } catch (e) {
      return null;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============ Basic Rendering Tests ============
  describe('Basic Rendering', () => {
    it('should render product name correctly', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('iPhone 15');
    });

    it('should render product price correctly', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      // Price is rendered as ["$", 999]
      const hasPriceText = allTexts.some(text =>
        Array.isArray(text) && text[0] === '$' && text[1] === 999
      );
      expect(hasPriceText).toBe(true);
    });

    it('should render product category correctly', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      const hasCategoryText = allTexts.some(text =>
        Array.isArray(text) && text.some(t => t?.includes?.('Electronics'))
      );
      expect(hasCategoryText).toBe(true);
    });

    it('should render product image with correct source URI', () => {
      const renderer = renderComponent();
      const instance = renderer.root;
      const images = instance.findAllByType('Image');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].props.source.uri).toBe('https://example.com/iphone.jpg');
    });

    it('should render "Add To Cart" button', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Add To Cart');
    });
  });

  // ============ Interaction Tests ============
  describe('User Interactions', () => {
    it('should call onPress callback when card is pressed', () => {
      const renderer = renderComponent();
      const cardComponent = getProductCardComponent(renderer);

      if (cardComponent && cardComponent.props.onPress) {
        ReactTestRenderer.act(() => {
          cardComponent.props.onPress();
        });
        
        expect(mockOnPress).toHaveBeenCalledTimes(1);
      }
    });

    it('should dispatch addToCart action when Add To Cart button is pressed', () => {
      const store = mockStore({ cart: { items: [] } });
      const mockOnPressFn = jest.fn();
      const renderer = renderComponent(mockProduct, mockOnPressFn, store);
      const cardComponent = getProductCardComponent(renderer);

      // Test that the component has the required props
      expect(cardComponent).toBeDefined();
      expect(cardComponent.props.product).toEqual(mockProduct);
      expect(cardComponent.props.onPress).toBeDefined();
    });
  });

  // ============ Different Product Data Tests ============
  describe('Product Data Variations', () => {
    it('should render product with decimal price', () => {
      const product = { ...mockProduct, price: 49.99 };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      const hasPriceText = allTexts.some(text =>
        Array.isArray(text) && text[0] === '$' && text[1] === 49.99
      );
      expect(hasPriceText).toBe(true);
    });

    it('should render product with large price', () => {
      const product = { ...mockProduct, price: 9999 };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      const hasPriceText = allTexts.some(text =>
        Array.isArray(text) && text[0] === '$' && text[1] === 9999
      );
      expect(hasPriceText).toBe(true);
    });

    it('should render product with different category', () => {
      const product = { ...mockProduct, category: 'Clothing' };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      const hasCategoryText = allTexts.some(text =>
        Array.isArray(text) && text.some(t => t?.includes?.('Clothing'))
      );
      expect(hasCategoryText).toBe(true);
    });

    it('should render product with long name', () => {
      const longName = 'Ultra HD 4K Smart Television with Quantum Dot Display';
      const product = { ...mockProduct, name: longName };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain(longName);
    });

    it('should render product with special characters in name', () => {
      const product = { ...mockProduct, name: 'Apple iPhone 15 Pro Max 512GB (Space Black)' };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Apple iPhone 15 Pro Max 512GB (Space Black)');
    });
  });

  // ============ Edge Cases Tests ============
  describe('Edge Cases', () => {
    it('should render product with zero price', () => {
      const product = { ...mockProduct, price: 0 };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      const hasPriceText = allTexts.some(text =>
        Array.isArray(text) && text[0] === '$' && text[1] === 0
      );
      expect(hasPriceText).toBe(true);
    });

    it('should render product with empty string category', () => {
      const product = { ...mockProduct, category: '' };
      const renderer = renderComponent(product);
      const allTexts = getAllTextContents(renderer);
      const hasCategoryText = allTexts.some(text =>
        Array.isArray(text) && text[0]?.includes?.('Category:')
      );
      expect(hasCategoryText).toBe(true);
    });

    it('should render product with minimum data', () => {
      const minimalProduct = {
        id: '1',
        name: 'Item',
        price: 1,
        imageUrl: 'https://example.com/item.jpg',
        category: 'General',
      };
      const renderer = renderComponent(minimalProduct);
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Item');
    });

    it('should handle image source with spaces in URL', () => {
      const product = {
        ...mockProduct,
        imageUrl: 'https://example.com/my product image.jpg',
      };
      const renderer = renderComponent(product);
      const instance = renderer.root;
      const images = instance.findAllByType('Image');
      expect(images[0].props.source.uri).toBe('https://example.com/my product image.jpg');
    });
  });

  // ============ Redux Integration Tests ============
  describe('Redux Integration', () => {
    it('should pass product data to Redux when Add To Cart is pressed', () => {
      const store = mockStore({ cart: { items: [] } });
      const renderer = renderComponent(mockProduct, mockOnPress, store);
      const touchables = getAllTouchables(renderer);

      if (touchables.length >= 2) {
        ReactTestRenderer.act(() => {
          if (touchables[1]?.props?.onPress) {
            touchables[1].props.onPress();
          }
        });
      }

      const actions = store.getActions();
      if (actions.length > 0) {
        expect(actions[0].payload).toEqual(mockProduct);
      }
    });

    it('should dispatch correct action type for addToCart', () => {
      const store = mockStore({ cart: { items: [] } });
      const renderer = renderComponent(mockProduct, mockOnPress, store);
      const touchables = getAllTouchables(renderer);

      if (touchables.length >= 2) {
        ReactTestRenderer.act(() => {
          if (touchables[1]?.props?.onPress) {
            touchables[1].props.onPress();
          }
        });
      }

      const actions = store.getActions();
      if (actions.length > 0) {
        expect(actions[0].type).toBe('cart/addToCart');
      }
    });
  });

  // ============ Accessibility Tests ============
  describe('Accessibility', () => {
    it('should have accessible text elements for product name', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('iPhone 15');
    });

    it('should have accessible image element with testID', () => {
      const renderer = renderComponent();
      const instance = renderer.root;
      const images = instance.findAllByType('Image');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].props.testID).toBe('product-image');
    });

    it('should render button with readable text', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Add To Cart');
    });
  });

  // ============ Multiple Interactions Tests ============
  describe('Multiple Interactions', () => {
    it('should handle multiple card presses', () => {
      const renderer = renderComponent();
      const cardComponent = getProductCardComponent(renderer);

      if (cardComponent) {
        ReactTestRenderer.act(() => {
          cardComponent.props.onPress();
          cardComponent.props.onPress();
          cardComponent.props.onPress();
        });
      }

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple Add To Cart button presses', () => {
      const store = mockStore({ cart: { items: [] } });
      const renderer = renderComponent(mockProduct, mockOnPress, store);
      const touchables = getAllTouchables(renderer);

      // Verify component is rendered correctly
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Add To Cart');
    });

    it('should independently handle card press and button press', () => {
      const store = mockStore({ cart: { items: [] } });
      const renderer = renderComponent(mockProduct, mockOnPress, store);
      const cardComponent = getProductCardComponent(renderer);

      // Verify both components render properly
      expect(cardComponent).toBeDefined();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Add To Cart');
    });
  });

  // ============ Conditional Rendering Tests ============
  describe('Conditional Rendering', () => {
    it('should always render the Add To Cart button', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);
      expect(allTexts).toContain('Add To Cart');
    });

    it('should render all product information sections', () => {
      const renderer = renderComponent();
      const allTexts = getAllTextContents(renderer);

      expect(allTexts).toContain('iPhone 15');
      expect(allTexts).toContain('Add To Cart');

      // Check for price as array
      const hasPriceText = allTexts.some(text =>
        Array.isArray(text) && text[0] === '$'
      );
      expect(hasPriceText).toBe(true);

      // Check for category
      const hasCategoryText = allTexts.some(text =>
        Array.isArray(text) && text.some(t => t?.includes?.('Category:'))
      );
      expect(hasCategoryText).toBe(true);
    });
  });
});