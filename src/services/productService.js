import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products?id=${id}`);

    if (response.data.length === 0) {
      throw new Error('Product not found');
    }

    return response.data[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};